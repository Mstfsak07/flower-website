"use client";

import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

type AuthNavActionProps = {
  compact?: boolean;
  locale?: Locale;
  /** Giris yapilmamissa tek link yerine "Giris Yap" ve "Kayit Ol" butonlarini ayri ayri goster. */
  split?: boolean;
  /** split modunda renk dili: light = acik header, glass = ana sayfadaki 3D cam header. */
  tone?: "light" | "glass";
  /** split modunda butonlar kapsayiciyi doldurur (mobil menu). */
  stretch?: boolean;
};

const copy = {
  tr: {
    account: "Hesabım",
    admin: "Yönetim",
    loginRegister: "Giriş / Kayıt Ol",
    login: "Giriş Yap",
    register: "Kayıt Ol",
  },
  en: {
    account: "Account",
    admin: "Admin",
    loginRegister: "Login / Register",
    login: "Sign In",
    register: "Sign Up",
  },
} as const;

const splitStyles = {
  light: {
    login:
      "rounded-full border border-[#e3c5bf] bg-white/82 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f231e] transition hover:bg-[#fff1e8] hover:text-[#aa2e28]",
    register:
      "rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_10px_22px_-14px_rgba(170,46,40,0.7)] transition hover:opacity-95",
  },
  glass: {
    login:
      "rounded-full bg-white/15 px-4 py-2.5 text-[12px] font-semibold text-white ring-1 ring-white/35 backdrop-blur-md transition hover:bg-white/25",
    register:
      "rounded-full bg-white px-4 py-2.5 text-[12px] font-bold text-[#3a1a52] shadow-[0_8px_18px_-8px_rgba(20,6,40,0.6)] transition hover:bg-white/90",
  },
} as const;

export function AuthNavAction({
  compact = false,
  locale = "tr",
  split = false,
  tone = "light",
  stretch = false,
}: AuthNavActionProps) {
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

  if (split) {
    const tones = splitStyles[tone];
    return (
      <div className={cn("flex items-center gap-2", stretch && "w-full")}>
        <Link
          className={cn("whitespace-nowrap", tones.login, stretch && "flex-1 text-center")}
          href="/giris"
          prefetch={false}
        >
          {labels.login}
        </Link>
        <Link
          className={cn("whitespace-nowrap", tones.register, stretch && "flex-1 text-center")}
          href="/kayit-ol"
          prefetch={false}
        >
          {labels.register}
        </Link>
      </div>
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
