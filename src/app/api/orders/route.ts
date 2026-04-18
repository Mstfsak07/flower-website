import { NextResponse } from "next/server";

import { generateOrderNumber } from "@/lib/utils";
import { safeJson } from "@/lib/request";
import { checkoutValidationSchema } from "@/lib/schemas";
import { validateCoupon, validateCheckout } from "@/lib/services/checkout-service";
import { createPaymentSession, resolvePaymentProvider } from "@/lib/services/payment-service";
import { sendMail } from "@/lib/services/mail-service";
import { renderOrderConfirmationEmail } from "@/emails/order-confirmation";
import { calculateSubtotal, calculateGrandTotal } from "@/lib/commerce";
import type { Order } from "@/lib/types";

export async function POST(request: Request) {
  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const body = payload.data;

  const parsed = checkoutValidationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  // Validate delivery zone
  const checkoutInfo = validateCheckout(data);
  if (!checkoutInfo.deliveryZone) {
    return NextResponse.json(
      { message: "Delivery not available for selected city/district" },
      { status: 422 },
    );
  }

  const subtotal = calculateSubtotal(items);
  const deliveryFee = checkoutInfo.deliveryZone.fee;

  let discountTotal = 0;
  if (data.couponCode) {
    const couponResult = validateCoupon(data.couponCode, subtotal);
    if (couponResult.valid) {
      discountTotal = couponResult.discountTotal;
    }
  }

  const grandTotal = calculateGrandTotal(subtotal, discountTotal, deliveryFee);
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber,
    status: "PENDING",
    paymentStatus: data.paymentMethod === "CASH_ON_DELIVERY" ? "UNPAID" : "UNPAID",
    paymentMethod: data.paymentMethod,
    subtotal,
    discountTotal,
    deliveryFee,
    grandTotal,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail,
    recipientName: data.recipientName,
    recipientPhone: data.recipientPhone,
    deliveryDate: data.deliveryDate,
    deliverySlot: data.deliverySlot,
    cardMessage: data.cardMessage,
    note: data.note,
    couponCode: data.couponCode,
    addressSnapshotJson: JSON.stringify({
      city: data.city,
      district: data.district,
      neighborhood: data.neighborhood,
      addressLine: data.addressLine,
    }),
    items: items.map((item: { productId: string; productName?: string; variantName?: string; quantity: number; unitPrice: number; note?: string; selectedOptions?: Record<string, string | boolean> }) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productId: item.productId,
      productName: item.productName ?? item.productId,
      variantName: item.variantName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      note: item.note,
      selectedOptionsJson: item.selectedOptions
        ? JSON.stringify(item.selectedOptions)
        : undefined,
    })),
    createdAt: now,
    updatedAt: now,
  };

  // Initiate payment session (non-blocking for COD)
  const payment =
    data.paymentMethod !== "CASH_ON_DELIVERY"
      ? createPaymentSession({
          provider: resolvePaymentProvider(),
          orderNumber,
          amount: grandTotal,
        })
      : null;

  // Fire confirmation email (best-effort — do not block response)
  sendMail({
    to: data.customerEmail,
    subject: `Siparisiz alindi — ${orderNumber}`,
    html: renderOrderConfirmationEmail(order),
  }).catch(() => {
    // swallow in demo mode; real providers will surface errors via their SDK
  });

  return NextResponse.json(
    {
      ok: true,
      orderNumber,
      grandTotal,
      payment,
    },
    { status: 201 },
  );
}
