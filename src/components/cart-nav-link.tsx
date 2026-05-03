"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";

import { useStore } from "@/components/providers/store-provider";
import type { Locale } from "@/lib/locale";

type CartNavLinkProps = {
  locale: Locale;
  className?: string;
  compact?: boolean;
};

const copy = {
  tr: "Sepet",
  en: "Cart",
} as const;

export function CartNavLink({ locale, className, compact = false }: CartNavLinkProps) {
  const pathname = usePathname();
  const { cart, hydrated } = useStore();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const showLabel = pathname !== "/sepet";

  return (
    <Link
      className={`relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/82 px-2.5 py-2 text-[#7f231e] ring-1 ring-[#e3c5bf]/90 transition hover:bg-[#fff1e8] hover:text-[#aa2e28] sm:gap-2 sm:px-3 ${className ?? ""}`}
      href="/sepet"
      prefetch={false}
    >
      <span className="relative inline-flex text-current">
        <ShoppingBag className="size-5" strokeWidth={1.8} />
        {hydrated && count > 0 ? (
          <span className="absolute -right-2 -top-2 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#aa2e28] px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        ) : null}
      </span>
      {showLabel ? (
        <span className={`${compact ? "text-[10px] sm:text-[11px]" : "text-[13px]"} font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-current`}>
          {copy[locale]}
        </span>
      ) : null}
    </Link>
  );
}
