import { AdminShell } from "@/components/admin-shell";

export default function AdminNewProductPage() {
  return (
    <AdminShell
      currentPath="/admin/urunler"
      description="Yeni urun girisi icin MVP formu. Gercek entegrasyonda DB ve upload servisi baglanacak."
      title="Yeni Urun"
    >
      <div className="panel grid gap-4 p-6">
        {["Urun Adi", "Slug", "Kategori", "Base Price", "Compare At Price", "Stok"].map((label) => (
          <label className="grid gap-2 text-sm font-medium" key={label}>
            {label}
            <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" />
          </label>
        ))}
        <label className="grid gap-2 text-sm font-medium">
          Aciklama
          <textarea className="min-h-32 rounded-2xl border border-[var(--color-line)] px-4 py-3" />
        </label>
      </div>
    </AdminShell>
  );
}
