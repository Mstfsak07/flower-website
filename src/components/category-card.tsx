import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-6 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(71,46,56,.1)] transition-all duration-500 hover:-translate-y-2 hover:bg-white hover:shadow-[0_32px_80px_-30px_rgba(71,46,56,.15)]"
      href={`/kategori/${category.slug}`}
    >
      <div
        className="mb-6 h-56 w-full rounded-[1.8rem] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
        style={{ backgroundImage: `url(${category.imageUrl})` }}
      />
      <div className="flex flex-1 items-start justify-between gap-4">
        <div className="flex flex-col justify-center">
          <h3 className="font-serif text-2xl tracking-tight text-[var(--color-ink)]">{category.name}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-2">{category.description}</p>
        </div>
        <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-card)] text-[var(--color-accent)] transition-all duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white group-hover:rotate-12">
          <ArrowUpRight className="size-4.5" />
        </span>
      </div>
    </Link>
  );
}
