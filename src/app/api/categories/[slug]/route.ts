import { NextResponse } from "next/server";

import { getCategoryDetail } from "@/lib/services/catalog-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const category = await getCategoryDetail(slug);
  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}
