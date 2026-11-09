"use client";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
      <div className="fixed bottom-6 right-6 z-[70]">
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
