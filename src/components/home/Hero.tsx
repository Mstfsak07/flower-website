import {
  categories,
  featuredProducts,
  getLocalizedCategory,
  getLocalizedProduct,
  getProductsByCategory,
} from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { formatPrice } from "@/lib/utils";

import { HeroScene } from "./HeroScene";

const copy = {
  tr: {
    eyebrow: "Antalya'nın butik çiçekçisi",
    brand: "Riva Çiçekçilik",
    tagline: "Sevginizi çiçeklerle anlatın.",
    subtitle:
      "Antalya'ya aynı gün teslimat. Her buket, siparişinize özel olarak taze çiçeklerle hazırlanır.",
    primary: "Çiçekleri Keşfet",
    secondary: "Kurumsal / Toptan",
    view: "İncele",
    badgeFallback: "Öne Çıkan",
    categoriesLabel: "Kategoriler",
  },
  en: {
    eyebrow: "Antalya's boutique florist",
    brand: "Riva Florist",
    tagline: "Say it with flowers.",
    subtitle:
      "Same-day delivery in Antalya. Every bouquet is made to order with fresh flowers.",
    primary: "Explore Flowers",
    secondary: "Corporate / Wholesale",
    view: "View",
    badgeFallback: "Featured",
    categoriesLabel: "Categories",
  },
} as const;

// data.ts içindeki Türkçe kategori adları aksansız olduğu için vitrinde düzeltilmiş adlar kullanılır.
const trCategoryNames: Record<string, string> = {
  "tekli-guller": "Tekli Güller",
  "mini-buketler": "Mini Buketler",
  "orta-boy-buketler": "Orta Boy Buketler",
  "premium-buketler": "Premium Buketler",
  "saksi-cicekleri": "Saksı Çiçekleri",
  "toptan-etkinlik-cicekleri": "Toptan & Etkinlik",
};

type HeroProps = { locale: Locale };

export function Hero({ locale }: HeroProps) {
  const t = copy[locale];

  const leadProduct = getLocalizedProduct(featuredProducts[0], locale);
  const leadImage = leadProduct.images[0];

  const stripCategories = categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => {
      const sample = getProductsByCategory(category.slug).find((item) => item.images.length > 0);
      if (!sample) {
        return null;
      }
      const localized = getLocalizedCategory(category, locale);
      return {
        name: locale === "tr" ? (trCategoryNames[category.slug] ?? localized.name) : localized.name,
        href: `/kategori/${category.slug}`,
        imageUrl: sample.images[0].imageUrl,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 6);

  return (
    <HeroScene
      brand={t.brand}
      categories={stripCategories}
      categoriesLabel={t.categoriesLabel}
      eyebrow={t.eyebrow}
      featured={{
        name: leadProduct.name,
        price: formatPrice(leadProduct.basePrice),
        href: `/urun/${leadProduct.slug}`,
        imageUrl: leadImage.imageUrl,
        imageAlt: leadImage.altText,
        badge: leadProduct.badges?.[0] ?? t.badgeFallback,
        viewLabel: t.view,
      }}
      primaryCta={{ label: t.primary, href: "/magaza" }}
      secondaryCta={{ label: t.secondary, href: "/toptan" }}
      subtitle={t.subtitle}
      tagline={t.tagline}
    />
  );
}
