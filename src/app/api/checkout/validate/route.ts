import { NextResponse } from "next/server";

import { safeJson } from "@/lib/request";
import { checkoutValidationSchema } from "@/lib/schemas";
import { validateCheckout } from "@/lib/services/checkout-service";

export async function POST(request: Request) {
  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = checkoutValidationSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json(await validateCheckout(parsed.data));
}
