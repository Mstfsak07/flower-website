"use client";

import Link from "next/link";
import { useState } from "react";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { Menu, X } from "lucide-react";

import { AuthNavAction } from "@/components/auth-nav-action";
import { CartNavLink } from "@/components/cart-nav-link";
import { IrisMark } from "@/components/iris-mark";
import type { Locale } from "@/lib/locale";

const serif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const copy = {
  tr: { shop: "Mağaza", collections: "Aranjmanlar", about: "Hakkımızda", contact: "İletişim" },
  en: { shop: "Shop", collections: "Arrangements", about: "About", contact: "Contact" },
} as const;

type SiteHeaderProps = { locale: Locale };

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = copy[locale];
  const links = [
    { label: t.shop, href: "/magaza" },
    { label: t.collections, href: locale === "en" ? "/arrangements" : "/aranjmanlar" },
    { label: t.about, href: "/hakkimizda" },
    { label: t.contact, href: "/iletisim" },
  ];

  return (
    <header className={`${sans.className} fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8`}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-[1.9rem] bg-[#fcf9f4]/88 px-4 py-3 shadow-[0_18px_50px_-36px_rgba(170,46,40,0.16)] ring-1 ring-[#e3c5bf]/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <button
                aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/82 text-[#7f231e] ring-1 ring-[#e3c5bf]/90 transition hover:bg-[#fff1e8] lg:hidden"
                onClick={() => setMobileOpen((open) => !open)}
                type="button"
              >
                {mobileOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
              </button>
              <Link className="inline-flex min-w-0 items-center gap-2.5 no-underline" href="/" onClick={() => setMobileOpen(false)}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#6b5ca5] shadow-[0_10px_24px_rgba(107,92,165,0.12)]">
                <IrisMark className="h-6 w-6" />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className={`${serif.className} truncate text-xl tracking-tight text-[#6b5ca5] sm:text-2xl`}>
                  Iris Atalier
                </span>
                <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8c716d] sm:block">
                  Floral Atelier
                </span>
              </span>
              </Link>
            </div>

            <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
              {links.map((item) => (
                <Link
                  className="border-b-2 border-transparent pb-1.5 text-[15px] font-extrabold uppercase tracking-[0.12em] text-[#4b332f] transition-colors duration-300 hover:text-[#aa2e28]"
                  href={item.href}
                  key={item.href}
                  prefetch={false}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <CartNavLink compact locale={locale} />
              <div className="hidden sm:block">
                <AuthNavAction compact locale={locale} />
              </div>
            </div>
          </div>

          {mobileOpen ? (
            <div className="mt-3 rounded-[1.4rem] border border-[#e3c5bf] bg-white/86 p-3 shadow-[0_18px_36px_-26px_rgba(170,46,40,0.2)] lg:hidden">
              <nav className="flex flex-col gap-2">
                {links.map((item) => (
                  <Link
                    className="rounded-[1rem] px-4 py-3.5 text-[16px] font-extrabold uppercase tracking-[0.11em] text-[#4b332f] transition-colors hover:bg-[#fff1e8] hover:text-[#aa2e28]"
                    href={item.href}
                    key={item.href}
                    onClick={() => setMobileOpen(false)}
                    prefetch={false}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2">
                  <AuthNavAction compact locale={locale} />
                </div>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
