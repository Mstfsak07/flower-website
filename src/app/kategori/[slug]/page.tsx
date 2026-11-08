import Link from "next/link";
import { notFound } from "next/navigation";
import { Manrope, Noto_Serif } from "next/font/google";
import type { Metadata } from "next";

import { ShopProductGrid } from "@/components/shop-product-grid";
import {
  getCategoriesByGroup,
  getCategoryBySlug,
  getLocalizedCategory,
  getProductsByCategory,
} from "@/lib/data";
import { getLocale } from "@/lib/i18n";

const serif = Noto_Serif({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const copy = {
  tr: {
    home: "Ana Sayfa",
    shop: "Mağaza",
    types: "Kategoriler",
    occasions: "Gönderim Amacı",
    emptyTitle: "Bu kategoriye ürünler yakında eklenecek",
    emptyText: "Şimdilik bu kategoride ürün yok. Diğer kategorilere göz atabilir ya da bize yazarak özel sipariş verebilirsiniz.",
    emptyCta: "Tüm ürünleri gör",
    count: (n: number) => `${n} ürün`,
  },
  en: {
    home: "Home",
    shop: "Shop",
    types: "Categories",
    occasions: "Occasions",
    emptyTitle: "Products are coming soon to this category",
    emptyText: "There are no products here yet. Browse other categories or contact us for a custom order.",
    emptyCta: "View all products",
    count: (n: number) => `${n} products`,
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  const localized = getLocalizedCategory(category, locale);
  return {
    title: `${localized.name} | Riva Çiçekçilik`,
    description: localized.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const t = copy[locale];
  const localized = getLocalizedCategory(category, locale);
  const categoryProducts = getProductsByCategory(slug);
  const groups = [
    { title: t.types, items: getCategoriesByGroup("type") },
    { title: t.occasions, items: getCategoriesByGroup("occasion") },
  ];

  return (
    <div className={`${sans.className} min-h-screen overflow-x-hidden bg-[#fcf9f4] text-[#1c1c19]`}>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_8%,rgba(255,146,72,0.16),transparent_22%),radial-gradient(circle_at_88%_18%,rgba(68,128,100,0.14),transparent_24%),linear-gradient(180deg,#fcf9f4_0%,#f6f3ee_100%)]" />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <nav aria-label="breadcrumb" className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#8c716d]">
          <Link className="hover:text-[#aa2e28]" href="/">{t.home}</Link>
          <span className="mx-2">/</span>
          <Link className="hover:text-[#aa2e28]" href="/magaza">{t.shop}</Link>
          <span className="mx-2">/</span>
          <span className="text-[#aa2e28]">{localized.name}</span>
        </nav>

        <section className="mb-8 rounded-[2.25rem] border border-[#e0bfbb] bg-white/60 px-6 py-8 shadow-[0_24px_60px_-40px_rgba(170,46,40,0.16)] backdrop-blur-md md:px-8">
          <h1 className={`${serif.className} text-4xl text-[#2f2623] md:text-5xl`}>{localized.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d5b57]">{localized.description}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#aa2e28]">
            {t.count(categoryProducts.length)}
          </p>

          <div className="mt-6 grid gap-5">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c716d]">{group.title}</div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const label = getLocalizedCategory(item, locale).name;
                    const active = item.slug === slug;
                    return (
                      <Link
                        aria-current={active ? "page" : undefined}
                        className={`rounded-full border px-3.5 py-2 text-xs font-semibold tracking-[0.06em] transition ${
                          active
                            ? "border-[#aa2e28] bg-[#aa2e28] text-white"
                            : "border-[#ead8d2] bg-[#fff8f3] text-[#6d5b57] hover:border-[#cc473e] hover:text-[#2f2623]"
                        }`}
                        href={`/kategori/${item.slug}`}
                        key={item.slug}
                        prefetch={false}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {categoryProducts.length ? (
          <ShopProductGrid locale={locale} products={categoryProducts} serifClassName={serif.className} />
        ) : (
          <section className="rounded-[2rem] border border-[#ead8d2] bg-[#fff8f3]/92 px-6 py-14 text-center shadow-[0_18px_50px_-34px_rgba(170,46,40,0.14)]">
            <h2 className={`${serif.className} text-3xl text-[#2f2623]`}>{t.emptyTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6d5b57]">{t.emptyText}</p>
            <Link
              className="mt-6 inline-flex rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-95"
              href="/magaza"
            >
              {t.emptyCta}
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
