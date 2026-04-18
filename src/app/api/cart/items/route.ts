import { NextResponse } from "next/server";

import { cartItemSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = cartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ ok: true, item: parsed.data }, { status: 201 });
}
