import { notFound } from "next/navigation";

import { CategoryCatalog } from "@/components/category-catalog";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const items = getProductsByCategory(slug);
  const featuredCount = items.filter((item) => item.isFeatured).length;
  const sameDayCount = items.filter((item) => item.badges?.includes("Ayni Gun")).length;
  const badges = Array.from(new Set(items.flatMap((item) => item.badges ?? []))).slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
        <span>Ana Sayfa</span>
        <span>/</span>
        <span>Koleksiyon</span>
        <span>/</span>
        <span className="font-medium text-[var(--color-ink)]">{category.name}</span>
      </div>
      <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-10 sm:p-14">
        <div className="soft-orb right-0 top-0 h-48 w-48 bg-[var(--color-accent)]/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
          <div>
            <p className="inline-block rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Koleksiyon
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-6xl">
              {category.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
              {category.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              [`${items.length} tasarim`, "Bu koleksiyondaki aktif urun sayisi"],
              [`${sameDayCount} ayni gun`, "Ayni gun gonderime uygun secenekler"],
              [`${featuredCount} onerilen`, "En cok tercih edilen tasarimlar"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[1.75rem] border border-white/70 bg-white/70 p-5">
                <div className="text-2xl font-semibold text-[var(--color-ink)]">{value}</div>
                <div className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap gap-3">
          {[
            "Gunluk gonderim icin hazirlanan buketler",
            "Kart notu ve varyant secimi destekli",
            "Kadikoy merkezli hizli teslimat kurgusu",
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-[var(--color-line)] bg-white/80 px-4 py-2 text-sm text-[var(--color-muted)]"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="rounded-full border border-[var(--color-line)] bg-white/80 px-4 py-2 text-sm text-[var(--color-muted)]">
          Siralama: Onerilen ve ayni gun teslimata uygun secimler once gelir.
        </div>
      </div>
      <CategoryCatalog badges={badges} items={items} />
      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {[
          ["Teslimat Planlamasi", "15:00'e kadar gelen siparislerde ayni gun teslimat penceresi korunur."],
          ["Vitrin Kalitesi", "Tum tasarimlar gorseldeki ton karakterine sadik kalarak gunluk cicek stoklariyla hazirlanir."],
          ["Hizli Yonlendirme", "Kurumsal ya da toplu alim ihtiyacinda teklif formuna tek adimda gecis yapabilirsin."],
        ].map(([title, copy]) => (
          <div key={title} className="panel p-6">
            <h2 className="font-serif text-2xl text-[var(--color-ink)]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
