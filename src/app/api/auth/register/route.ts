import { apiError, apiOk, safeJson } from "@/lib/request";
import { createAuthSession, createEmailVerificationToken, registerCustomerAccount, setAuthSession } from "@/lib/auth-server";
import { authRegisterSchema } from "@/lib/schemas";
import { renderEmailVerificationEmail } from "@/emails/email-verification";
import { sendMail } from "@/lib/services/mail-service";

export async function POST(request: Request) {
  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = authRegisterSchema.safeParse(payload.data);
  if (!parsed.success) {
    return apiError("Kayit bilgileri gecersiz.", 400, parsed.error.flatten());
  }

  const result = await registerCustomerAccount(parsed.data);
  if (!result.ok) {
    return apiError(result.message, 409);
  }

  await setAuthSession(createAuthSession(result.user));

  const verificationToken = createEmailVerificationToken({
    email: result.user.email,
    id: result.user.id,
  });
  const verificationUrl = new URL(`/api/auth/verify-email?token=${encodeURIComponent(verificationToken)}`, request.url);
  await sendMail({
    html: renderEmailVerificationEmail({
      customerName: result.user.name,
      verificationUrl: verificationUrl.toString(),
    }),
    subject: "E-posta adresinizi doğrulayın",
    to: result.user.email,
  });

  return apiOk(
    {
      message: "Dogrulama e-postasi gonderildi.",
      redirectTo: "/hesabim",
      user: result.user,
    },
    { status: 201 },
  );
}
