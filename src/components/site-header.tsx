"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flower2, Menu, PhoneCall, Shield, ShoppingBag, Sparkles, X } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { useStore } from "@/components/providers/store-provider";
import { isAdminRole } from "@/lib/auth";
import { siteSettings } from "@/lib/data";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kategori/mini-buketler", label: "Koleksiyon" },
  { href: "/toptan", label: "Kurumsal" },
  { href: "/siparis-takip", label: "Siparis Takip" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const { cart, hydrated } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const adminLoggedIn = isAdminRole(user?.role);
  const accountHref = adminLoggedIn ? "/admin" : "/hesabim";
  const accountLabel = adminLoggedIn ? "Yonetim" : "Hesabim";

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-[rgba(253,250,248,.75)] backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          href="/"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20">
            <Flower2 className="size-5" />
          </div>
          <div>
            <div className="font-serif text-xl font-medium tracking-wide text-[var(--color-ink)]">
              {siteSettings.storeName}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              <Sparkles className="size-3" />
              Zarif ve Ozenli
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-white/80 text-[var(--color-ink)] shadow-sm border border-white/60"
                    : "text-[var(--color-muted)] hover:bg-white/50 hover:text-[var(--color-ink)]",
                )}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] transition-all hover:bg-white/70 hover:text-[var(--color-ink)] lg:inline-flex"
                href={accountHref}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="size-3.5" />
                {accountLabel}
              </Link>
              <button
                className="hidden rounded-full border border-white/50 bg-white/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] transition-all hover:bg-white/70 hover:text-[var(--color-ink)] lg:inline-flex"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout().catch(() => undefined);
                }}
                type="button"
              >
                Cikis
              </button>
            </>
          ) : (
            <Link
              className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)] transition-all hover:bg-white/70 hover:text-[var(--color-ink)] lg:inline-flex"
              href="/giris"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="size-3.5" />
              Giris
            </Link>
          )}
          <a
            className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/40 px-4 py-2 text-sm font-medium text-[var(--color-ink)] backdrop-blur-md transition-all hover:bg-white/70 lg:flex"
            href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
            rel="noreferrer"
            target="_blank"
          >
            <PhoneCall className="size-4" />
            WhatsApp
          </a>
          <Link
            className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/5 transition-transform hover:bg-[var(--color-ink)]/90 active:scale-95"
            href="/sepet"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag className="size-4.5" />
            <span className="hidden sm:inline">Sepet</span>
            {hydrated && count > 0 ? (
              <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-xs font-bold text-white shadow-sm">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            aria-controls="mobile-site-nav"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Menuyu kapat" : "Menuyu ac"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/50 bg-white/60 text-[var(--color-ink)] backdrop-blur-md transition-all hover:bg-white/80 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen ? (
        <div className="md:hidden">
          <button
            aria-label="Menuyu kapat"
            className="fixed inset-0 z-40 bg-[var(--color-ink)]/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            type="button"
          />
          <div
            className="absolute inset-x-4 top-[calc(100%+0.75rem)] z-50 overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(255,252,250,.96)] p-5 shadow-2xl shadow-[var(--color-ink)]/10"
            id="mobile-site-nav"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-line)]/70 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                  Hizli Menu
                </p>
                <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">Cicek secimini hizlandir.</p>
              </div>
              <button
                aria-label="Menuyu kapat"
                className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
                onClick={() => setMobileMenuOpen(false)}
                type="button"
              >
                <X className="size-4.5" />
              </button>
            </div>

            <nav className="mt-4 grid gap-2">
              {links.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                return (
                  <Link
                    key={link.href}
                    className={cn(
                      "rounded-[1.25rem] border px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "border-white/80 bg-white text-[var(--color-ink)] shadow-sm"
                        : "border-transparent bg-[var(--color-card)]/70 text-[var(--color-muted)] hover:border-white/80 hover:bg-white hover:text-[var(--color-ink)]",
                    )}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 grid gap-3 rounded-[1.5rem] bg-[var(--color-card)]/80 p-4">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-3 text-sm font-semibold text-white"
                href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`}
                rel="noreferrer"
                target="_blank"
              >
                <PhoneCall className="size-4" />
                WhatsApp Destek
              </a>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-muted)]"
                href={isAuthenticated ? accountHref : "/giris"}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="size-4" />
                {isAuthenticated ? accountLabel : "Giris Yap"}
              </Link>
              {isAuthenticated ? (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-muted)]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout().catch(() => undefined);
                  }}
                  type="button"
                >
                  Cikis Yap
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
