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
      className="inline-flex items-center gap-1 rounded-full border border-[#d9ccc3] bg-[#fffdfa]/95 p-1.5 shadow-lg backdrop-blur-xl"
      role="group"
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;

        return (
          <button
            className={
              active
                ? "rounded-full bg-[#aa2e28] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                : "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#625d57] transition hover:bg-[#f1e9e3]"
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
