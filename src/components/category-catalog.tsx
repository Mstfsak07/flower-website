"use client";

import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type CategoryCatalogProps = {
  items: Product[];
  badges: string[];
};

type SortValue = "recommended" | "price-asc" | "price-desc";
type IntentValue = "all" | "romantik" | "hemen-gonder" | "kurumsal" | "minimal";
type PriceBand = "all" | "under-750" | "750-1250" | "1250-plus";

function hasSameDayDelivery(product: Product) {
  return product.badges?.includes("Ayni Gun") ?? false;
}

function matchesBadge(product: Product, activeBadge: string | null) {
  if (!activeBadge) {
    return true;
  }

  return product.badges?.includes(activeBadge) ?? false;
}

function matchesIntent(product: Product, intent: IntentValue) {
  if (intent === "all") {
    return true;
  }

  const bag = `${product.name} ${product.shortDescription} ${(product.badges ?? []).join(" ")}`
    .toLocaleLowerCase("tr-TR");

  if (intent === "hemen-gonder") {
    return hasSameDayDelivery(product) || bag.includes("hizli");
  }

  if (intent === "kurumsal") {
    return bag.includes("kurumsal") || bag.includes("etkinlik") || bag.includes("toptan");
  }

  if (intent === "minimal") {
    return bag.includes("mini") || bag.includes("tekli") || bag.includes("sade");
  }

  if (intent === "romantik") {
    return bag.includes("gul") || bag.includes("romantik") || bag.includes("pembe") || bag.includes("somon");
  }

  return true;
}

function matchesPriceBand(product: Product, band: PriceBand) {
  if (band === "all") {
    return true;
  }

  if (band === "under-750") {
    return product.basePrice < 750;
  }

  if (band === "750-1250") {
    return product.basePrice >= 750 && product.basePrice <= 1250;
  }

  return product.basePrice > 1250;
}

export function CategoryCatalog({ items, badges }: CategoryCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortValue>("recommended");
  const [intent, setIntent] = useState<IntentValue>("all");
  const [priceBand, setPriceBand] = useState<PriceBand>("all");

  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

  const filteredItems = items
    .filter((product) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = [product.name, product.shortDescription, ...(product.badges ?? [])]
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      return haystack.includes(normalizedQuery);
    })
    .filter((product) => matchesBadge(product, activeBadge))
    .filter((product) => !sameDayOnly || hasSameDayDelivery(product))
    .filter((product) => matchesIntent(product, intent))
    .filter((product) => matchesPriceBand(product, priceBand));

  const sortedItems = [...filteredItems].sort((left, right) => {
    if (sortBy === "price-asc") {
      return left.basePrice - right.basePrice;
    }

    if (sortBy === "price-desc") {
      return right.basePrice - left.basePrice;
    }

    const leftScore = Number(left.isFeatured) * 4 + Number(hasSameDayDelivery(left)) * 2 + left.stockQuantity / 100;
    const rightScore = Number(right.isFeatured) * 4 + Number(hasSameDayDelivery(right)) * 2 + right.stockQuantity / 100;

    return rightScore - leftScore || left.basePrice - right.basePrice;
  });

  const minPrice = items.length ? Math.min(...items.map((item) => item.basePrice)) : 0;
  const maxPrice = items.length ? Math.max(...items.map((item) => item.basePrice)) : 0;
  const sameDayCount = items.filter(hasSameDayDelivery).length;
  const intentCards: Array<[IntentValue, string, string]> = [
    ["romantik", "Romantik jest", "Gul, pudra tonlari ve daha duygusal secimler"],
    ["hemen-gonder", "Hemen gonder", "Ayni gun dispatch icin hizli karar akisi"],
    ["kurumsal", "Kurumsal", "Etkinlik, ofis ve toplu alim odakli secimler"],
    ["minimal", "Minimal", "Daha sade, daha temiz ve ekonomik kompozisyonlar"],
  ];

  return (
    <div className="mt-10 space-y-6">
      <div className="floating-surface rounded-[2.3rem] p-5 sm:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_auto_auto] xl:items-center">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Koleksiyon icinde ara
            </span>
            <input
              className="w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:bg-white"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buket, gul, cipso, ekonomik..."
              value={query}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Siralama
            </span>
            <select
              className="w-full rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent)] focus:bg-white"
              onChange={(event) => setSortBy(event.target.value as SortValue)}
              value={sortBy}
            >
              <option value="recommended">Onerilen</option>
              <option value="price-asc">Fiyat artan</option>
              <option value="price-desc">Fiyat azalan</option>
            </select>
          </label>
          <button
            className={`inline-flex min-h-[52px] items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition ${
              sameDayOnly
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_18px_40px_-24px_rgba(190,111,129,.9)]"
                : "border-white/70 bg-white/80 text-[var(--color-ink)] hover:bg-white"
            }`}
            onClick={() => setSameDayOnly((value) => !value)}
            type="button"
          >
            Ayni gun teslimat
          </button>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          {intentCards.map(([value, title, copy]) => (
            <button
              key={value}
              className={`rounded-[1.6rem] border p-4 text-left transition ${
                intent === value
                  ? "border-[var(--color-accent)] bg-[rgba(196,91,109,0.08)] shadow-[0_22px_40px_-30px_rgba(196,91,109,.7)]"
                  : "border-white/60 bg-white/68 hover:-translate-y-1 hover:bg-white"
              }`}
              onClick={() => setIntent((current) => (current === value ? "all" : value))}
              type="button"
            >
              <div className="editorial-label text-[var(--color-accent)]">{title}</div>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{copy}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              activeBadge === null
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-white/70 bg-white/75 text-[var(--color-ink)] hover:bg-white"
            }`}
            onClick={() => setActiveBadge(null)}
            type="button"
          >
            Tum rozetler
          </button>
          {badges.map((badge) => (
            <button
              key={badge}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                activeBadge === badge
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-white/70 bg-white/75 text-[var(--color-ink)] hover:bg-white"
              }`}
              onClick={() => setActiveBadge((current) => (current === badge ? null : badge))}
              type="button"
            >
              {badge}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {[
            ["all", "Tum fiyatlar"],
            ["under-750", "750 TL alti"],
            ["750-1250", "750 - 1250 TL"],
            ["1250-plus", "1250 TL ve uzeri"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                priceBand === value
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                  : "border-white/70 bg-white/75 text-[var(--color-ink)] hover:bg-white"
              }`}
              onClick={() => setPriceBand(value as PriceBand)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 rounded-[1.7rem] border border-white/60 bg-white/65 p-4 text-sm text-[var(--color-muted)] sm:grid-cols-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Sonuclar
            </div>
            <div className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
              {sortedItems.length} urun gosteriliyor
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Fiyat araligi
            </div>
            <div className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
              {formatPrice(minPrice)} - {formatPrice(maxPrice)}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Hazir teslimat
            </div>
            <div className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
              {sameDayCount} secenek ayni gun uygun
            </div>
          </div>
        </div>
      </div>

      {sortedItems.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="panel rounded-[2rem] p-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Eslesen tasarim bulunamadi
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">Filtreleri biraz genislet.</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Arama kelimesini sadeleştir, badge secimini kaldir ya da ayni gun filtrelemesini kapat. Koleksiyondaki tum urunler yine hazir.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
              onClick={() => {
                setQuery("");
                setActiveBadge(null);
                setSameDayOnly(false);
                setIntent("all");
                setPriceBand("all");
                setSortBy("recommended");
              }}
              type="button"
            >
              Tum filtreleri temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
