import { AdminShell } from "@/components/admin-shell";
import { categories } from "@/lib/data";

export default function AdminCategoriesPage() {
  return (
    <AdminShell
      currentPath="/admin/urunler"
      description="Kategori sirasi, aciklamasi ve aktiflik bilgisi."
      title="Kategoriler"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div className="panel p-5" key={category.id}>
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">{category.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{category.description}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
