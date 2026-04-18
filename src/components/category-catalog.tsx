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

function hasSameDayDelivery(product: Product) {
  return product.badges?.includes("Ayni Gun") ?? false;
}

function matchesBadge(product: Product, activeBadge: string | null) {
  if (!activeBadge) {
    return true;
  }

  return product.badges?.includes(activeBadge) ?? false;
}

export function CategoryCatalog({ items, badges }: CategoryCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortValue>("recommended");

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
    .filter((product) => !sameDayOnly || hasSameDayDelivery(product));

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

  return (
    <div className="mt-10 space-y-6">
      <div className="glass-panel rounded-[2rem] p-5 sm:p-6">
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

        <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-white/60 bg-white/65 p-4 text-sm text-[var(--color-muted)] sm:grid-cols-3">
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
