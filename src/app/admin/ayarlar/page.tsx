import { AdminShell } from "@/components/admin-shell";
import { siteSettings, visualExperienceConfigs } from "@/lib/data";

export default function AdminSettingsPage() {
  return (
    <AdminShell
      currentPath="/admin/ayarlar"
      description="Magaza adi, iletisim, teslimat cutoff, SEO ve motion visual config ayarlari."
      title="Site Ayarlari"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel grid gap-4 p-6">
          <h2 className="font-serif text-3xl text-[var(--color-ink)]">Temel Ayarlar</h2>
          {Object.entries(siteSettings).map(([key, value]) => (
            <div className="rounded-[1.25rem] bg-[var(--color-card)] px-4 py-3 text-sm" key={key}>
              <span className="font-semibold text-[var(--color-ink)]">{key}: </span>
              <span className="text-[var(--color-muted)]">{String(value)}</span>
            </div>
          ))}
        </div>
        <div className="panel grid gap-4 p-6">
          <h2 className="font-serif text-3xl text-[var(--color-ink)]">Visual Config</h2>
          {visualExperienceConfigs.map((item) => (
            <div className="rounded-[1.25rem] bg-[var(--color-card)] px-4 py-3 text-sm" key={item.id}>
              <div>
                <span className="font-semibold text-[var(--color-ink)]">{item.key}: </span>
                <span className="text-[var(--color-muted)]">{item.value}</span>
              </div>
              {item.description ? (
                <p className="mt-1 text-[var(--color-muted)]">{item.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
