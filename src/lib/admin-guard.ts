/**
 * Admin auth guard.
 *
 * Behaviour:
 *  - In development/test without ADMIN_SECRET, admin routes stay open for demo/CI.
 *  - In production, ADMIN_SECRET is mandatory; missing secret denies all admin requests.
 *  - When ADMIN_SECRET is set, requests must supply Authorization: Bearer <ADMIN_SECRET>.
 *
 * Usage inside a Route Handler:
 *   const deny = requireAdmin(request);
 *   if (deny) return deny;
 */

import { NextResponse } from "next/server";
import { readAuthSessionFromRequest, readCurrentAuthUser, refreshSessionUser } from "@/lib/auth-server";
import type { AuthUser } from "@/lib/types";
import { env } from "@/lib/env";

function readBearerToken(request: Pick<Request, "headers">) {
  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
}

export function isAdminRequestAuthorized(request: Pick<Request, "headers">) {
  const session = readAuthSessionFromRequest(request);
  if (session?.user.role === "ADMIN") {
    return true;
  }

  const secret = env.ADMIN_SECRET;

  if (!secret) {
    return !env.isProduction;
  }

  return readBearerToken(request) === secret;
}

export async function readCurrentAdminUser(): Promise<AuthUser | null> {
  const user = await refreshSessionUser(await readCurrentAuthUser());
  return user?.role === "ADMIN" ? user : null;
}

export async function canCurrentUserAccessAdminPage() {
  return Boolean(await readCurrentAdminUser());
}

export function requireAdmin(request: Request): NextResponse | null {
  if (!isAdminRequestAuthorized(request)) {
    const message =
      env.isProduction && !env.ADMIN_SECRET
        ? "Unauthorized: ADMIN_SECRET is required in production"
        : "Unauthorized";
    return NextResponse.json(
      { message },
      { status: 401 },
    );
  }

  return null;
}
