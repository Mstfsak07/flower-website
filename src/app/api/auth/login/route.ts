import { apiError, apiOk, safeJson } from "@/lib/request";
import { getDefaultRouteByRole, sanitizeRedirectPath } from "@/lib/auth";
import {
  authenticateCustomerAccount,
  createAuthSession,
  setAuthSession,
  verifyAdminCredentials,
} from "@/lib/auth-server";
import { authLoginSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = authLoginSchema.safeParse(payload.data);
  if (!parsed.success) {
    return apiError("Gecersiz giris bilgileri.", 400, parsed.error.flatten());
  }

  const { email, password, redirectTo } = parsed.data;
  const adminUser = verifyAdminCredentials(email, password);
  const user = adminUser ?? (await authenticateCustomerAccount(email, password));

  if (!user) {
    return apiError("E-posta veya sifre hatali.", 401);
  }

  await setAuthSession(createAuthSession(user));

  return apiOk({
    redirectTo: sanitizeRedirectPath(redirectTo, getDefaultRouteByRole(user.role)),
    user,
  });
}
