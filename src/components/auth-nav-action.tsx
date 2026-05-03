"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import type { Locale } from "@/lib/locale";

type AuthNavActionProps = {
  compact?: boolean;
  locale?: Locale;
};

const copy = {
  tr: {
    account: "Hesabim",
    admin: "Yonetim",
    loginRegister: "Giris / Kayit Ol",
  },
  en: {
    account: "Account",
    admin: "Admin",
    loginRegister: "Login / Register",
  },
} as const;

export function AuthNavAction({ compact = false, locale = "tr" }: AuthNavActionProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const labels = copy[locale];
  const compactClass =
    "whitespace-nowrap rounded-full bg-white/82 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f231e] ring-1 ring-[#e3c5bf]/90 transition hover:bg-[#fff1e8] hover:text-[#aa2e28] sm:px-3 sm:text-[11px] sm:tracking-[0.16em]";

  if (loading) {
    return (
      <span
        className={
          compact
            ? "whitespace-nowrap rounded-full bg-white/70 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b18a84] ring-1 ring-[#e3c5bf]/80 sm:px-3 sm:text-[11px] sm:tracking-[0.16em]"
            : "rounded-full border border-[#e3c5bf] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#b18a84]"
        }
      >
        ...
      </span>
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        className={
          compact
            ? compactClass
            : "rounded-full border border-[#e3c5bf] bg-white/82 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#7f231e] transition hover:bg-[#fff1e8] hover:text-[#aa2e28]"
        }
        href={user?.role === "ADMIN" ? "/admin" : "/hesabim"}
        prefetch={false}
      >
        {user?.role === "ADMIN" ? labels.admin : labels.account}
      </Link>
    );
  }

  return (
    <Link
      className={
        compact
          ? compactClass
          : "rounded-full border border-[#e3c5bf] bg-white/82 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#7f231e] transition hover:bg-[#fff1e8] hover:text-[#aa2e28]"
      }
      href="/giris"
      prefetch={false}
    >
      {labels.loginRegister}
    </Link>
  );
}
