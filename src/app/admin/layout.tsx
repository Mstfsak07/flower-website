import { redirect } from "next/navigation";

import { readCurrentAdminUser } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await readCurrentAdminUser();
  if (!adminUser) {
    redirect("/giris?redirect=/admin");
  }

  return children;
}
