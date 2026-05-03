"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";

import { useStore } from "@/components/providers/store-provider";
import { getLocalizedProduct } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const copy = {
  tr: {
    purchaseSurface: "Satin alma alani",
    summaryNote: "Secilen varyant ve ekler bu tutara aninda yansir. Checkout ekraninda teslimat ve kupon etkisi ayrica netlestirilir.",
    size: "Boyut",
    makeSelection: "Secim yap",
    cardNote: "Kart Notu",
    cardPlaceholder: "Kisa bir not ekleyebilirsin.",
    quantity: "Adet",
    deliveryNote: "Teslimat notu",
    deliveryCopy: "Bu urun minimum {hours} saat hazirlama suresiyle ayni gun teslimata uygundur.",
    orderSnapshot: "Siparis snapshot",
    selectedSize: "Secilen boyut",
    defaultSize: "Standart",
    prepRhythm: "Hazirlama ritmi",
    hours: "saat",
    atelierTotal: "Atelier toplam",
    addToCart: "Sepete Ekle",
    buyNow: "Hemen Al",
  },
  en: {
    purchaseSurface: "Purchase Surface",
    summaryNote: "Selected variants and add-ons update the price instantly. Delivery and coupon effects are clarified at checkout.",
    size: "Size",
    makeSelection: "Make a Selection",
    cardNote: "Card Note",
    cardPlaceholder: "Add a short note.",
    quantity: "Quantity",
    deliveryNote: "Delivery note",
    deliveryCopy: "This product is eligible for same-day delivery with a minimum preparation time of {hours} hours.",
    orderSnapshot: "Order Snapshot",
    selectedSize: "Selected size",
    defaultSize: "Standard",
    prepRhythm: "Preparation time",
    hours: "hours",
    atelierTotal: "Atelier total",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
  },
} as const;

export function ProductPurchasePanel({ locale, product }: { locale: Locale; product: Product }) {
  const router = useRouter();
  const { addToCart } = useStore();
  const t = copy[locale];
  const localizedProduct = getLocalizedProduct(product, locale);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | boolean>>({});

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId),
    [product.variants, variantId],
  );

  const unitPrice = product.basePrice + (selectedVariant?.priceDelta ?? 0);
  const optionPriceDelta = product.options
    .filter((option) => option.type === "SELECT")
    .reduce((total, option) => {
      const selectedValue = selectedOptions[option.name];
      const match = option.values?.find((entry) => entry.value === selectedValue);
      return total + (match?.priceDelta ?? 0);
    }, 0);
  const totalUnitPrice = unitPrice + optionPriceDelta;

  return (
    <div className="floating-surface space-y-6 rounded-[2.6rem] p-6">
      <div className="space-y-2">
        <div className="editorial-label text-[var(--color-accent)]">{t.purchaseSurface}</div>
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">{localizedProduct.name}</h1>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{localizedProduct.shortDescription}</p>
      </div>

      <div className="rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,.88),rgba(255,245,240,.82))] p-5 shadow-[0_18px_40px_-30px_rgba(60,35,43,.35)]">
        <div className="text-3xl font-semibold text-[var(--color-ink)]">{formatPrice(totalUnitPrice)}</div>
        {product.compareAtPrice ? (
          <div className="mt-1 text-sm text-[var(--color-muted)] line-through">
            {formatPrice(product.compareAtPrice)}
          </div>
        ) : null}
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          {t.summaryNote}
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[var(--color-ink)]">{t.size}</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              className={`rounded-[1.25rem] border px-4 py-3 text-left ${
                variant.id === variantId
                  ? "border-[var(--color-accent)] bg-[var(--color-card)] shadow-[0_20px_40px_-28px_rgba(196,91,109,.95)]"
                  : "border-[var(--color-line)] bg-white"
              }`}
              onClick={() => setVariantId(variant.id)}
              type="button"
            >
              <div className="font-medium text-[var(--color-ink)]">{variant.value}</div>
              <div className="text-sm text-[var(--color-muted)]">
                +{formatPrice(variant.priceDelta)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {product.options
        .filter((option) => option.type === "SELECT")
        .map((option) => (
          <div className="space-y-3" key={option.id}>
            <label className="text-sm font-semibold text-[var(--color-ink)]">{option.name}</label>
            <select
              className="w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              onChange={(event) =>
                setSelectedOptions((current) => ({
                  ...current,
                  [option.name]: event.target.value,
                }))
              }
              value={(selectedOptions[option.name] as string | undefined) ?? ""}
            >
              <option value="">{t.makeSelection}</option>
              {option.values?.map((value) => (
                <option key={value.id} value={value.value}>
                  {value.value} {value.priceDelta > 0 ? `(+${formatPrice(value.priceDelta)})` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[var(--color-ink)]">{t.cardNote}</label>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          onChange={(event) => setNote(event.target.value)}
          placeholder={t.cardPlaceholder}
          value={note}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[var(--color-ink)]">{t.quantity}</label>
        <div className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-white">
          <button
            className="px-4 py-2 text-lg"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            type="button"
          >
            -
          </button>
          <span className="min-w-12 text-center text-sm font-semibold">{quantity}</span>
          <button className="px-4 py-2 text-lg" onClick={() => setQuantity((current) => current + 1)} type="button">
            +
          </button>
        </div>
      </div>

      <div className="rounded-[1.7rem] bg-[linear-gradient(180deg,#f7fbf5,#eef6eb)] p-4 text-sm leading-7 text-[var(--color-ink)]">
        <div className="flex items-center gap-2 font-semibold">
          <Truck className="size-4 text-[var(--color-leaf)]" />
          {t.deliveryNote}
        </div>
        <p className="mt-2 text-[var(--color-muted)]">
          {t.deliveryCopy.replace("{hours}", String(product.minPreparationHours))}
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-white/60 bg-white/70 p-4">
        <div className="editorial-label text-[var(--color-muted)]">{t.orderSnapshot}</div>
        <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
          <div className="flex items-center justify-between gap-4">
            <span>{t.selectedSize}</span>
            <span className="font-semibold text-[var(--color-ink)]">{selectedVariant?.value ?? t.defaultSize}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>{t.prepRhythm}</span>
            <span className="font-semibold text-[var(--color-ink)]">{product.minPreparationHours} {t.hours}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>{t.atelierTotal}</span>
            <span className="font-semibold text-[var(--color-ink)]">{formatPrice(totalUnitPrice * quantity)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() =>
            addToCart({
              productId: product.id,
              quantity,
              variantId,
              unitPrice: totalUnitPrice,
              note,
              selectedOptions,
            })
          }
          type="button"
        >
          {t.addToCart}
        </button>
        <button
          className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
          onClick={() => {
            addToCart({
              productId: product.id,
              quantity,
              variantId,
              unitPrice: totalUnitPrice,
              note,
              selectedOptions,
            });
            router.push("/odeme");
          }}
          type="button"
        >
          {t.buyNow}
        </button>
      </div>
    </div>
  );
}
