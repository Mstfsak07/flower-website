import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@/lib/env";
import { isAdminRequestAuthorized } from "@/lib/admin-guard";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (request.nextUrl.pathname.startsWith("/api/admin") && !isAdminRequestAuthorized(request)) {
    const message =
      env.isProduction && !env.ADMIN_SECRET
        ? "Unauthorized: ADMIN_SECRET is required in production"
        : "Unauthorized";
    return NextResponse.json({ ok: false, message }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
