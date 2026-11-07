import { Manrope, Noto_Serif } from "next/font/google";
import type { Metadata } from "next";
import { Search } from "lucide-react";

import { ShopProductGrid } from "@/components/shop-product-grid";
import { getLocale } from "@/lib/i18n";
import { listProducts } from "@/lib/services/catalog-service";

const serif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return locale === "en"
    ? {
        title: "Shop | Riva Çiçekçilik",
        description: "Explore refined floral selections by category and product.",
      }
    : {
        title: "Magaza | Riva Çiçekçilik",
        description: "Canli, rafine ve mevsimsel cicek secimlerini kategorilere gore kesfet.",
      };
}

export default async function SearchPage() {
  const locale = await getLocale();
  const products = await listProducts();
  const searchLabel = locale === "en" ? "Search" : "Ara";

  return (
    <div className={`${sans.className} min-h-screen overflow-x-hidden bg-[#fcf9f4] text-[#1c1c19]`}>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_14%_8%,rgba(255,146,72,0.16),transparent_22%),radial-gradient(circle_at_88%_18%,rgba(68,128,100,0.14),transparent_24%),linear-gradient(180deg,#fcf9f4_0%,#f6f3ee_100%)]" />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <section className="mb-10 rounded-[2.25rem] border border-[#e0bfbb] bg-white/60 px-6 py-8 shadow-[0_24px_60px_-40px_rgba(170,46,40,0.16)] backdrop-blur-md md:px-8">
          <div className="mb-10 flex justify-center">
            <form
              action="/magaza#shop-filters"
              className="flex w-[min(92vw,34rem)] items-center rounded-full border border-[#e0bfbb] bg-white/88 px-2 py-2 shadow-[0_18px_40px_-24px_rgba(170,46,40,0.14)] backdrop-blur-md"
              method="get"
            >
              <div className="flex items-center gap-2 pl-3 text-[#aa2e28]">
                <Search className="size-4" strokeWidth={1.9} />
              </div>
              <input
                className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-sm text-[#1c1c19] outline-none shadow-none placeholder:text-[#8c716d] focus-visible:outline-none focus-visible:shadow-none"
                name="q"
                placeholder={searchLabel}
                type="text"
              />
              <button
                className="rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition"
                type="submit"
              >
                {searchLabel}
              </button>
            </form>
          </div>
          <ShopProductGrid locale={locale} products={products} serifClassName={serif.className} />
        </section>
      </main>
    </div>
  );
}
