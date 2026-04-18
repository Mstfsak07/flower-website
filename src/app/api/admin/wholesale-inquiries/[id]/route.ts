import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { adminInquiryStatusSchema } from "@/lib/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const body = await request.json();
  const parsed = adminInquiryStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id, inquiry: parsed.data });
}
