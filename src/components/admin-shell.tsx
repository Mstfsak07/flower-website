"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/types";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/siparisler", "Siparişler"],
  ["/admin/iade-talepleri", "İade Talepleri"],
  ["/admin/urunler", "Ürünler"],
  ["/admin/urunler/yeni", "Ürün Ekle"],
  ["/admin/kuponlar", "Kuponlar"],
  ["/admin/kullanicilar", "Kullanıcılar"],
  ["/admin/sifre", "Şifre Değiştir"],
] as const;

export function AdminShell({
  currentPath,
  title,
  description,
  initialUser,
  children,
}: {
  currentPath: string;
  title: string;
  description: string;
  initialUser?: AuthUser | null;
  children: React.ReactNode;
}) {
  const { loading, logout, user } = useAuth();
  const displayUser = loading ? (initialUser ?? null) : (user ?? initialUser ?? null);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-32 sm:px-6 lg:flex-row lg:px-8">
      <aside className="w-full rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(71,46,56,.35)] lg:w-72 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Admin Panel
        </p>
        <div className="mt-4 rounded-[1.25rem] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-muted)]">
          <div className="font-semibold text-[var(--color-ink)]">{displayUser?.name ?? "Yönetici"}</div>
          <div className="mt-1">{displayUser?.email}</div>
        </div>
        <div className="mt-5 space-y-2">
          {links.map(([href, label]) => (
            <Link
              key={href}
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                currentPath === href
                  ? "bg-[var(--color-ink)] text-white"
                  : "bg-[var(--color-card)] text-[var(--color-ink)] hover:bg-[var(--color-accent)] hover:text-white",
              )}
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>
        <button
          className="mt-4 w-full rounded-2xl bg-[#aa2e28] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-18px_rgba(170,46,40,0.65)] transition hover:bg-[#7f231e]"
          onClick={() => {
            logout().catch(() => undefined);
          }}
          type="button"
        >
          Çıkış Yap
        </button>
      </aside>
      <div className="min-w-0 flex-1 space-y-6">
        <div className="rounded-[2rem] border border-white/70 bg-white p-7 shadow-[0_24px_70px_-45px_rgba(71,46,56,.35)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl text-[var(--color-ink)]">{title}</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-muted)]">
                {description}
              </p>
            </div>
            <button
              className="inline-flex shrink-0 justify-center rounded-full bg-[#aa2e28] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-18px_rgba(170,46,40,0.65)] transition hover:bg-[#7f231e]"
              onClick={() => {
                logout().catch(() => undefined);
              }}
              type="button"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
