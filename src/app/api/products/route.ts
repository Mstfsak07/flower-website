import { NextResponse } from "next/server";

import { listProducts } from "@/lib/services/catalog-service";

export async function GET() {
  return NextResponse.json(await listProducts());
}
