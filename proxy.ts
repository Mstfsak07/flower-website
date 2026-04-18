import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { readAuthSessionFromRequest } from "@/lib/auth-server";
import { env } from "@/lib/env";
import { isAdminRequestAuthorized } from "@/lib/admin-guard";

export function proxy(request: NextRequest) {
  const session = readAuthSessionFromRequest(request);
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (pathname.startsWith("/admin") && session?.user.role !== "ADMIN") {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/hesabim") && !session?.user) {
    const loginUrl = new URL("/giris", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/api/admin") && !isAdminRequestAuthorized(request)) {
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
