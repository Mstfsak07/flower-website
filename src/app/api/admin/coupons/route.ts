import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { createAdminCouponRepo, getAdminCouponsRepo } from "@/lib/repositories/admin-repository";
import { safeJson } from "@/lib/request";
import { adminCouponSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  return NextResponse.json(await getAdminCouponsRepo());
}

export async function POST(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = adminCouponSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const coupon = await createAdminCouponRepo(parsed.data);
  return NextResponse.json({ ok: true, coupon }, { status: 201 });
}
