import { apiOk } from "@/lib/request";
import { clearAuthSession } from "@/lib/auth-server";

export async function POST() {
  await clearAuthSession();
  return apiOk({ loggedOut: true });
}
