"use client";

import { usePathname } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/lib/locale";

type LayoutChromeProps = {
  currentLocale: Locale;
};

export function LayoutChrome({ currentLocale }: LayoutChromeProps) {
  const pathname = usePathname();
  const hideChrome = pathname === "/";

  if (hideChrome) {
    return null;
  }

  return <SiteHeader currentLocale={currentLocale} />;
}
