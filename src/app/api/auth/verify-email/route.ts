import { NextResponse } from "next/server";

import {
  createAuthSession,
  markEmailAsVerified,
  readAuthSession,
  readEmailVerificationToken,
  setAuthSession,
} from "@/lib/auth-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const payload = readEmailVerificationToken(token);

  if (!payload) {
    return NextResponse.redirect(new URL("/giris?emailVerification=invalid", url));
  }

  const verified = await markEmailAsVerified(payload);
  if (!verified) {
    return NextResponse.redirect(new URL("/giris?emailVerification=invalid", url));
  }

  const session = await readAuthSession();
  if (
    session?.user &&
    session.user.email.trim().toLowerCase() === payload.email &&
    (!payload.id || !session.user.id || session.user.id === payload.id)
  ) {
    await setAuthSession(
      createAuthSession({
        ...session.user,
        emailVerified: true,
      }),
    );
  }

  return NextResponse.redirect(new URL("/hesabim?emailVerification=success", url));
}
