"use client";

import { localeCookieName, type Locale } from "@/lib/locale";

type LanguageSwitcherProps = {
  currentLocale: Locale;
  label: string;
};

const locales: Locale[] = ["tr", "en"];

export function LanguageSwitcher({ currentLocale, label }: LanguageSwitcherProps) {
  return (
    <div
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-full border border-[rgba(212,175,55,0.28)] bg-[rgba(10,10,10,0.62)] p-1.5 shadow-[0_18px_50px_-22px_rgba(0,0,0,0.65)] backdrop-blur-xl"
      role="group"
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;

        return (
          <button
            className={
              active
                ? "rounded-full bg-[#d4af37] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-black"
                : "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8dbb0] transition hover:bg-white/10 hover:text-white"
            }
            key={locale}
            onClick={() => {
              if (active) return;

              document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
              window.location.reload();
            }}
            type="button"
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
