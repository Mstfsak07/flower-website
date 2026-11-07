"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Manrope, Noto_Serif } from "next/font/google";
import { Menu, X } from "lucide-react";

import { AuthNavAction } from "@/components/auth-nav-action";
import { CartNavLink } from "@/components/cart-nav-link";
import { HomeLink } from "@/components/home-link";
import { IrisMark } from "@/components/iris-mark";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const serif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type SiteHeaderProps = {
  currentLocale: Locale;
};

const copy = {
  tr: {
    home: "Ana Sayfa",
    shop: "Magaza",
    collections: "Aranjmanlar",
    about: "Hakkımızda",
    contact: "İletişim",
    search: "Ara",
  },
  en: {
    home: "Home",
    shop: "Shop",
    collections: "Arrangements",
    about: "About",
    contact: "Contact",
    search: "Search",
  },
} as const;

export function SiteHeader({ currentLocale }: SiteHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const labels = copy[currentLocale];
  const arrangementsHref = currentLocale === "en" ? "/arrangements" : "/aranjmanlar";
  const links = [
    { href: "/", label: labels.home, active: pathname === "/" },
    { href: "/magaza", label: labels.shop, active: pathname === "/magaza" || pathname === "/arama" },
    {
      href: arrangementsHref,
      label: labels.collections,
      active:
        pathname === "/aranjmanlar" ||
        pathname === "/arrangements" ||
        pathname === "/koleksiyonlar" ||
        pathname === "/collections" ||
        pathname.startsWith("/kategori/") ||
        pathname.startsWith("/urun/"),
    },
    { href: "/hakkimizda", label: labels.about, active: pathname === "/hakkinda" || pathname === "/hakkimizda" },
    { href: "/iletisim", label: labels.contact, active: pathname === "/iletisim" },
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
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#6b5ca5] shadow-[0_14px_28px_-18px_rgba(107,92,165,0.45)] ring-1 ring-[#e3c5bf]/70">
                <IrisMark className="h-6 w-6" />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className={`${serif.className} truncate text-xl tracking-tight text-[#6b5ca5] sm:text-2xl`}>
                  Riva Çiçekçilik
                </span>
                <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8c716d] sm:block">
                  Floral Atelier
                </span>
              </span>
              </Link>
            </div>

            <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
              {links.map((link) =>
                link.href === "/" ? (
                  <HomeLink
                    className={cn(
                      "border-b-2 pb-1.5 text-[15px] font-extrabold uppercase tracking-[0.12em] transition-colors duration-300",
                      link.active
                        ? "border-[#aa2e28] text-[#9a241f]"
                        : "border-transparent text-[#4b332f] hover:text-[#aa2e28]",
                    )}
                    key={link.href}
                  >
                    {link.label}
                  </HomeLink>
                ) : (
                  <Link
                    className={cn(
                      "border-b-2 pb-1.5 text-[15px] font-extrabold uppercase tracking-[0.12em] transition-colors duration-300",
                      link.active
                        ? "border-[#aa2e28] text-[#9a241f]"
                        : "border-transparent text-[#4b332f] hover:text-[#aa2e28]",
                    )}
                    href={link.href}
                    key={link.href}
                    prefetch={false}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <CartNavLink compact locale={currentLocale} />
              <div className="hidden sm:block">
                <AuthNavAction compact locale={currentLocale} />
              </div>
            </div>
          </div>

          {mobileOpen ? (
            <div className="mt-3 rounded-[1.4rem] border border-[#e3c5bf] bg-white/86 p-3 shadow-[0_18px_36px_-26px_rgba(170,46,40,0.2)] lg:hidden">
              <nav className="flex flex-col gap-2">
                {links.map((link) =>
                  link.href === "/" ? (
                    <HomeLink
                      className={cn(
                        "rounded-[1rem] px-4 py-3.5 text-[16px] font-extrabold uppercase tracking-[0.11em] text-[#4b332f] transition-colors",
                        link.active && "bg-[#fff1e8] text-[#9a241f]",
                      )}
                      key={link.href}
                    >
                      {link.label}
                    </HomeLink>
                  ) : (
                    <Link
                      className={cn(
                        "rounded-[1rem] px-4 py-3.5 text-[16px] font-extrabold uppercase tracking-[0.11em] text-[#4b332f] transition-colors",
                        link.active && "bg-[#fff1e8] text-[#9a241f]",
                      )}
                      href={link.href}
                      key={link.href}
                      onClick={() => setMobileOpen(false)}
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  ),
                )}
                <div className="pt-2">
                  <AuthNavAction compact locale={currentLocale} />
                </div>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
