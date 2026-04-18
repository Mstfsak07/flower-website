import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { deliveryZones, getCategoryBySlug, getProductBySlug, getSimilarProducts } from "@/lib/data";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const similar = getSimilarProducts(product);
  const category = getCategoryBySlug(product.categoryId);
  const availableZones = deliveryZones.filter((zone) => product.deliveryZoneIds.includes(zone.id));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
        <span>Ana Sayfa</span>
        <span>/</span>
        <span>Koleksiyon</span>
        <span>/</span>
        <span>{category?.name ?? "Kategori"}</span>
        <span>/</span>
        <span className="font-medium text-[var(--color-ink)]">{product.name}</span>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <ProductGallery
            name={product.name}
            categoryName={category?.name}
            images={product.images}
            badges={product.badges}
            description={product.description}
            preparationHours={product.minPreparationHours}
            variantCount={product.variants.length}
            deliveryZoneCount={availableZones.length}
          />
          <div className="glass-panel rounded-[2.5rem] p-8 sm:p-10">
            <div className="flex flex-wrap gap-3">
              {(product.badges ?? []).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]"
                >
                  {badge}
                </span>
              ))}
            </div>
            <h2 className="font-serif text-3xl tracking-tight text-[var(--color-ink)]">Tasarim Detaylari</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)]">{product.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [`${product.minPreparationHours} saat`, "Minimum hazirlama suresi"],
                [`${product.variants.length} boyut`, "Ayni tasarimin secilebilir varyantlari"],
                [`${availableZones.length} bolge`, "Teslimat kapsami icindeki aktif ilce seti"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.75rem] bg-white/75 p-5">
                  <div className="text-2xl font-semibold text-[var(--color-ink)]">{value}</div>
                  <div className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="panel p-6">
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">Neler Dahil</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                <p>Gunluk secilen taze ciceklerle hazirlanan buket duzeni</p>
                <p>Secilebilir boyut ve uygun urunlerde renk ya da aksesuar opsiyonlari</p>
                <p>Kisa kart notu ve teslimat zaman penceresi planlamasi</p>
              </div>
            </div>
            <div className="panel p-6">
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">Teslimat Guvencesi</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                {availableZones.slice(0, 3).map((zone) => (
                  <p key={zone.id}>
                    {zone.district}: {zone.sameDayAvailable ? "Ayni gun teslimat uygun" : "Ertesi gun planlanir"} ve teslimat ucreti {zone.fee} TL
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="sticky top-32">
            <ProductPurchasePanel product={product} />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {[
          ["1. Siparisini Sec", "Boyut, not ve teslimat penceresini birkac adimda netlestir."],
          ["2. Atelier Hazirliga Gecsin", "Siparis onayindan sonra urun ayni gun stok durumuna gore hazirlanir."],
          ["3. Kuryeye Teslim", "Bolgeye uygun zaman araliginda fotografik sunuma yakin teslimat hedeflenir."],
        ].map(([title, copy]) => (
          <div key={title} className="panel p-6">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="font-serif text-4xl tracking-tight text-[var(--color-ink)]">Ilgini Cekebilir</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3 xl:grid-cols-4">
          {similar.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
