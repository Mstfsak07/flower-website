import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";
import { listAdminAuditEntries } from "@/lib/services/admin-audit-service";
import { formatDate } from "@/lib/utils";

export default async function AdminAuditPage() {
  const adminUser = await readCurrentAdminUser();
  if (!adminUser) {
    redirect("/giris?redirect=/admin/aksiyon-gecmisi");
  }

  const entries = await listAdminAuditEntries();

  return (
    <AdminShell
      currentPath="/admin/aksiyon-gecmisi"
      description="Admin tarafinda gerceklesen kritik urun, siparis ve medya aksiyonlarinin kayitlari."
      initialUser={adminUser}
      title="Aksiyon Gecmisi"
    >
      <div className="grid gap-4">
        {entries.length ? (
          entries.map((entry) => (
            <div key={entry.id} className="floating-surface rounded-[1.8rem] p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {entry.entityType} · {entry.action}
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">{entry.summary}</h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {entry.actorName} · {entry.actorEmail}
                  </p>
                </div>
                <div className="rounded-full bg-white/70 px-4 py-2 text-sm text-[var(--color-muted)]">
                  {formatDate(entry.createdAt)}
                </div>
              </div>
              {entry.metadata ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(entry.metadata).map(([key, value]) => (
                    <div key={key} className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs text-[var(--color-muted)]">
                      {key}: {String(value)}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="floating-surface rounded-[1.8rem] p-6 text-sm text-[var(--color-muted)]">
            Henuz kayitli admin aksiyonu yok.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
