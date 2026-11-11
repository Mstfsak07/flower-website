"use client";

import { usePathname } from "next/navigation";

import { BotanicalHeader as SiteHeader, BotanicalFooter as SiteFooter } from "@/components/botanical/site-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/lib/locale";

type LayoutChromeProps = {
  currentLocale: Locale;
  area?: "header" | "footer" | "language";
  languageLabel?: string;
};

export function LayoutChrome({ currentLocale, area = "header", languageLabel }: LayoutChromeProps) {
  const pathname = usePathname();
  const hideChrome = pathname === "/";

  if (hideChrome) {
    return null;
  }

  if (area === "language") {
    return (
      <div className="fixed right-3 top-24 z-[70] lg:bottom-6 lg:right-6 lg:top-auto">
        <LanguageSwitcher currentLocale={currentLocale} label={languageLabel ?? "Dil"} />
      </div>
    );
  }

  return area === "header" ? (
    <SiteHeader currentLocale={currentLocale} />
  ) : (
    <SiteFooter currentLocale={currentLocale} />
  );
}
