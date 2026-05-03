import { NextResponse } from "next/server";

import { seedOrders } from "@/lib/data";
import { demoOrderStore, prisma } from "@/lib/prisma";
import { orderTrackingLookupSchema } from "@/lib/schemas";

function matchesContact(
  order: { customerEmail: string; customerPhone: string; recipientPhone: string },
  contact: string,
) {
  const normalizedContact = contact.trim().toLocaleLowerCase("tr-TR");

  return [order.customerEmail, order.customerPhone, order.recipientPhone].some(
    (value) => value.trim().toLocaleLowerCase("tr-TR") === normalizedContact,
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const url = new URL(request.url);
  const parsedLookup = orderTrackingLookupSchema.safeParse({
    orderNumber,
    contact: url.searchParams.get("contact"),
  });

  if (!parsedLookup.success) {
    return NextResponse.json({ message: "Siparis numarasi ve iletisim bilgisi gerekli." }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order || !matchesContact(order, parsedLookup.data.contact)) {
      return NextResponse.json({ message: "Siparis bulunamadi veya dogrulanamadi." }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: Number(order.subtotal),
      discountTotal: Number(order.discountTotal),
      deliveryFee: Number(order.deliveryFee),
      grandTotal: Number(order.grandTotal),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      recipientName: order.recipientName,
      recipientPhone: order.recipientPhone,
      deliveryDate: order.deliveryDate.toISOString(),
      deliverySlot: order.deliverySlot,
      cardMessage: order.cardMessage ?? undefined,
      note: order.note ?? undefined,
      addressSnapshotJson: JSON.stringify(order.addressSnapshotJson),
      couponCode: order.couponCode ?? undefined,
      items: order.items.map((item) => ({
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
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Order tracking error:", error);
  }

  const order =
    demoOrderStore.findByOrderNumber(orderNumber) ??
    seedOrders.find((entry) => entry.orderNumber === orderNumber);

  if (!order || !matchesContact(order, parsedLookup.data.contact)) {
    return NextResponse.json({ message: "Siparis bulunamadi veya dogrulanamadi." }, { status: 404 });
  }

  return NextResponse.json(order);
}
