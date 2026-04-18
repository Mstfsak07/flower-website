import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { getAdminOrdersRepo } from "@/lib/repositories/admin-repository";

export async function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  return NextResponse.json(await getAdminOrdersRepo());
}
