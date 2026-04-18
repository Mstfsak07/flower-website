import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { getVisualConfigsRepo } from "@/lib/repositories/admin-repository";
import { safeJson } from "@/lib/request";

export async function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  return NextResponse.json(await getVisualConfigsRepo());
}

export async function PATCH(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const body = payload.data;
  // body is expected to be a key-value map: { [key: string]: string }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { message: "Body must be a key-value object" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, updated: body });
}
