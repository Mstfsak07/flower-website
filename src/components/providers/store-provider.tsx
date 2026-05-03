"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { seedInquiries, seedOrders } from "@/lib/data";
import type { CartItem, Order, WholesaleInquiry } from "@/lib/types";

type StoreContextValue = {
  cart: CartItem[];
  orders: Order[];
  inquiries: WholesaleInquiry[];
  hydrated: boolean;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  recordOrder: (order: Order) => void;
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
      recordOrder(order) {
        setOrders((current) => [order, ...current.filter((entry) => entry.orderNumber !== order.orderNumber)]);
        setCart([]);
        toast.success("Siparis olusturuldu.");
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
