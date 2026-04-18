import { NextResponse } from "next/server";

import { listCategories } from "@/lib/services/catalog-service";

export async function GET() {
  return NextResponse.json(await listCategories());
}
