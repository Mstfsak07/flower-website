import { apiError, apiOk, safeJson } from "@/lib/request";
import { createAuthSession, registerCustomerAccount, setAuthSession } from "@/lib/auth-server";
import { authRegisterSchema } from "@/lib/schemas";

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

  return apiOk(
    {
      redirectTo: "/hesabim",
      user: result.user,
    },
    { status: 201 },
  );
}
