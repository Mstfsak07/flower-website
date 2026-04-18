import { NextResponse } from "next/server";

import { listFeaturedProducts } from "@/lib/services/catalog-service";

export async function GET() {
  return NextResponse.json(await listFeaturedProducts());
}
