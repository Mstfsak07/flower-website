import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { adminCategorySchema } from "@/lib/schemas";
import { categories } from "@/lib/data";

export function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const body = await request.json();
  const parsed = adminCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ ok: true, category: parsed.data }, { status: 201 });
}
