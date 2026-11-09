import { redirect } from "next/navigation";
import { readAuthSession, refreshSessionUser } from "@/lib/auth-server";
export const dynamic = "force-dynamic";
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await readAuthSession();
  const user = await refreshSessionUser(session?.user ?? null);
  if (!user?.email) redirect("/giris?redirect=/hesabim");
  return <div className="min-h-[65vh] bg-[#fcf9f4]">{children}</div>;
}
