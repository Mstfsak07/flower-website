import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { readAuthSessionFromRequest } from "@/lib/auth-server";
import { safeJson } from "@/lib/request";
import {
  getAdminOrderByIdRepo,
  updateAdminOrderStatusRepo,
} from "@/lib/repositories/admin-repository";
import { adminOrderStatusSchema } from "@/lib/schemas";
import { logAdminAction } from "@/lib/services/admin-audit-service";
import { notifyOrderStatusChanged } from "@/lib/services/notification-service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const existing = await getAdminOrderByIdRepo(id);
  if (!existing) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = adminOrderStatusSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const order = await updateAdminOrderStatusRepo(id, parsed.data);
  const session = readAuthSessionFromRequest(request);

  if (order && session?.user.role === "ADMIN") {
    await logAdminAction({
      action: "order.status.updated",
      actorEmail: session.user.email,
      actorName: session.user.name,
      entityId: order.id,
      entityType: "order",
      metadata: {
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
      summary: `${order.orderNumber} siparisi ${order.status} olarak guncellendi.`,
    });
  }

  if (order) {
    notifyOrderStatusChanged(order).catch(() => undefined);
  }

  return NextResponse.json({ ok: true, id, order });
}
