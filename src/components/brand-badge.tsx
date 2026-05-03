"use client";

import { Flower2 } from "lucide-react";

import { HomeLink } from "@/components/home-link";
import { siteSettings } from "@/lib/data";

type BrandBadgeProps = {
  light?: boolean;
};

export function BrandBadge({ light = false }: BrandBadgeProps) {
  return (
    <HomeLink className="group inline-flex items-center gap-3">
      <span
        className={
          light
            ? "flex h-13 w-13 items-center justify-center rounded-full border border-[#d4af37]/35 bg-[rgba(0,0,0,0.42)] text-[#e8dbb0] backdrop-blur-md transition group-hover:border-[#d4af37]/60 group-hover:text-white"
            : "flex h-13 w-13 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 text-[var(--color-ink)] shadow-[0_10px_30px_-16px_rgba(0,0,0,0.28)] backdrop-blur-md transition group-hover:bg-white"
        }
      >
        <Flower2 className="size-5.5" strokeWidth={1.8} />
      </span>
      <span className="flex flex-col">
        <span
          className={
            light
              ? "font-serif text-xl tracking-[0.14em] text-[#f2ca50] uppercase"
              : "font-serif text-xl tracking-[0.14em] text-[var(--color-ink)] uppercase"
          }
        >
          {siteSettings.storeName}
        </span>
        <span
          className={
            light
              ? "text-[11px] uppercase tracking-[0.28em] text-[#e8dbb0]/72"
              : "text-[11px] uppercase tracking-[0.28em] text-[var(--color-muted)]"
          }
        >
          Floral Atelier
        </span>
      </span>
    </HomeLink>
  );
}
