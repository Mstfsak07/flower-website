import Link from "next/link";
import { Clock3, Layers3, Truck } from "lucide-react";

import { getLocalizedProduct } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ locale = "tr", product }: { locale?: Locale; product: Product }) {
  const localizedProduct = getLocalizedProduct(product, locale);
  const copy =
    locale === "en"
      ? {
          deal: "Deal",
          readyIn: "ready in",
          variants: "variants",
          zones: "zones",
          stock: "Stock",
          prep: "Prep",
          floralObject: "Floral object",
          review: "View",
          hours: "hours",
        }
      : {
          deal: "Firsat",
          readyIn: "saatte hazir",
          variants: "varyant",
          zones: "bolge",
          stock: "Stok",
          prep: "Hazirlama",
          floralObject: "Floral object",
          review: "Incele",
          hours: "saat",
        };
  return (
    <article className="floating-surface group relative flex flex-col overflow-hidden rounded-[2.8rem] p-4 transition-all duration-500 hover:-translate-y-3 hover:shadow-[var(--depth-shadow-strong)]">
      <div className="pointer-events-none absolute inset-x-8 top-3 h-14 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.92),transparent_70%)] opacity-80 blur-xl" />
      <Link className="block overflow-hidden rounded-[2.2rem]" href={`/urun/${product.slug}`}>
        <div className="cinematic-image relative h-[21rem] w-full overflow-hidden rounded-[2.2rem] sm:h-[23rem]">
          <div
            className="h-full w-full scale-[1.02] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.09]"
            style={{ backgroundImage: `url(${product.images[0]?.imageUrl})` }}
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
            <div className="flex flex-wrap gap-2">
              {product.badges?.slice(0, 2).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
                >
                  {badge}
                </span>
              ))}
            </div>
            {product.compareAtPrice ? (
              <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-[var(--color-accent)]/25">
                {copy.deal}
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-4 bg-gradient-to-t from-[rgba(18,20,28,0.82)] via-[rgba(18,20,28,0.34)] to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="grid gap-2 text-xs text-white/85 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Clock3 className="size-3.5" />
                  <span>{product.minPreparationHours} {copy.readyIn}</span>
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Layers3 className="size-3.5" />
                  <span>{product.variants.length} {copy.variants}</span>
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Truck className="size-3.5" />
                  <span>{product.deliveryZoneIds.length} {copy.zones}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-4 px-4 pb-4 pt-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
            {copy.stock}: {product.stockQuantity}
          </span>
          <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
            {copy.prep}: {product.minPreparationHours} {copy.hours}
          </span>
        </div>
        <div className="flex-1">
          <div className="editorial-label mb-3 text-[var(--color-muted)]">{copy.floralObject}</div>
          <Link className="font-serif text-2xl tracking-tight text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]" href={`/urun/${product.slug}`}>
            {localizedProduct.name}
          </Link>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-2">
            {localizedProduct.shortDescription}
          </p>
        </div>
        <div className="depth-divider flex items-end justify-between gap-4 pt-4">
          <div>
            <div className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
              {formatPrice(product.basePrice)}
            </div>
            {product.compareAtPrice ? (
              <div className="mt-0.5 text-xs font-medium text-[var(--color-muted)] line-through opacity-70">
                {formatPrice(product.compareAtPrice)}
              </div>
            ) : null}
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 group-hover:bg-[var(--color-accent)]"
            href={`/urun/${product.slug}`}
          >
            {copy.review}
          </Link>
        </div>
      </div>
    </article>
  );
}
