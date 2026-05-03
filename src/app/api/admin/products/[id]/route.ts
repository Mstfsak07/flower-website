import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { readAuthSessionFromRequest } from "@/lib/auth-server";
import { safeJson } from "@/lib/request";
import {
  deleteAdminProductRepo,
  getAdminProductByIdRepo,
  updateAdminProductRepo,
} from "@/lib/repositories/admin-repository";
import { adminProductPatchSchema } from "@/lib/schemas";
import { logAdminAction } from "@/lib/services/admin-audit-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const product = await getAdminProductByIdRepo(id);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const existing = await getAdminProductByIdRepo(id);
  if (!existing) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const parsed = adminProductPatchSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const product = await updateAdminProductRepo(id, parsed.data);
  const session = readAuthSessionFromRequest(request);
  if (product && session?.user.role === "ADMIN") {
    await logAdminAction({
      action: "product.updated",
      actorEmail: session.user.email,
      actorName: session.user.name,
      entityId: product.id,
      entityType: "product",
      metadata: {
        basePrice: product.basePrice,
        isActive: product.isActive,
      },
      summary: `${product.name} urunu guncellendi.`,
    });
  }
  return NextResponse.json({ ok: true, id, product });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const existing = await getAdminProductByIdRepo(id);
  if (!existing) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const deleted = await deleteAdminProductRepo(id);
  if (!deleted) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const session = readAuthSessionFromRequest(request);
  if (session?.user.role === "ADMIN") {
    await logAdminAction({
      action: "product.deleted",
      actorEmail: session.user.email,
      actorName: session.user.name,
      entityId: existing.id,
      entityType: "product",
      summary: `${existing.name} urunu silindi.`,
    });
  }

  return NextResponse.json({ ok: true, id });
}
