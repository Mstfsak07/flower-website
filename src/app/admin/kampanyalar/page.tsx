import { AdminShell } from "@/components/admin-shell";

export default function AdminCampaignsPage() {
  return (
    <AdminShell
      currentPath="/admin/kuponlar"
      description="Kampanya bloklari, banner alanlari ve CTA yonetimi."
      title="Kampanyalar"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {["Bahara Ozel", "Ayni Gun Teslimat", "Toptan Cicek Paketleri"].map((item) => (
          <div className="panel p-6" key={item}>
            <h2 className="font-serif text-2xl">{item}</h2>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Ana sayfa veya kategori ustunde gostermek icin kampanya modulu.
            </p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
