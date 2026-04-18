import { AdminShell } from "@/components/admin-shell";
import { contentPages } from "@/lib/data";

export default function AdminContentsPage() {
  return (
    <AdminShell
      currentPath="/admin/ayarlar"
      description="Hukuki ve bilgilendirici icerik sayfalari."
      title="Icerikler"
    >
      <div className="grid gap-4">
        {contentPages.map((page) => (
          <div className="panel p-5" key={page.id}>
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">{page.title}</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{page.seoDescription}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
