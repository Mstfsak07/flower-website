import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { readAuthSessionFromRequest } from "@/lib/auth-server";
import { safeJson } from "@/lib/request";
import {
  createAdminProductRepo,
  getAdminProductsRepo,
} from "@/lib/repositories/admin-repository";
import { adminProductSchema } from "@/lib/schemas";
import { logAdminAction } from "@/lib/services/admin-audit-service";

export async function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  return NextResponse.json(await getAdminProductsRepo());
}

export async function POST(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = adminProductSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const product = await createAdminProductRepo(parsed.data);
  const session = readAuthSessionFromRequest(request);
  if (session?.user.role === "ADMIN") {
    await logAdminAction({
      action: "product.created",
      actorEmail: session.user.email,
      actorName: session.user.name,
      entityId: product.id,
      entityType: "product",
      metadata: {
        basePrice: product.basePrice,
        isActive: product.isActive,
      },
      summary: `${product.name} urunu olusturuldu.`,
    });
  }
  return NextResponse.json({ ok: true, product }, { status: 201 });
}
