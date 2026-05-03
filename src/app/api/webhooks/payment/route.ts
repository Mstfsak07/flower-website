import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { resolvePaymentProvider } from "@/lib/services/payment-service";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

type PaymentWebhookPayload = Record<string, FormDataEntryValue | string | undefined>;

function toPayloadEntries(data: FormData | Record<string, unknown>) {
  if (data instanceof FormData) {
    return Object.fromEntries(data.entries());
  }

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value == null ? undefined : String(value)]),
  );
}

async function readWebhookPayload(request: Request): Promise<PaymentWebhookPayload> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return toPayloadEntries(body);
  }

  const formData = await request.formData();
  return toPayloadEntries(formData);
}

function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function verifyProviderSignature(payload: PaymentWebhookPayload, request: Request) {
  const provider = resolvePaymentProvider();

  if (provider === "MOCK") {
    return true;
  }

  if (provider === "IYZICO") {
    const secret = env.IYZICO_WEBHOOK_SECRET;
    if (!secret) {
      return false;
    }

    const providedSignature =
      request.headers.get("x-iyz-signature") ?? String(payload.signature ?? "");
    if (!providedSignature) {
      return false;
    }

    const token = String(
      payload.token ?? payload.paymentConversationId ?? payload.conversationId ?? payload.orderNumber ?? "",
    );
    if (!token) {
      return false;
    }

    const expectedSignature = createHmac("sha256", secret).update(token).digest("hex");
    return secureEqual(providedSignature, expectedSignature);
  }

  if (provider === "PAYTR") {
    const token = env.PAYTR_CALLBACK_TOKEN;
    if (!token) {
      return false;
    }

    const providedToken =
      request.headers.get("x-paytr-token") ??
      String(payload.callbackToken ?? payload.token ?? payload.hash ?? "");

    return Boolean(providedToken) && secureEqual(providedToken, token);
  }

  return false;
}

function normalizeWebhookStatus(payload: PaymentWebhookPayload) {
  const rawStatus = String(payload.status ?? payload.paymentStatus ?? "").trim().toUpperCase();
  const successStates = new Set(["SUCCESS", "SUCCEEDED", "PAID", "OK"]);

  const paymentStatus: PaymentStatus = successStates.has(rawStatus) ? "PAID" : "FAILED";
  const orderStatus: OrderStatus = successStates.has(rawStatus) ? "PAID" : "CANCELLED";

  return { orderStatus, paymentStatus };
}

export async function POST(request: Request) {
  try {
    const payload = await readWebhookPayload(request);
    const orderNumber = String(
      payload.orderNumber ?? payload.merchant_oid ?? payload.conversationId ?? "",
    ).trim();

    if (!orderNumber) {
      return NextResponse.json({ message: "Order number missing" }, { status: 400 });
    }

    if (!verifyProviderSignature(payload, request)) {
      return NextResponse.json({ message: "Invalid webhook signature" }, { status: 401 });
    }

    const { orderStatus, paymentStatus } = normalizeWebhookStatus(payload);

    await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus,
        status: orderStatus,
      },
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
