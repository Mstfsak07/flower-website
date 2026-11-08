"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, House, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { AuthNavAction } from "@/components/auth-nav-action";
import { CartNavLink } from "@/components/cart-nav-link";
import { IrisMark } from "@/components/iris-mark";
import { useAuth } from "@/components/providers/auth-provider";
import { useStore } from "@/components/providers/store-provider";
import { notoSerif as serif, plusJakartaSans as sans } from "@/lib/fonts";
import type { Locale } from "@/lib/locale";

const copy = {
  tr: {
    home: "Ana Sayfa",
    categories: "Kategoriler",
    shopAll: "Tüm Mağaza",
    shop: "Mağaza",
    collections: "Aranjmanlar",
    about: "Hakkımızda",
    contact: "İletişim",
    search: "Ara",
    cart: "Sepet",
    account: "Hesabım",
    admin: "Yönetim",
    login: "Giriş yap",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
  },
  en: {
    home: "Home",
    categories: "Categories",
    shopAll: "Shop all",
    shop: "Shop",
    collections: "Arrangements",
    about: "About",
    contact: "Contact",
    search: "Search",
    cart: "Cart",
    account: "Account",
    admin: "Admin",
    login: "Sign in",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
} as const;

type SiteHeaderProps = { locale: Locale };

// 3D cam levha katmanlari (stiller globals.css icinde: .hero-slab*)
function SlabLayers() {
  return (
    <>
      <span aria-hidden className="hero-slab-back" />
      <span aria-hidden className="hero-slab-glass">
        <span className="hero-slab-sheen" />
      </span>
    </>
  );
}

function IconSlab({
  href,
  label,
  tilt,
  badge,
  children,
}: {
  href: string;
  label: string;
  tilt: string;
  badge?: number | null;
  children: React.ReactNode;
}) {
  return (
    <Link
      aria-label={label}
      className="hero-slab hero-slab--sm hero-slab--circle group relative grid size-12 place-items-center text-white"
      href={href}
      prefetch={false}
      style={{ transform: tilt }}
    >
      <SlabLayers />
      <span
        className="hero-slab-content hero-3d grid place-items-center transition-transform duration-300 group-hover:-translate-y-0.5"
        style={{ transform: "translateZ(12px)" }}
      >
        {children}
      </span>
      {badge !== null && badge !== undefined ? (
        <span
          className="absolute -right-1 -top-1 grid min-w-[20px] place-items-center rounded-full bg-white px-1 text-[11px] font-bold leading-5 text-[#3a1a52] shadow-[0_6px_14px_-4px_rgba(20,6,40,0.6)]"
          style={{ transform: "translateZ(22px)" }}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function HeaderCartButton({ label }: { label: string }) {
  const { cart, hydrated } = useStore();
  const count = hydrated ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  return (
    <IconSlab badge={count} href="/sepet" label={label} tilt="perspective(900px) rotateY(10deg) rotateZ(-3deg)">
      <ShoppingBag className="size-5" strokeWidth={1.8} />
    </IconSlab>
  );
}

function HeaderAccountButton({ labels }: { labels: { account: string; admin: string; login: string } }) {
  const { isAuthenticated, user } = useAuth();
  const href = isAuthenticated ? (user?.role === "ADMIN" ? "/admin" : "/hesabim") : "/giris";
  const label = isAuthenticated ? (user?.role === "ADMIN" ? labels.admin : labels.account) : labels.login;
  return (
    <IconSlab href={href} label={label} tilt="perspective(900px) rotateY(-12deg) rotateZ(4deg)">
      <User className="size-5" strokeWidth={1.8} />
    </IconSlab>
  );
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = copy[locale];

  const collectionsHref = locale === "en" ? "/arrangements" : "/aranjmanlar";
  const links = [
    { label: t.shop, href: "/magaza" },
    { label: t.collections, href: collectionsHref },
    { label: t.about, href: "/hakkimizda" },
    { label: t.contact, href: "/iletisim" },
  ];
  const categoryLinks = [
    { label: t.shopAll, href: "/magaza" },
    { label: t.collections, href: collectionsHref },
  ];

  const isHome = pathname === "/";
  const isCategoriesActive = categoryLinks.some((item) => pathname.startsWith(item.href));
  const activePill = "bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-white/30";

  useEffect(() => {
    if (!categoriesOpen) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!categoriesRef.current?.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [categoriesOpen]);

  return (
    <header className={`${sans.className} fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8`}>
      <div className="mx-auto w-full max-w-7xl">
        {/* Masaustu: logo hapi, menu hapi, ikon dugmeleri */}
        <div className="hidden items-center gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Link
              className="hero-slab hero-slab--sm hero-slab--logo block no-underline"
              href="/"
              style={{ transform: "perspective(1000px) rotateX(3deg) rotateY(11deg) rotateZ(-3.5deg)" }}
            >
              <SlabLayers />
              <span
                className="hero-slab-content hero-3d flex items-center gap-3 px-6 py-3"
                style={{ transform: "translateZ(14px)" }}
              >
                <IrisMark className="h-7 w-7 text-white" />
                <span className={`${serif.className} whitespace-nowrap text-2xl tracking-tight text-white`}>
                  Riva Çiçekçilik
                </span>
              </span>
            </Link>
          </div>

          <nav
            aria-label="Ana menü"
            className="hero-slab hero-slab--sm hero-slab--pill"
            style={{ transform: "perspective(1400px) rotateX(5deg) rotateY(-2deg) rotateZ(0.6deg)" }}
          >
            <SlabLayers />
            <div
              className="hero-slab-content hero-3d flex items-center gap-1 p-1.5 text-[13px] font-semibold text-white"
              style={{ transform: "translateZ(14px)" }}
            >
              <Link
                aria-current={isHome ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors hover:bg-white/15 ${isHome ? activePill : ""}`}
                href="/"
              >
                <House className="size-4" strokeWidth={2} />
                {t.home}
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
                ref={categoriesRef}
              >
                <button
                  aria-expanded={categoriesOpen}
                  aria-haspopup="menu"
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 transition-colors hover:bg-white/15 ${isCategoriesActive ? activePill : ""}`}
                  onClick={() => setCategoriesOpen(true)}
                  type="button"
                >
                  {t.categories}
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}
                    strokeWidth={2.2}
                  />
                </button>
                {categoriesOpen ? (
                  <div className="absolute left-0 top-full z-10 pt-3">
                    <div className="hero-menu-panel min-w-[13rem] p-2" role="menu">
                      {categoryLinks.map((item) => (
                        <Link
                          className="block rounded-[1rem] px-4 py-2.5 text-[13px] font-semibold text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                          href={item.href}
                          key={item.href}
                          onClick={() => setCategoriesOpen(false)}
                          prefetch={false}
                          role="menuitem"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <Link
                aria-current={pathname.startsWith("/hakkimizda") ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 transition-colors hover:bg-white/15 ${pathname.startsWith("/hakkimizda") ? activePill : ""}`}
                href="/hakkimizda"
                prefetch={false}
              >
                {t.about}
              </Link>
              <Link
                aria-current={pathname.startsWith("/iletisim") ? "page" : undefined}
                className={`rounded-full px-4 py-2.5 transition-colors hover:bg-white/15 ${pathname.startsWith("/iletisim") ? activePill : ""}`}
                href="/iletisim"
                prefetch={false}
              >
                {t.contact}
              </Link>
            </div>
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <IconSlab href="/arama" label={t.search} tilt="perspective(900px) rotateY(14deg) rotateZ(-6deg)">
              <Search className="size-5" strokeWidth={1.8} />
            </IconSlab>
            <HeaderCartButton label={t.cart} />
            <HeaderAccountButton labels={{ account: t.account, admin: t.admin, login: t.login }} />
          </div>
        </div>

        {/* Mobil ve tablet: onceki cubuk */}
        <div className="lg:hidden">
          <div className="hero-glass rounded-[1.9rem] px-4 py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <button
                  aria-label={mobileOpen ? t.closeMenu : t.openMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/82 text-[#7f231e] ring-1 ring-[#e3c5bf]/90 transition hover:bg-[#fff1e8]"
                  onClick={() => setMobileOpen((open) => !open)}
                  type="button"
                >
                  {mobileOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
                </button>
                <Link
                  className="inline-flex min-w-0 items-center gap-2.5 no-underline"
                  href="/"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#6b5ca5] shadow-[0_10px_24px_rgba(107,92,165,0.12)]">
                    <IrisMark className="h-6 w-6" />
                  </span>
                  <span className="flex min-w-0 flex-col leading-none">
                    <span className={`${serif.className} truncate text-xl tracking-tight text-white sm:text-2xl`}>
                      Riva Çiçekçilik
                    </span>
                    <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70 sm:block">
                      Floral Atelier
                    </span>
                  </span>
                </Link>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <CartNavLink compact locale={locale} />
                <div className="hidden sm:block">
                  <AuthNavAction compact locale={locale} />
                </div>
              </div>
            </div>

            {mobileOpen ? (
              <div className="mt-3 rounded-[1.4rem] border border-[#e3c5bf] bg-white/86 p-3 shadow-[0_18px_36px_-26px_rgba(170,46,40,0.2)]">
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
      </div>
    </header>
  );
}
