import { NextResponse } from "next/server";

import { generateBouquetVisual } from "@/lib/services/bouquet-visual-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const result = await generateBouquetVisual(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
