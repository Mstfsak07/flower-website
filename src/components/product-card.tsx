import Link from "next/link";
import { Clock3, Layers3, Truck } from "lucide-react";

import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-4 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(71,46,56,.08)] transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_32px_80px_-30px_rgba(71,46,56,.12)]">
      <Link className="block overflow-hidden rounded-[2rem]" href={`/urun/${product.slug}`}>
        <div className="relative h-80 w-full overflow-hidden rounded-[2rem]">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
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
                Firsat
              </span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-[rgba(18,20,28,0.78)] via-[rgba(18,20,28,0.42)] to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="grid gap-2 text-xs text-white/85 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Clock3 className="size-3.5" />
                  <span>{product.minPreparationHours} saatte hazir</span>
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Layers3 className="size-3.5" />
                  <span>{product.variants.length} varyant</span>
                </div>
              </div>
              <div className="rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Truck className="size-3.5" />
                  <span>{product.deliveryZoneIds.length} bolge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
            Stok: {product.stockQuantity}
          </span>
          <span className="rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
            Hazirlama: {product.minPreparationHours} saat
          </span>
        </div>
        <div className="flex-1">
          <Link className="font-serif text-2xl tracking-tight text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]" href={`/urun/${product.slug}`}>
            {product.name}
          </Link>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-2">
            {product.shortDescription}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4 pt-2 border-t border-[var(--color-line)]/50">
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
            Incele
          </Link>
        </div>
      </div>
    </article>
  );
}
