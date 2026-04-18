import { AdminShell } from "@/components/admin-shell";

export default function AdminUsersPage() {
  return (
    <AdminShell
      currentPath="/admin/ayarlar"
      description="MVP seviyesinde admin ve musteri rolleri."
      title="Kullanicilar"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Admin", "admin@lunacicek.test"],
          ["Customer", "melis@example.com"],
        ].map(([role, email]) => (
          <div className="panel p-5" key={email}>
            <div className="text-sm text-[var(--color-muted)]">{role}</div>
            <div className="mt-2 font-semibold text-[var(--color-ink)]">{email}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
