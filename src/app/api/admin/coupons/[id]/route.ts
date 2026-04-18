import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { adminCouponPatchSchema } from "@/lib/schemas";
import { coupons } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const coupon = coupons.find((c) => c.id === id);
  if (!coupon) {
    return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
  }

  return NextResponse.json(coupon);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const body = await request.json();
  const parsed = adminCouponPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id, coupon: parsed.data });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  return NextResponse.json({ ok: true, id });
}
