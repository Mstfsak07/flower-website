import { redirect } from "next/navigation";

import { AccountSidebar } from "@/components/account-sidebar";
import { getLocale } from "@/lib/i18n";
import { readAuthSession, refreshSessionUser } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const session = await readAuthSession();
  const currentUser = await refreshSessionUser(session?.user ?? null);

  if (!currentUser?.email) {
    redirect("/giris?redirect=/hesabim");
  }

  const displayName =
    currentUser.name.trim() ||
    currentUser.email
      .split("@")[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return (
    <section className="relative overflow-hidden bg-[#131313] text-[#e5e2e1]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_30%,rgba(242,202,80,0.04)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(212,175,55,0.03)_0%,transparent_30%)]"
      />
      <div className="relative z-10 flex min-h-screen pt-24">
        <AccountSidebar
          locale={locale}
          userEmail={currentUser.email}
          userName={displayName}
          userRole={currentUser.role}
        />
        <main className="min-w-0 flex-1 px-6 pb-28 pt-8 md:ml-72 md:px-10 md:pb-16 md:pt-12 lg:px-16">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </section>
  );
}
