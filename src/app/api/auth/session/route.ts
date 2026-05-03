import { apiOk } from "@/lib/request";
import { clearAuthSession, createAuthSession, readAuthSession, refreshSessionUser, setAuthSession } from "@/lib/auth-server";

export async function GET() {
  const session = await readAuthSession();
  const user = await refreshSessionUser(session?.user ?? null);

  if (!user) {
    if (session?.user) {
      await clearAuthSession();
    }

    return apiOk(null);
  }

  if (!session || session.user.id !== user.id || session.user.role !== user.role || session.user.email !== user.email || session.user.name !== user.name || session.user.phone !== user.phone || session.user.emailVerified !== user.emailVerified) {
    await setAuthSession(createAuthSession(user));
  }

  return apiOk(user);
}
