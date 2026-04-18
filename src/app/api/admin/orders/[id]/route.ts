import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { getAdminOrderByIdRepo } from "@/lib/repositories/admin-repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const order = await getAdminOrderByIdRepo(id);
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
