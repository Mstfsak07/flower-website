"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";

import { useStore } from "@/components/providers/store-provider";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | boolean>>({});

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId),
    [product.variants, variantId],
  );

  const unitPrice = product.basePrice + (selectedVariant?.priceDelta ?? 0);

  return (
    <div className="panel space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">{product.name}</h1>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{product.shortDescription}</p>
      </div>

      <div className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
        <div className="text-3xl font-semibold text-[var(--color-ink)]">{formatPrice(unitPrice)}</div>
        {product.compareAtPrice ? (
          <div className="mt-1 text-sm text-[var(--color-muted)] line-through">
            {formatPrice(product.compareAtPrice)}
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[var(--color-ink)]">Boyut</label>
        <div className="grid gap-3 sm:grid-cols-3">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              className={`rounded-[1.25rem] border px-4 py-3 text-left ${
                variant.id === variantId
                  ? "border-[var(--color-accent)] bg-[var(--color-card)]"
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
              <option value="">Secim yap</option>
              {option.values?.map((value) => (
                <option key={value.id} value={value.value}>
                  {value.value} {value.priceDelta > 0 ? `(+${formatPrice(value.priceDelta)})` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[var(--color-ink)]">Kart Notu</label>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
          onChange={(event) => setNote(event.target.value)}
          placeholder="Kisa bir not ekleyebilirsin."
          value={note}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-[var(--color-ink)]">Adet</label>
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

      <div className="rounded-[1.5rem] bg-[#f4f8f1] p-4 text-sm leading-7 text-[var(--color-ink)]">
        <div className="flex items-center gap-2 font-semibold">
          <Truck className="size-4 text-[var(--color-leaf)]" />
          Teslimat notu
        </div>
        <p className="mt-2 text-[var(--color-muted)]">
          Bu urun minimum {product.minPreparationHours} saat hazirlama suresiyle ayni gun
          teslimata uygundur.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
          onClick={() =>
            addToCart({
              productId: product.id,
              quantity,
              variantId,
              unitPrice,
              note,
              selectedOptions,
            })
          }
          type="button"
        >
          Sepete Ekle
        </button>
        <button
          className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
          onClick={() => {
            addToCart({
              productId: product.id,
              quantity,
              variantId,
              unitPrice,
              note,
              selectedOptions,
            });
            router.push("/odeme");
          }}
          type="button"
        >
          Hemen Al
        </button>
      </div>
    </div>
  );
}
