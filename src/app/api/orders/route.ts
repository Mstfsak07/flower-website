import { NextResponse } from "next/server";

import { findUserIdByEmail, readAuthSessionFromRequest } from "@/lib/auth-server";
import { createPaymentSession, resolvePaymentProvider } from "@/lib/services/payment-service";
import { notifyOrderCreated } from "@/lib/services/notification-service";
import { safeJson } from "@/lib/request";
import { createOrderSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { validateCheckout, validateCoupon } from "@/lib/services/checkout-service";
import { resolveCanonicalCartItems } from "@/lib/services/catalog-service";
import { calculateGrandTotal } from "@/lib/commerce";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { onlinePaymentEnabled } from "@/lib/payment-flags";
import { generateOrderNumber } from "@/lib/utils";

function toOrderStatus(paymentMethod: string): { status: OrderStatus; paymentStatus: PaymentStatus } {
  if (paymentMethod === "CASH_ON_DELIVERY") {
    return { status: "PENDING", paymentStatus: "UNPAID" };
  }

  return { status: "PENDING", paymentStatus: "UNPAID" };
}

function normalizeCanonicalError(message: string) {
  if (message.startsWith("PRODUCT_NOT_FOUND")) {
    return { status: 422, message: "Sepetteki urunlerden biri artik mevcut degil." };
  }

  if (message.startsWith("VARIANT_NOT_FOUND")) {
    return { status: 422, message: "Sepetteki varyantlardan biri artik gecerli degil." };
  }

  if (message.startsWith("INVALID_OPTION") || message.startsWith("MISSING_OPTION")) {
    return { status: 422, message: "Sepetteki urun seceneklerinden biri gecersiz." };
  }

  return { status: 400, message: "Siparis kalemleri dogrulanamadi." };
}

function mapOrderForResponse(order: Order, persisted = false) {
  return {
    order,
    orderNumber: order.orderNumber,
    grandTotal: order.grandTotal,
    persisted,
  };
}

export async function POST(request: Request) {
  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = createOrderSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  if (data.paymentMethod === "CARD" && !onlinePaymentEnabled) {
    return NextResponse.json(
      { message: "Online kart ödemesi şu anda aktif değil. Lütfen Havale / EFT yöntemini seçin." },
      { status: 422 },
    );
  }

  const checkoutInfo = await validateCheckout(data);
  if (!checkoutInfo.deliveryZone) {
    return NextResponse.json(
      { message: "Delivery not available for selected city/district" },
      { status: 422 },
    );
  }

  let canonical;
  try {
    canonical = await resolveCanonicalCartItems(data.items);
  } catch (error) {
    const details = normalizeCanonicalError(error instanceof Error ? error.message : "");
    return NextResponse.json({ message: details.message }, { status: details.status });
  }

  let discountTotal = 0;
  let appliedCouponCode: string | undefined;
  if (data.couponCode?.trim()) {
    const couponResult = await validateCoupon(data.couponCode, canonical.subtotal);
    if (!couponResult.valid) {
      return NextResponse.json({ message: couponResult.reason ?? "Coupon not valid" }, { status: 422 });
    }

    discountTotal = couponResult.discountTotal;
    appliedCouponCode = couponResult.coupon?.code ?? data.couponCode.trim().toUpperCase();
  }

  const deliveryFee = checkoutInfo.deliveryZone.fee;
  const grandTotal = calculateGrandTotal(canonical.subtotal, discountTotal, deliveryFee);
  const orderNumber = generateOrderNumber();
  const now = new Date();
  const state = toOrderStatus(data.paymentMethod);
  const session = readAuthSessionFromRequest(request);
  const normalizedCustomerEmail = data.customerEmail.trim().toLowerCase();
  const currentUserId =
    session?.user.role === "CUSTOMER" && session.user.email.trim().toLowerCase() === normalizedCustomerEmail
      ? session.user.id ?? (await findUserIdByEmail(session.user.email))
      : null;

  const order: Order = {
    id: `order-${now.getTime()}`,
    orderNumber,
    status: state.status,
    paymentStatus: state.paymentStatus,
    paymentMethod: data.paymentMethod,
    subtotal: canonical.subtotal,
    discountTotal,
    deliveryFee,
    grandTotal,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: normalizedCustomerEmail,
    recipientName: data.recipientName,
    recipientPhone: data.recipientPhone,
    deliveryDate: data.deliveryDate,
    deliverySlot: data.deliverySlot,
    cardMessage: data.cardMessage,
    note: data.note,
    couponCode: appliedCouponCode,
    addressSnapshotJson: JSON.stringify({
      city: data.city,
      district: data.district,
      neighborhood: data.neighborhood,
      addressLine: data.addressLine,
    }),
    items: canonical.items.map((item, index) => ({
      id: `item-${now.getTime()}-${index}`,
      productId: item.productId,
      productName: item.productName,
      variantName: item.variantName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      note: item.note,
      selectedOptionsJson: item.selectedOptions ? JSON.stringify(item.selectedOptions) : undefined,
    })),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  let persistedOrder = order;
  let persisted = false;

  try {
    const created = await prisma.order.create({
      data: {
        orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        discountTotal: order.discountTotal,
        deliveryFee: order.deliveryFee,
        grandTotal: order.grandTotal,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        userId: currentUserId,
        recipientName: order.recipientName,
        recipientPhone: order.recipientPhone,
        deliveryDate: new Date(order.deliveryDate),
        deliverySlot: order.deliverySlot,
        cardMessage: order.cardMessage,
        note: order.note,
        addressSnapshotJson: JSON.parse(order.addressSnapshotJson),
        couponCode: order.couponCode,
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            note: item.note,
            selectedOptionsJson: item.selectedOptionsJson ? JSON.parse(item.selectedOptionsJson) : undefined,
          })),
        },
      },
      include: { items: true },
    });

    persistedOrder = {
      ...order,
      id: created.id,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      deliveryDate: created.deliveryDate.toISOString(),
      addressSnapshotJson: JSON.stringify(created.addressSnapshotJson),
      items: created.items.map((item) => ({
        id: item.id,
        productId: item.productId ?? "",
        productName: item.productName,
        variantName: item.variantName ?? undefined,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        note: item.note ?? undefined,
        selectedOptionsJson: item.selectedOptionsJson ? JSON.stringify(item.selectedOptionsJson) : undefined,
      })),
    };
    persisted = true;
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ message: "Siparis kaydedilemedi. Lutfen tekrar deneyin." }, { status: 500 });
  }

  const payment =
    data.paymentMethod !== "CASH_ON_DELIVERY"
      ? createPaymentSession({
          provider: resolvePaymentProvider(),
          orderNumber,
          amount: grandTotal,
        })
      : null;

  notifyOrderCreated(persistedOrder).catch(() => undefined);

  return NextResponse.json(
    {
      ok: true,
      ...mapOrderForResponse(persistedOrder, persisted),
      payment,
    },
    { status: 201 },
  );
}
