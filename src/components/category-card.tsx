import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getLocalizedCategory } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Category } from "@/lib/types";

export function CategoryCard({ category, locale = "tr" }: { category: Category; locale?: Locale }) {
  const localizedCategory = getLocalizedCategory(category, locale);
  return (
    <Link
      className="floating-surface group relative flex flex-col overflow-hidden rounded-[2.8rem] p-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-[var(--depth-shadow-strong)]"
      href={`/kategori/${category.slug}`}
    >
      <div className="pointer-events-none absolute left-8 right-8 top-3 h-14 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.92),transparent_70%)] opacity-80 blur-xl" />
      <div
        className="cinematic-image mb-6 h-64 w-full rounded-[2.1rem] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ backgroundImage: `url(${category.imageUrl})` }}
      />
      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex flex-col justify-center">
          <div className="editorial-label text-[var(--color-muted)]">Curated scene</div>
          <h3 className="font-serif text-2xl tracking-tight text-[var(--color-ink)]">{localizedCategory.name}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-2">{localizedCategory.description}</p>
        </div>
        <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-card)] text-[var(--color-accent)] transition-all duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white group-hover:rotate-12">
          <ArrowUpRight className="size-4.5" />
        </span>
      </div>
    </Link>
  );
}
