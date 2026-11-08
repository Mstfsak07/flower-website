import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { getCategoryById, getLocalizedCategory, getLocalizedProduct, getProductBySlug, getSimilarProducts } from "@/lib/data";
import { manrope as sans, notoSerif as serif } from "@/lib/fonts";
import { getDictionary, getLocale } from "@/lib/i18n";
import { toAbsoluteUrl } from "@/lib/site-url";
import { formatPrice } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const localizedProduct = getLocalizedProduct(product, locale);
  const category = getCategoryById(product.categoryId);
  const localizedCategory = category ? getLocalizedCategory(category, locale) : undefined;
  const similar = getSimilarProducts(product).map((item) => getLocalizedProduct(item, locale));

  return (
    <div className={`${sans.className} min-h-screen bg-[linear-gradient(180deg,#fcf9f4_0%,#faf3ee_34%,#f5eee8_100%)] text-[#2f2623]`}>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_12%,rgba(255,146,72,0.18),transparent_24%),radial-gradient(circle_at_88%_12%,rgba(204,71,62,0.16),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(68,128,100,0.10),transparent_28%),linear-gradient(180deg,#fcf9f4_0%,#faf3ee_40%,#f5eee8_100%)]" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          brand: "Riva Çiçekçilik",
          category: localizedCategory?.name,
          description: localizedProduct.shortDescription,
          image: product.images.map((image) => image.imageUrl),
          name: localizedProduct.name,
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price: product.basePrice,
            priceCurrency: "TRY",
            url: toAbsoluteUrl(`/urun/${product.slug}`),
          },
          sku: product.sku,
        }}
      />
      <main className="min-h-screen pt-32">
        <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 pb-8 md:px-6 xl:grid-cols-[minmax(0,1.08fr)_28rem] xl:gap-12">
          <div className="min-w-0">
            <ProductGallery
              badges={product.badges}
              categoryName={localizedCategory?.name ?? dict.product.signatureCollection}
              deliveryZoneCount={product.deliveryZoneIds.length}
              description={localizedProduct.shortDescription}
              images={product.images}
              name={localizedProduct.name}
              preparationHours={product.minPreparationHours}
              variantCount={product.variants.length}
            />
          </div>

          <div className="space-y-6 xl:sticky xl:top-32 xl:self-start">
            <div className="rounded-[1.5rem] border border-[#e3c5bf] bg-white/82 p-6 shadow-[0_20px_48px_-32px_rgba(170,46,40,0.18)] backdrop-blur-xl">
              <nav className="mb-6 flex gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b716a]">{dict.product.collections}</span>
                <span className="text-[10px] text-[#c0a09a]">/</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8b716a]">{localizedCategory?.name ?? "Signature Series"}</span>
              </nav>
              <div className="mb-6 flex items-baseline gap-6">
                <span className={`${serif.className} text-3xl text-[#aa2e28]`}>{formatPrice(product.basePrice)}</span>
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#8b716a]">
                  <span className="size-1.5 rounded-full bg-[#448064]" />
                  {dict.product.stock}
                </span>
              </div>
              <p className="text-base leading-8 text-[#6d5b57]">{localizedProduct.shortDescription}</p>
            </div>

            <div className="rounded-[1.5rem] border border-[#e3c5bf] bg-white/82 p-6 shadow-[0_20px_48px_-32px_rgba(170,46,40,0.18)] backdrop-blur-xl">
              <div id="purchase-panel" className="[&_*]:border-[var(--color-line)]" style={{
                ["--color-surface" as string]: "#fcf9f4",
                ["--color-card" as string]: "#ffffff",
                ["--color-card-strong" as string]: "#fff4ec",
                ["--color-glass" as string]: "rgba(255,255,255,0.72)",
                ["--color-glass-strong" as string]: "rgba(255,255,255,0.9)",
                ["--color-line" as string]: "rgba(227,197,191,0.95)",
                ["--color-line-strong" as string]: "rgba(170,46,40,0.28)",
                ["--color-ink" as string]: "#2f2623",
                ["--color-muted" as string]: "#6d5b57",
                ["--color-accent" as string]: "#aa2e28",
                ["--color-accent-dark" as string]: "#7f231e",
                ["--depth-shadow" as string]: "0 24px 44px -24px rgba(170,46,40,.16)",
                ["--color-leaf" as string]: "#448064",
              }}>
                <ProductPurchasePanel locale={locale} product={product} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-10 md:px-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              [dict.product.composition, localizedProduct.description],
              [dict.product.careInstructions, dict.product.careDescription],
            ].map(([title, copy]) => (
              <details key={title} className="rounded-[1.5rem] border border-[#e3c5bf] bg-white/82 shadow-[0_18px_42px_-30px_rgba(170,46,40,0.12)] backdrop-blur-xl">
                <summary className="cursor-pointer list-none p-6 text-xs uppercase tracking-[0.1em] text-[#2f2623]">
                  {title}
                </summary>
                <div className="px-6 pb-6 text-sm leading-7 text-[#6d5b57]">{copy}</div>
              </details>
            ))}
          </div>
        </section>

        {similar.length ? (
          <section className="bg-[#fff6f0] px-4 py-28">
            <div className="mx-auto max-w-[1400px]">
              <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="mb-4 block text-[10px] uppercase tracking-[0.3em] text-[#aa2e28]">{dict.product.pairingsEyebrow}</span>
                  <h2 className={`${serif.className} text-5xl`}>{dict.product.pairingsTitle}</h2>
                </div>
                <p className={`${serif.className} max-w-sm text-lg italic text-[#6d5b57]`}>
                  {dict.product.pairingsDescription}
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                {similar.map((item) => (
                  <Link key={item.id} className="group overflow-hidden rounded-[1.75rem] border border-[#e3c5bf] bg-white/86 transition hover:border-[#cc473e] hover:shadow-[0_0_40px_rgba(170,46,40,.10)]" href={`/urun/${item.slug}`}>
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image alt={item.name} className="object-cover transition duration-1000 group-hover:scale-110" fill sizes="(max-width: 768px) 100vw, 33vw" src={item.images[0]?.imageUrl} unoptimized />
                    </div>
                    <div className="p-8">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <h3 className={`${serif.className} text-2xl`}>{item.name}</h3>
                        <span className="text-sm text-[#aa2e28]">{formatPrice(item.basePrice)}</span>
                      </div>
                      <p className="text-sm font-light leading-7 text-[#6d5b57]">{item.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
