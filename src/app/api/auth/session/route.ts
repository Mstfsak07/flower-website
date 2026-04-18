import { apiOk } from "@/lib/request";
import { readAuthSession } from "@/lib/auth-server";

export async function GET() {
  const session = await readAuthSession();
  return apiOk(session?.user ?? null);
}
