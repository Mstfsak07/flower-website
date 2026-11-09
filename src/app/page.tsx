import type { Metadata } from "next";

import { StitchHome } from "@/components/home/stitch-home";

export const metadata: Metadata = {
  title: "Riva Çiçekçilik | Kepez Butik Çiçek Atölyesi",
  description:
    "Antalya Kepez'de taze çiçek, butik aranjman ve aynı gün kurye teslimatı.",
};

export default function HomePage() {
  return <StitchHome />;
}
