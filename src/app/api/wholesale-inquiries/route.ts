import { NextResponse } from "next/server";

import { createWholesaleInquiryRepo } from "@/lib/repositories/admin-repository";
import { wholesaleInquirySchema } from "@/lib/schemas";
import { notifyWholesaleInquiryCreated } from "@/lib/services/notification-service";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = wholesaleInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const inquiry = await createWholesaleInquiryRepo(parsed.data);

  // Notify admin (best-effort)
  notifyWholesaleInquiryCreated(inquiry).catch(() => undefined);

  return NextResponse.json({ ok: true, inquiry }, { status: 201 });
}
