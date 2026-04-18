import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ok: true, item: body });
}

export function DELETE() {
  return NextResponse.json({ ok: true });
}
