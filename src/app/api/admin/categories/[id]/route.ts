import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { adminCategoryPatchSchema } from "@/lib/schemas";
import { categories } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const category = categories.find((c) => c.id === id);
  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const { id } = await params;
  const body = await request.json();
  const parsed = adminCategoryPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id, category: parsed.data });
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
