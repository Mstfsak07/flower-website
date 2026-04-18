"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { coupons, deliveryZones, getProductById, seedInquiries, seedOrders } from "@/lib/data";
import { generateOrderNumber } from "@/lib/utils";
import type { CartItem, CheckoutPayload, Order, OrderItem, WholesaleInquiry } from "@/lib/types";

type StoreContextValue = {
  cart: CartItem[];
  orders: Order[];
  inquiries: WholesaleInquiry[];
  hydrated: boolean;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (payload: CheckoutPayload) => Order;
  submitWholesaleInquiry: (
    payload: Omit<WholesaleInquiry, "id" | "status" | "createdAt" | "updatedAt">,
  ) => WholesaleInquiry;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "cicekci-cart";
const ORDER_KEY = "cicekci-orders";
const INQUIRY_KEY = "cicekci-inquiries";

function readStorage<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(CART_KEY, []));
  const [orders, setOrders] = useState<Order[]>(() => readStorage<Order[]>(ORDER_KEY, seedOrders));
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>(() =>
    readStorage<WholesaleInquiry[]>(INQUIRY_KEY, seedInquiries),
  );
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    window.localStorage.setItem(INQUIRY_KEY, JSON.stringify(inquiries));
  }, [inquiries]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      orders,
      inquiries,
      hydrated,
      addToCart(item) {
        setCart((current) => {
          const existing = current.find(
            (entry) =>
              entry.productId === item.productId &&
              entry.variantId === item.variantId &&
              JSON.stringify(entry.selectedOptions) === JSON.stringify(item.selectedOptions),
          );

          if (existing) {
            toast.success("Sepetteki urun guncellendi.");
            return current.map((entry) =>
              entry.id === existing.id
                ? { ...entry, quantity: entry.quantity + item.quantity, note: item.note }
                : entry,
            );
          }

          toast.success("Urun sepete eklendi.");
          return [...current, { ...item, id: crypto.randomUUID() }];
        });
      },
      removeFromCart(itemId) {
        setCart((current) => current.filter((item) => item.id !== itemId));
        toast.message("Urun sepetten kaldirildi.");
      },
      updateQuantity(itemId, quantity) {
        setCart((current) =>
          current.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        );
      },
      clearCart() {
        setCart([]);
      },
      createOrder(payload) {
        const items: OrderItem[] = cart.map((item) => {
          const product = getProductById(item.productId);
          const variant = product?.variants.find((entry) => entry.id === item.variantId);
          const variantName = variant ? `${variant.name}: ${variant.value}` : undefined;
          return {
            id: crypto.randomUUID(),
            productId: item.productId,
            productName: product?.name ?? "Urun",
            variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            note: item.note,
            selectedOptionsJson: JSON.stringify(item.selectedOptions ?? {}),
          };
        });

        const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
        const coupon = coupons.find((entry) => entry.code === payload.couponCode);
        let discountTotal = 0;
        if (coupon && subtotal >= coupon.minOrderAmount) {
          if (coupon.type === "PERCENT") {
            discountTotal = Math.round((subtotal * coupon.value) / 100);
          } else {
            discountTotal = coupon.value;
          }

          if (coupon.maxDiscountAmount) {
            discountTotal = Math.min(discountTotal, coupon.maxDiscountAmount);
          }
        }

        const zone =
          deliveryZones.find(
            (entry) =>
              entry.city.toLocaleLowerCase("tr-TR") === payload.city.toLocaleLowerCase("tr-TR") &&
              entry.district.toLocaleLowerCase("tr-TR") ===
                payload.district.toLocaleLowerCase("tr-TR"),
          ) ?? deliveryZones[0];

        const now = new Date().toISOString();
        const order: Order = {
          id: crypto.randomUUID(),
          orderNumber: generateOrderNumber(),
          status: payload.paymentMethod === "CARD" ? "PAID" : "PENDING",
          paymentStatus: payload.paymentMethod === "CARD" ? "PAID" : "UNPAID",
          paymentMethod: payload.paymentMethod,
          subtotal,
          discountTotal,
          deliveryFee: zone?.fee ?? 0,
          grandTotal: subtotal - discountTotal + (zone?.fee ?? 0),
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          customerEmail: payload.customerEmail,
          recipientName: payload.recipientName,
          recipientPhone: payload.recipientPhone,
          deliveryDate: payload.deliveryDate,
          deliverySlot: payload.deliverySlot,
          cardMessage: payload.cardMessage,
          note: payload.note,
          addressSnapshotJson: JSON.stringify({
            city: payload.city,
            district: payload.district,
            neighborhood: payload.neighborhood,
            addressLine: payload.addressLine,
          }),
          couponCode: payload.couponCode,
          items,
          createdAt: now,
          updatedAt: now,
        };

        setOrders((current) => [order, ...current]);
        setCart([]);
        toast.success("Siparis olusturuldu.");
        return order;
      },
      submitWholesaleInquiry(payload) {
        const now = new Date().toISOString();
        const inquiry: WholesaleInquiry = {
          ...payload,
          id: crypto.randomUUID(),
          status: "NEW",
          createdAt: now,
          updatedAt: now,
        };
        setInquiries((current) => [inquiry, ...current]);
        toast.success("Toptan talebiniz alindi.");
        return inquiry;
      },
    }),
    [cart, hydrated, inquiries, orders],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("useStore must be used within StoreProvider");
  }

  return value;
}
