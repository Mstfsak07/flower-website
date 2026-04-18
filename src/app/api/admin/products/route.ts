import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { adminProductSchema } from "@/lib/schemas";
import { products } from "@/lib/data";

export function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const body = await request.json();
  const parsed = adminProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ ok: true, product: parsed.data }, { status: 201 });
}
