import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { categories, products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const activeProducts = products.filter((product) => product.isActive);
  const featuredProducts = products.filter((product) => product.isFeatured);
  const lowStockProducts = products.filter((product) => product.stockTracking && product.stockQuantity <= 16);
  const totalStock = products.reduce((total, product) => total + product.stockQuantity, 0);

  return (
    <AdminShell
      currentPath="/admin/urunler"
      description="Urun, stok, kategori ve one cikarma durumlarini hizli yonet."
      title="Urun Yonetimi"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Aktif urun", String(activeProducts.length)],
          ["One cikan", String(featuredProducts.length)],
          ["Dusuk stok", String(lowStockProducts.length)],
          ["Toplam adet", String(totalStock)],
        ].map(([label, value]) => (
          <div key={label} className="panel p-5">
            <div className="text-sm text-[var(--color-muted)]">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Fiyat ve stok ritmi
              </div>
              <h2 className="mt-2 font-serif text-3xl text-[var(--color-ink)]">Hizli operasyon ozeti</h2>
            </div>
            <Link
              className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white"
              href="/admin/urunler/yeni"
            >
              Yeni Urun
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [
                "Ortalama fiyat",
                formatPrice(Math.round(products.reduce((total, product) => total + product.basePrice, 0) / products.length)),
              ],
              ["Kategori sayisi", String(categories.length)],
              [
                "Varyant yogunlugu",
                `${Math.round(products.reduce((total, product) => total + product.variants.length, 0) / products.length)} ort.`,
              ],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.75rem] bg-[var(--color-card)] p-5">
                <div className="text-sm text-[var(--color-muted)]">{label}</div>
                <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              {
                title: "Featured vitrini yenile",
                description: `${featuredProducts.length} urun anasayfa veya onerilen alanlarda one cikiyor.`,
                href: "/admin/urunler",
              },
              {
                title: "Kategori dagilimini kontrol et",
                description: "Yuksek stoklu ama gorunurlugu dusuk kategorileri kampanya ile destekle.",
                href: "/admin/kategoriler",
              },
            ].map((item) => (
              <Link
                key={item.title}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/75 p-4 transition hover:-translate-y-0.5"
                href={item.href}
              >
                <div className="text-base font-semibold text-[var(--color-ink)]">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-[var(--color-ink)]">Stok Uyarilari</h2>
            <span className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
              {lowStockProducts.length} urun
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="rounded-[1.5rem] bg-[var(--color-card)] p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[var(--color-ink)]">{product.name}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
                    {product.stockQuantity} adet
                  </span>
                </div>
                <div className="mt-2 text-[var(--color-muted)]">
                  {categories.find((category) => category.id === product.categoryId)?.name} kategorisinde.
                </div>
                <div className="mt-2 text-[var(--color-muted)]">
                  {product.variants.length} varyant, {formatPrice(product.basePrice)} baslangic fiyat.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[var(--color-ink)]">Tum Urunler</h2>
          <div className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm text-[var(--color-muted)]">
            Liste stok, kategori ve vitrini birlikte gosterir
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[var(--color-muted)]">
              <tr>
                <th className="pb-3">Urun</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Fiyat</th>
                <th className="pb-3">Stok</th>
                <th className="pb-3">Durum</th>
                <th className="pb-3">Vitrin</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="border-t border-[var(--color-line)]" key={product.id}>
                  <td className="py-4">
                    <Link className="font-medium text-[var(--color-accent)]" href={`/admin/urunler/${product.id}`}>
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-4">
                    {categories.find((category) => category.id === product.categoryId)?.name}
                  </td>
                  <td className="py-4">{formatPrice(product.basePrice)}</td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.stockQuantity <= 16
                          ? "bg-[rgba(196,91,109,.12)] text-[var(--color-accent)]"
                          : "bg-[var(--color-card)] text-[var(--color-ink)]"
                      }`}
                    >
                      {product.stockQuantity} adet
                    </span>
                  </td>
                  <td className="py-4">{product.isActive ? "Aktif" : "Pasif"}</td>
                  <td className="py-4">{product.isFeatured ? "One cikiyor" : "Standart"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
