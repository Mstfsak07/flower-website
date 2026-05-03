"use client";

import type { FocusEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, X, Zap } from "lucide-react";

import { useStore } from "@/components/providers/store-provider";
import { getLocalizedProduct } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type ShopProductGridProps = {
  locale: Locale;
  products: Product[];
  serifClassName: string;
};

type FilterKey =
  | "flowerType"
  | "occasion"
  | "arrangement"
  | "price"
  | "color"
  | "special";

type ProductProfile = {
  flowerTypes: string[];
  occasions: string[];
  arrangements: string[];
  colors: string[];
  specials: string[];
};

type FilterGroup = {
  key: FilterKey;
  title: string;
  options: Array<{ value: string; label: string }>;
};

const filterGroupCopy: Record<Locale, FilterGroup[]> = {
  tr: [
    {
      key: "flowerType",
      title: "🌸 Cicek Turu",
      options: [
        { value: "guller", label: "Guller" },
        { value: "papatyalar", label: "Papatyalar" },
        { value: "orkideler", label: "Orkideler" },
        { value: "laleler", label: "Laleler" },
        { value: "karanfiller", label: "Karanfiller" },
        { value: "mevsim-cicekleri", label: "Mevsim Cicekleri" },
      ],
    },
    {
      key: "occasion",
      title: "🎁 Duruma Gore",
      options: [
        { value: "sevgiliye", label: "Sevgiliye" },
        { value: "dogum-gunu", label: "Dogum Gunu" },
        { value: "yildonumu", label: "Yildonumu" },
        { value: "tebrik", label: "Yeni Is / Tebrik" },
        { value: "gecmis-olsun", label: "Gecmis Olsun" },
        { value: "ozur", label: "Ozur Cicekleri" },
        { value: "anneler-gunu", label: "Anneler Gunu" },
        { value: "sevgililer-gunu", label: "Sevgililer Gunu" },
      ],
    },
    {
      key: "arrangement",
      title: "💐 Aranjman Tipi",
      options: [
        { value: "buketler", label: "Buketler" },
        { value: "vazoda-cicekler", label: "Vazoda Cicekler" },
        { value: "kutuda-cicekler", label: "Kutuda Cicekler (Box)" },
        { value: "saksi-cicekleri", label: "Saksi Cicekleri" },
        { value: "teraryumlar", label: "Teraryumlar" },
      ],
    },
    {
      key: "price",
      title: "💸 Fiyat",
      options: [
        { value: "ekonomik", label: "Ekonomik" },
        { value: "orta-segment", label: "Orta Segment" },
        { value: "premium", label: "Premium" },
      ],
    },
    {
      key: "color",
      title: "🎨 Renk",
      options: [
        { value: "kirmizi", label: "Kirmizi" },
        { value: "beyaz", label: "Beyaz" },
        { value: "pembe", label: "Pembe" },
        { value: "sari", label: "Sari" },
        { value: "mor", label: "Mor" },
      ],
    },
    {
      key: "special",
      title: "🌿 Ozel",
      options: [
        { value: "cok-satanlar", label: "Cok Satanlar" },
        { value: "yeni-gelenler", label: "Yeni Gelenler" },
        { value: "kampanyali-urunler", label: "Kampanyali Urunler" },
        { value: "ozel-tasarim", label: "Ozel Tasarim" },
      ],
    },
  ],
  en: [
    {
      key: "flowerType",
      title: "🌸 Flower Type",
      options: [
        { value: "guller", label: "Roses" },
        { value: "papatyalar", label: "Daisies" },
        { value: "orkideler", label: "Orchids" },
        { value: "laleler", label: "Tulips" },
        { value: "karanfiller", label: "Carnations" },
        { value: "mevsim-cicekleri", label: "Seasonal Flowers" },
      ],
    },
    {
      key: "occasion",
      title: "🎁 Occasion",
      options: [
        { value: "sevgiliye", label: "For a Loved One" },
        { value: "dogum-gunu", label: "Birthday" },
        { value: "yildonumu", label: "Anniversary" },
        { value: "tebrik", label: "Congrats / New Job" },
        { value: "gecmis-olsun", label: "Get Well Soon" },
        { value: "ozur", label: "Apology Flowers" },
        { value: "anneler-gunu", label: "Mother's Day" },
        { value: "sevgililer-gunu", label: "Valentine's Day" },
      ],
    },
    {
      key: "arrangement",
      title: "💐 Arrangement",
      options: [
        { value: "buketler", label: "Bouquets" },
        { value: "vazoda-cicekler", label: "Vase Arrangements" },
        { value: "kutuda-cicekler", label: "Box Arrangements" },
        { value: "saksi-cicekleri", label: "Potted Flowers" },
        { value: "teraryumlar", label: "Terrariums" },
      ],
    },
    {
      key: "price",
      title: "💸 Price",
      options: [
        { value: "ekonomik", label: "Budget" },
        { value: "orta-segment", label: "Mid Range" },
        { value: "premium", label: "Premium" },
      ],
    },
    {
      key: "color",
      title: "🎨 Color",
      options: [
        { value: "kirmizi", label: "Red" },
        { value: "beyaz", label: "White" },
        { value: "pembe", label: "Pink" },
        { value: "sari", label: "Yellow" },
        { value: "mor", label: "Purple" },
      ],
    },
    {
      key: "special",
      title: "🌿 Special",
      options: [
        { value: "cok-satanlar", label: "Best Sellers" },
        { value: "yeni-gelenler", label: "New Arrivals" },
        { value: "kampanyali-urunler", label: "On Sale" },
        { value: "ozel-tasarim", label: "Signature Design" },
      ],
    },
  ],
};

const copy = {
  tr: {
    intro: "Magazadaki urunleri cicek turu, amac, aranjman tipi, fiyat, renk ve ozel koleksiyonlara gore daralt.",
    filters: "Filtreler",
    productsFound: "urun bulundu",
    clearFilters: "Filtreleri Temizle",
    select: "Sec",
    all: "Tumu",
    viewDetails: "Detayi Incele",
    addToCart: "Sepete Ekle",
    buyNow: "Hemen Satin Al",
    noResultsLabel: "Sonuc Bulunamadi",
    noResultsTitle: "Bu filtrelerle eslesen urun yok.",
    noResultsDescription: "Farkli bir cicek turu, renk ya da fiyat seviyesi secerek listeyi yeniden genisletebilirsin.",
  },
  en: {
    intro: "Refine the shop by flower type, occasion, arrangement style, price, color, and signature edits.",
    filters: "Filters",
    productsFound: "products found",
    clearFilters: "Clear Filters",
    select: "Select",
    all: "All",
    viewDetails: "View Details",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    noResultsLabel: "No Results",
    noResultsTitle: "No products match these filters.",
    noResultsDescription: "Try a different flower type, color, or price range to widen the selection again.",
  },
} as const;

const productProfiles: Record<string, ProductProfile> = {
  "gul-buketi": {
    flowerTypes: ["guller"],
    occasions: ["sevgiliye", "yildonumu", "sevgililer-gunu", "ozur"],
    arrangements: ["buketler"],
    colors: ["kirmizi"],
    specials: ["cok-satanlar", "ozel-tasarim"],
  },
  "karanfil-buketi": {
    flowerTypes: ["karanfiller"],
    occasions: ["dogum-gunu", "gecmis-olsun", "anneler-gunu"],
    arrangements: ["buketler"],
    colors: ["pembe"],
    specials: ["yeni-gelenler"],
  },
  "papatya-buketi": {
    flowerTypes: ["papatyalar"],
    occasions: ["gecmis-olsun", "tebrik", "anneler-gunu"],
    arrangements: ["buketler"],
    colors: ["beyaz"],
    specials: ["cok-satanlar"],
  },
  "sardunya-buketi": {
    flowerTypes: ["mevsim-cicekleri"],
    occasions: ["tebrik", "dogum-gunu"],
    arrangements: ["buketler"],
    colors: ["pembe"],
    specials: ["yeni-gelenler", "ozel-tasarim"],
  },
  "begonya-buketi": {
    flowerTypes: ["mevsim-cicekleri"],
    occasions: ["tebrik", "anneler-gunu"],
    arrangements: ["buketler"],
    colors: ["beyaz", "pembe"],
    specials: ["ozel-tasarim"],
  },
  "lavanta-buketi": {
    flowerTypes: ["mevsim-cicekleri"],
    occasions: ["ozur", "yildonumu", "gecmis-olsun"],
    arrangements: ["buketler"],
    colors: ["mor"],
    specials: ["cok-satanlar", "ozel-tasarim"],
  },
  "petunya-buketi": {
    flowerTypes: ["mevsim-cicekleri"],
    occasions: ["dogum-gunu", "tebrik"],
    arrangements: ["buketler"],
    colors: ["pembe", "mor"],
    specials: ["yeni-gelenler"],
  },
  "kalanso-buketi": {
    flowerTypes: ["mevsim-cicekleri"],
    occasions: ["gecmis-olsun", "tebrik"],
    arrangements: ["buketler"],
    colors: ["sari"],
    specials: ["kampanyali-urunler"],
  },
  "menekse-buketi": {
    flowerTypes: ["mevsim-cicekleri"],
    occasions: ["sevgiliye", "yildonumu", "dogum-gunu"],
    arrangements: ["buketler"],
    colors: ["mor"],
    specials: ["ozel-tasarim"],
  },
};

function getPriceTier(price: number) {
  if (price < 320) {
    return "ekonomik";
  }

  if (price <= 390) {
    return "orta-segment";
  }

  return "premium";
}

function getProductProfile(product: Product): ProductProfile {
  const manualProfile = productProfiles[product.slug];

  if (manualProfile) {
    return manualProfile;
  }

  const bag = `${product.name} ${product.shortDescription} ${(product.badges ?? []).join(" ")}`
    .toLocaleLowerCase("tr-TR");

  const flowerTypes: string[] = [];

  if (bag.includes("gul")) flowerTypes.push("guller");
  if (bag.includes("papatya")) flowerTypes.push("papatyalar");
  if (bag.includes("orkide")) flowerTypes.push("orkideler");
  if (bag.includes("lale")) flowerTypes.push("laleler");
  if (bag.includes("karanfil")) flowerTypes.push("karanfiller");
  if (!flowerTypes.length || bag.includes("mevsim")) flowerTypes.push("mevsim-cicekleri");

  return {
    flowerTypes,
    occasions: [],
    arrangements: bag.includes("saksi") ? ["saksi-cicekleri"] : ["buketler"],
    colors: [],
    specials: product.isFeatured ? ["cok-satanlar"] : [],
  };
}

function matchesFilter(product: Product, key: FilterKey, value: string) {
  if (value === "all") {
    return true;
  }

  const profile = getProductProfile(product);

  if (key === "flowerType") {
    return profile.flowerTypes.includes(value);
  }

  if (key === "occasion") {
    return profile.occasions.includes(value);
  }

  if (key === "arrangement") {
    return profile.arrangements.includes(value);
  }

  if (key === "price") {
    return getPriceTier(product.basePrice) === value;
  }

  if (key === "color") {
    return profile.colors.includes(value);
  }

  return profile.specials.includes(value);
}

export function ShopProductGrid({ locale, products, serifClassName }: ShopProductGridProps) {
  const router = useRouter();
  const { addToCart } = useStore();
  const t = copy[locale];
  const filterGroups = filterGroupCopy[locale];
  const localizedProducts = products.map((product) => getLocalizedProduct(product, locale));
  const [currentPage, setCurrentPage] = useState(1);
  const [openGroup, setOpenGroup] = useState<FilterKey | null>(null);
  const filtersSectionRef = useRef<HTMLElement | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<FilterKey, string>>({
    flowerType: "all",
    occasion: "all",
    arrangement: "all",
    price: "all",
    color: "all",
    special: "all",
  });

  const filteredProducts = localizedProducts.filter((product) =>
    Object.entries(activeFilters).every(([key, value]) =>
      matchesFilter(product, key as FilterKey, value),
    ),
  );

  const productsPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );
  const activeFilterCount = Object.values(activeFilters).filter((value) => value !== "all").length;

  const getSelectedLabel = (group: FilterGroup) => {
    const selectedValue = activeFilters[group.key];

    if (selectedValue === "all") {
      return null;
    }

    return group.options.find((option) => option.value === selectedValue)?.label ?? null;
  };

  const updateFilter = (key: FilterKey, value: string) => {
    setCurrentPage(1);
    setOpenGroup(null);
    setActiveFilters((current) => ({
      ...current,
      [key]: current[key] === value ? "all" : value,
    }));
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setOpenGroup(null);
    setActiveFilters({
      flowerType: "all",
      occasion: "all",
      arrangement: "all",
      price: "all",
      color: "all",
      special: "all",
    });
  };

  const closeFilterGroup = (key: FilterKey) => {
    setOpenGroup((current) => (current === key ? null : current));
  };

  const toggleFilterGroup = (key: FilterKey) => {
    setOpenGroup((current) => (current === key ? null : key));
  };

  const scrollToFiltersTop = () => {
    filtersSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    requestAnimationFrame(() => {
      scrollToFiltersTop();
    });
  };

  const handleGroupBlur = (event: FocusEvent<HTMLElement>, key: FilterKey) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeFilterGroup(key);
    }
  };

  const addProductToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      unitPrice: product.basePrice,
    });
  };

  return (
    <>
      <section
        className="relative z-20 mb-10 space-y-5"
        id="shop-filters"
        ref={filtersSectionRef}
        style={{ scrollMarginTop: "7rem" }}
      >
        <div className="mb-10 text-center">
          <h1 className="text-2xl tracking-[0.2em] text-[#aa2e28] md:text-3xl">IRIS ATALIER</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6d5b57] md:text-base">
            {t.intro}
          </p>
        </div>

        <div className="rounded-[2rem] border border-[#e3c5bf] bg-[#fffaf7]/92 p-5 shadow-[0_22px_48px_-30px_rgba(170,46,40,0.16)] backdrop-blur-md md:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#ead8d2] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#aa2e28]">
                {t.filters}
              </p>
              <p className="mt-2 text-sm text-[#8b716a]">
                {filteredProducts.length} {t.productsFound}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#e3c5bf] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#aa2e28] transition hover:bg-[#fff2eb] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={activeFilterCount === 0}
              onClick={clearFilters}
              type="button"
            >
              <X className="size-4" />
              {t.clearFilters}
            </button>
          </div>

          <div className="flex flex-wrap items-start gap-3 lg:items-center lg:gap-4">
            {filterGroups.map((group) => (
              <section
                className="relative min-w-[12rem] flex-1 lg:min-w-[10rem] lg:flex-none"
                key={group.key}
                onBlur={(event) => handleGroupBlur(event, group.key)}
              >
                <button
                  className="flex w-full items-center justify-between gap-3 rounded-full border border-[#ecd6cf] bg-[#fff8f3] px-4 py-3 text-left transition hover:border-[#cc473e] hover:bg-white lg:min-w-fit lg:border-transparent lg:bg-transparent lg:px-2 lg:py-2"
                  onClick={() => toggleFilterGroup(group.key)}
                  type="button"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-sm font-semibold tracking-[0.04em] text-[#2f2623] lg:text-[1.05rem]">
                      {group.title}
                    </span>
                    {getSelectedLabel(group) ? (
                      <span className="rounded-full border border-[#cc473e]/30 bg-[#fff0e6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#aa2e28]">
                        {getSelectedLabel(group)}
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#ead8d2] bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b716a]">
                        {t.select}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex size-8 items-center justify-center rounded-full border border-[#ead8d2] bg-white/80 text-[#aa2e28] transition ${
                      openGroup === group.key ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </button>

                {openGroup === group.key ? (
                  <div
                    className="absolute left-0 right-auto top-full z-20 mt-2 w-fit max-w-[min(92vw,24rem)] min-w-full rounded-[1.25rem] border border-[#e3c5bf] bg-[#fffaf7]/96 px-4 pb-4 pt-3 shadow-[0_24px_50px_-28px_rgba(170,46,40,0.22)] backdrop-blur-xl lg:max-w-[24rem]"
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                          activeFilters[group.key] === "all"
                            ? "border-[#aa2e28] bg-[#aa2e28] text-white"
                            : "border-[#ead8d2] bg-[#fff8f3] text-[#6d5b57] hover:border-[#cc473e] hover:text-[#2f2623]"
                        }`}
                        onClick={() => updateFilter(group.key, "all")}
                        type="button"
                      >
                        {t.all}
                      </button>
                      {group.options.map((option) => {
                        const selected = activeFilters[group.key] === option.value;

                        return (
                          <button
                            className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                              selected
                                ? "border-[#aa2e28] bg-[#aa2e28] text-white"
                                : "border-[#ead8d2] bg-[#fff8f3] text-[#6d5b57] hover:border-[#cc473e] hover:text-[#2f2623]"
                            }`}
                            key={option.value}
                            onClick={() => updateFilter(group.key, option.value)}
                            type="button"
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>

      {visibleProducts.length ? (
        <section className="relative z-0 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <article
              className="flex flex-col overflow-hidden rounded-[1.75rem] border border-[#ead8d2]/80 bg-[#fffaf7]/92 shadow-[0_18px_50px_-34px_rgba(170,46,40,0.14)] transition-transform duration-300 hover:scale-[1.02]"
              key={product.id}
            >
              <Link className="block" href={`/urun/${product.slug}`} prefetch={false}>
                <div className="relative h-72 w-full">
                  <Image alt={product.name} className="object-cover" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={product.images[0]?.imageUrl} unoptimized />
                </div>
              </Link>
              <div className="flex flex-grow flex-col border-t border-[#ead8d2]/80 bg-[#fffdfb]/96 p-5 text-center">
                <Link className="mb-2 block" href={`/urun/${product.slug}`} prefetch={false}>
                  <h2 className={`${serifClassName} text-2xl text-[#2f2623] transition-colors hover:text-[#aa2e28]`}>{product.name}</h2>
                </Link>
                <p className="text-lg font-light text-[#6d5b57]">{formatPrice(product.basePrice)}</p>
                <div className="mt-6 grid gap-3">
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ead8d2] bg-white/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#6b5ca5] transition hover:bg-[#f8f0ff] hover:text-[#533f91]"
                    href={`/urun/${product.slug}`}
                    prefetch={false}
                  >
                    {t.viewDetails}
                  </Link>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e3c5bf] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#aa2e28] transition hover:bg-[#fff0e6] hover:text-[#2f2623]"
                    onClick={() => addProductToCart(product)}
                    type="button"
                  >
                    <ShoppingBag className="size-4" />
                    {t.addToCart}
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:opacity-95"
                    onClick={() => {
                      addProductToCart(product);
                      router.push("/odeme");
                    }}
                    type="button"
                  >
                    <Zap className="size-4" />
                    {t.buyNow}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-[2rem] border border-[#ead8d2] bg-[#fff8f3]/92 px-6 py-14 text-center shadow-[0_18px_50px_-34px_rgba(170,46,40,0.14)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#aa2e28]">
            {t.noResultsLabel}
          </p>
          <h2 className={`${serifClassName} mt-3 text-3xl text-[#2f2623]`}>
            {t.noResultsTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6d5b57]">
            {t.noResultsDescription}
          </p>
        </section>
      )}

      {totalPages > 1 ? (
        <nav className="mt-16 flex items-center justify-center gap-4">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#ead8d2] bg-[#fff8f3]/92 text-[#aa2e28] transition hover:bg-[#fff0e6] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const active = pageNumber === currentPage;

            return (
              <button
                className={
                  active
                    ? "h-10 w-10 rounded-lg bg-[#aa2e28] font-semibold text-white"
                    : "h-10 w-10 rounded-lg border border-[#ead8d2] bg-[#fff8f3]/92 text-[#6d5b57] transition hover:bg-[#fff0e6] hover:text-[#aa2e28]"
                }
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#ead8d2] bg-[#fff8f3]/92 text-[#aa2e28] transition hover:bg-[#fff0e6] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      ) : null}
    </>
  );
}
