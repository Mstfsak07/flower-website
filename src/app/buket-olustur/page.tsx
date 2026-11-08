import type { Metadata } from "next";

import { BouquetAiPlayground } from "@/components/bouquet-ai-playground";
import { manrope as sans, notoSerif as serif } from "@/lib/fonts";
import { getLocale } from "@/lib/i18n";
import { listProducts } from "@/lib/services/catalog-service";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return locale === "en"
    ? {
        title: "AI Bouquet Brief | Riva Çiçekçilik",
        description: "Describe your ideal bouquet and get an AI-guided floral direction with matching catalog products.",
      }
    : {
        title: "AI Buket Tarifi | Riva Çiçekçilik",
        description: "Hayalindeki buketi tarif et, AI destekli buket yonu ve uygun katalog onerileri al.",
      };
}

export default async function BouquetBuilderPage() {
  const locale = await getLocale();
  const products = await listProducts();

  return (
    <div className={`${sans.className} min-h-screen overflow-x-hidden bg-[#08100b] text-white`}>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(212,175,55,0.22), transparent 30%), linear-gradient(180deg, rgba(3,8,5,0.92), rgba(3,8,5,0.98)), url('/arkaplan.png?v=20260419001142')",
        }}
      >
        <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-8">
          <div className="mb-10 max-w-3xl">
            <div className="text-xs uppercase tracking-[0.28em] text-[#f3d98b]">Riva Çiçekçilik AI</div>
            <h1 className={`${serif.className} mt-4 text-5xl tracking-tight text-white md:text-7xl`}>
              {locale === "en" ? "Describe The Feeling, Not The SKU." : "SKU Degil, Hissi Tarif Et."}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
              {locale === "en"
                ? "This page turns your brief into an atelier-style bouquet suggestion and then matches it against the live catalog."
                : "Bu sayfa tarifini atolye usulu bir buket onerisine donusturur ve sonra bunu canli katalogla eslestirir."}
            </p>
          </div>

          <BouquetAiPlayground locale={locale} products={products} />
        </main>
      </div>
    </div>
  );
}
