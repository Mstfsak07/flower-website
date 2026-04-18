import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    mode: "client-managed",
    message: "Cart is currently stored in local state/localStorage for MVP.",
  });
}
