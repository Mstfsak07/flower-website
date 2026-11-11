import { OAuth2Client } from "google-auth-library";

import { apiError, apiOk, safeJson } from "@/lib/request";
import { createAuthSession, setAuthSession, upsertGoogleCustomerAccount } from "@/lib/auth-server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  if (!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return apiError("Google ile giriş henüz yapılandırılmadı.", 503);
  }

  const payload = await safeJson<{ credential?: string }>(request);
  if (!payload.ok) return payload.response;
  if (!payload.data.credential) return apiError("Google kimlik bilgisi eksik.", 400);

  try {
    const ticket = await new OAuth2Client(env.NEXT_PUBLIC_GOOGLE_CLIENT_ID).verifyIdToken({
      idToken: payload.data.credential,
      audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || !profile.email_verified) {
      return apiError("Doğrulanmış Google hesabı bulunamadı.", 401);
    }

    const user = await upsertGoogleCustomerAccount({
      subject: profile.sub,
      email: profile.email,
      name: profile.name ?? profile.email.split("@")[0],
    });
    await setAuthSession(createAuthSession(user));
    return apiOk({ redirectTo: "/hesabim", user });
  } catch {
    return apiError("Google oturumu doğrulanamadı.", 401);
  }
}
