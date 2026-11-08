import { occasionCategoryDefs, productCategoryDefs } from "@/lib/category-taxonomy";
import type { Locale } from "@/lib/locale";

export type NavLinkItem = {
  label: string;
  href: string;
  /** Listenin basindaki "Tum Urunler" gibi vurgulu satir. */
  featured?: boolean;
};

/** "Kategoriler" menusu: Tum Urunler + urun turu kategorileri. */
export function getCategoryNavLinks(locale: Locale): NavLinkItem[] {
  return [
    { label: locale === "en" ? "All Products" : "Tüm Ürünler", href: "/magaza", featured: true },
    ...productCategoryDefs.map((def) => ({
      label: locale === "en" ? def.nameEn : def.name,
      href: `/kategori/${def.slug}`,
    })),
  ];
}

/** "Gonderim Amaci" menusu: Sevgiliye, Dogum Gunu ... */
export function getOccasionNavLinks(locale: Locale): NavLinkItem[] {
  return occasionCategoryDefs.map((def) => ({
    label: locale === "en" ? def.nameEn : def.name,
    href: `/kategori/${def.slug}`,
  }));
}

const occasionSlugs = new Set(occasionCategoryDefs.map((def) => def.slug));

/** Gecerli sayfa hangi acilir menuye ait? (aktif vurgusu icin) */
export function getNavActiveGroup(pathname: string): "categories" | "occasions" | null {
  if (pathname === "/magaza" || pathname === "/arama") {
    return "categories";
  }

  if (pathname.startsWith("/kategori/")) {
    const slug = pathname.split("/")[2] ?? "";
    return occasionSlugs.has(slug) ? "occasions" : "categories";
  }

  return null;
}
