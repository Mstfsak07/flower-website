import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { getAdminSettingsRepo } from "@/lib/repositories/admin-repository";
import { safeJson } from "@/lib/request";
import { adminSettingsPatchSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  return NextResponse.json(await getAdminSettingsRepo());
}

export async function PATCH(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = adminSettingsPatchSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ ok: true, settings: parsed.data });
}
