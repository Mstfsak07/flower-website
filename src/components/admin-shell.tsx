"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/urunler", "Urunler"],
  ["/admin/siparisler", "Siparisler"],
  ["/admin/toptan-talepler", "Toptan Talepler"],
  ["/admin/kuponlar", "Kuponlar"],
  ["/admin/ayarlar", "Ayarlar"],
] as const;

export function AdminShell({
  currentPath,
  title,
  description,
  children,
}: {
  currentPath: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const { logout, user } = useAuth();

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
      <aside className="w-full rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_70px_-45px_rgba(71,46,56,.35)] lg:w-72 lg:self-start">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Admin Panel
        </p>
        <div className="mt-4 rounded-[1.25rem] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-muted)]">
          <div className="font-semibold text-[var(--color-ink)]">{user?.name ?? "Yonetici"}</div>
          <div className="mt-1">{user?.email}</div>
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
          className="mt-4 w-full rounded-2xl bg-[var(--color-ink)] px-4 py-3 text-sm font-medium text-white"
          onClick={() => {
            logout().catch(() => undefined);
          }}
          type="button"
        >
          Cikis Yap
        </button>
      </aside>
      <div className="min-w-0 flex-1 space-y-6">
        <div className="rounded-[2rem] border border-white/70 bg-white p-7 shadow-[0_24px_70px_-45px_rgba(71,46,56,.35)]">
          <h1 className="font-serif text-4xl text-[var(--color-ink)]">{title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-muted)]">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}
