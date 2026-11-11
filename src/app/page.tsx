import type { Metadata } from "next";

import { StitchHome } from "@/components/home/stitch-home";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Riva Çiçekçilik | Kepez Butik Çiçek Atölyesi",
  description:
    "Antalya Kepez'de taze çiçek, butik aranjman ve aynı gün kurye teslimatı.",
};

export default async function HomePage() {
  const locale = await getLocale();
  return <StitchHome locale={locale} />;
}
