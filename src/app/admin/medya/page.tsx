import { redirect } from "next/navigation";

import { AdminMediaManager } from "@/components/admin-media-manager";
import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";

export default async function AdminMediaPage() {
  const adminUser = await readCurrentAdminUser();
  if (!adminUser) {
    redirect("/giris?redirect=/admin/medya");
  }

  return (
    <AdminShell
      currentPath="/admin/medya"
      description="Urun gorselleri icin lokal upload akisi ve medya kutuphanesi."
      initialUser={adminUser}
      title="Medya"
    >
      <AdminMediaManager />
    </AdminShell>
  );
}
