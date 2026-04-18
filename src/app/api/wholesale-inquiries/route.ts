import { NextResponse } from "next/server";

import { wholesaleInquirySchema } from "@/lib/schemas";
import { sendMail } from "@/lib/services/mail-service";
import { renderWholesaleInquiryEmail } from "@/emails/wholesale-inquiry";
import type { WholesaleInquiry } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = wholesaleInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const now = new Date().toISOString();
  const inquiry: WholesaleInquiry = {
    id: `inq-${Date.now()}`,
    status: "NEW",
    createdAt: now,
    updatedAt: now,
    ...parsed.data,
  };

  // Notify admin (best-effort)
  sendMail({
    to: process.env.ADMIN_EMAIL ?? "admin@lunacicek.test",
    subject: `Yeni toptan talep — ${inquiry.fullName}`,
    html: renderWholesaleInquiryEmail(inquiry),
  }).catch(() => {});

  return NextResponse.json({ ok: true, inquiry }, { status: 201 });
}
