import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import { renderOrderConfirmationEmail } from "@/emails/order-confirmation";
import { renderOrderStatusUpdateEmail } from "@/emails/order-status-update";
import { renderWholesaleInquiryEmail } from "@/emails/wholesale-inquiry";
import { env } from "@/lib/env";
import { sendMail } from "@/lib/services/mail-service";
import type { Order, WholesaleInquiry } from "@/lib/types";

type NotificationEntry = {
  id: string;
  event: "order.created" | "order.status.updated" | "wholesale.created";
  html?: string;
  metadata?: Record<string, unknown>;
  result: Awaited<ReturnType<typeof sendMail>>;
  subject: string;
  to: string;
  createdAt: string;
};

const OUTBOX_PATH = path.join(process.cwd(), ".runtime", "notification-outbox.jsonl");

async function writeOutbox(entry: NotificationEntry) {
  await mkdir(path.dirname(OUTBOX_PATH), { recursive: true });
  await appendFile(OUTBOX_PATH, `${JSON.stringify(entry)}\n`, "utf8");
}

async function deliverNotification(input: {
  event: NotificationEntry["event"];
  metadata?: Record<string, unknown>;
  subject: string;
  html: string;
  to: string;
}) {
  const result = await sendMail({
    html: input.html,
    subject: input.subject,
    to: input.to,
  });

  await writeOutbox({
    createdAt: new Date().toISOString(),
    event: input.event,
    id: crypto.randomUUID(),
    metadata: input.metadata,
    result,
    subject: input.subject,
    to: input.to,
  });

  return result;
}

function adminRecipient() {
  return env.ADMIN_EMAIL ?? "admin@irisatalier.test";
}

export async function notifyOrderCreated(order: Order) {
  await Promise.allSettled([
    deliverNotification({
      event: "order.created",
      html: renderOrderConfirmationEmail(order),
      metadata: {
        grandTotal: order.grandTotal,
        orderNumber: order.orderNumber,
        paymentMethod: order.paymentMethod,
      },
      subject: `Siparisiniz alindi — ${order.orderNumber}`,
      to: order.customerEmail,
    }),
    deliverNotification({
      event: "order.created",
      html: `
        <div style="font-family:Arial,sans-serif;color:#3c2b30;">
          <h2>Yeni siparis olustu</h2>
          <p><strong>No:</strong> ${order.orderNumber}</p>
          <p><strong>Musteri:</strong> ${order.customerName} (${order.customerEmail})</p>
          <p><strong>Toplam:</strong> ${order.grandTotal}</p>
          <p><strong>Teslimat:</strong> ${order.deliveryDate} / ${order.deliverySlot}</p>
        </div>
      `.trim(),
      metadata: {
        audience: "admin",
        orderNumber: order.orderNumber,
        status: order.status,
      },
      subject: `Yeni siparis — ${order.orderNumber}`,
      to: adminRecipient(),
    }),
  ]);
}

export async function notifyOrderStatusChanged(order: Order) {
  await deliverNotification({
    event: "order.status.updated",
    html: renderOrderStatusUpdateEmail(order),
    metadata: {
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      status: order.status,
    },
    subject: `Siparis durumu guncellendi — ${order.orderNumber}`,
    to: order.customerEmail,
  });
}

export async function notifyWholesaleInquiryCreated(inquiry: WholesaleInquiry) {
  await deliverNotification({
    event: "wholesale.created",
    html: renderWholesaleInquiryEmail(inquiry),
    metadata: {
      companyName: inquiry.companyName,
      eventDate: inquiry.eventDate,
      inquiryId: inquiry.id,
      quantity: inquiry.quantity,
    },
    subject: `Yeni toptan talep — ${inquiry.fullName}`,
    to: adminRecipient(),
  });
}
