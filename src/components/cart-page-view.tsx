"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Sparkles, Trash2 } from "lucide-react";

import { useStore } from "@/components/providers/store-provider";
import { getLocalizedProduct, getProductById } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { formatPrice } from "@/lib/utils";

type CartPageViewProps = {
  locale: Locale;
};

const copy = {
  tr: {
    loadingLabel: "Sepet Yukleniyor",
    loadingTitle: "Sepet bilgileri hazirlaniyor.",
    emptyLabel: "Sepet Bos",
    emptyTitle: "Sepetinde henuz urun yok.",
    emptyDescription: "Urun ekledikten sonra odeme adimina gecebilirsin.",
    backToCatalog: "Magazaya Don",
    pageTitle: "Alisveris Sepeti",
    pageSubtitle: "Luks secimlerin burada seni bekliyor",
    quantity: "Adet",
    remove: "Kaldir",
    price: "Fiyat",
    subtotal: "Ara Toplam",
    cartTotal: "Sepet Toplami",
    summaryTitle: "Sepet Ozeti",
    estimatedTax: "Tahmini Vergi",
    shipping: "Kargo",
    complimentary: "Ucretsiz",
    checkout: "Odeme Adimina Gec",
    securePayment: "Guvenli odeme",
    continueShopping: "Alisverise Devam Et",
    footerCopy: "© 2024 Iris Atalier. Tum haklari saklidir.",
  },
  en: {
    loadingLabel: "Loading Cart",
    loadingTitle: "Preparing your cart details.",
    emptyLabel: "Cart Empty",
    emptyTitle: "There are no items in your cart yet.",
    emptyDescription: "Add products before moving to checkout.",
    backToCatalog: "Return to Shop",
    pageTitle: "Shopping Cart",
    pageSubtitle: "Your luxurious selections",
    quantity: "Quantity",
    remove: "Remove",
    price: "Price",
    subtotal: "Subtotal",
    cartTotal: "Cart Total",
    summaryTitle: "Cart Summary",
    estimatedTax: "Estimated Tax",
    shipping: "Shipping",
    complimentary: "Complimentary",
    checkout: "Proceed to Checkout",
    securePayment: "Secure payment",
    continueShopping: "Continue Shopping",
    footerCopy: "© 2024 Iris Atalier. All rights reserved.",
  },
} as const;

export function CartPageView({ locale }: CartPageViewProps) {
  const t = copy[locale];
  const { cart, hydrated, removeFromCart, updateQuantity } = useStore();
  const items = cart
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((entry): entry is { item: (typeof cart)[number]; product: NonNullable<ReturnType<typeof getProductById>> } => Boolean(entry.product));
  const localizedItems = items.map(({ item, product }) => ({ item, product: getLocalizedProduct(product, locale) }));

  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const estimatedTax = subtotal * 0.07;
  const total = subtotal + estimatedTax;

  if (!hydrated) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#6b5ca5]">{t.loadingLabel}</p>
        <h1 className="mt-4 font-serif text-5xl text-[#aa2e28]">{t.loadingTitle}</h1>
      </section>
    );
  }

  if (localizedItems.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#6b5ca5]">{t.emptyLabel}</p>
        <h1 className="mt-4 font-serif text-5xl text-[#aa2e28]">{t.emptyTitle}</h1>
        <p className="mx-auto mt-4 max-w-xl text-[#6d5b57]">{t.emptyDescription}</p>
        <Link
          className="mt-8 inline-flex rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#aa2e2833] transition hover:opacity-95"
          href="/magaza"
        >
          {t.backToCatalog}
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="mb-14 text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b5ca5]">
          {locale === "tr" ? "Sepet" : "Cart"}
        </p>
        <h1 className="font-serif text-5xl font-medium tracking-tight text-[#aa2e28]">{t.pageTitle}</h1>
        <p className="mt-3 font-sans text-lg text-[#6d5b57]">{t.pageSubtitle}</p>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row">
        <div className="flex-grow space-y-8">
          {localizedItems.map(({ item, product }) => (
            <div className="rounded-[1.8rem] border border-[#e3c5bf] bg-white/82 p-6 shadow-[0_22px_52px_-38px_rgba(170,46,40,0.22)]" key={item.id}>
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <Image
                  alt={product.name}
                  className="h-40 w-40 rounded-[1.25rem] border border-[#ead8d2] object-cover"
                  height={160}
                  src={product.images[0]?.imageUrl}
                  unoptimized
                  width={160}
                />
                <div className="flex w-full flex-grow flex-col justify-between md:flex-row">
                  <div className="space-y-4 text-center md:text-left">
                    <h3 className="font-serif text-2xl text-[#2f2623]">{product.name}</h3>
                    <div className="flex items-center justify-center gap-4 md:justify-start">
                      <span className="text-sm uppercase tracking-widest text-[#8c716d]">{t.quantity}:</span>
                      <div className="inline-flex items-center rounded-full border border-[#ead8d2] bg-[#fff8f3]">
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center text-[#7f231e]"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          type="button"
                        >
                          <Minus className="size-4" />
                        </button>
                        <input
                          className="w-12 bg-transparent text-center text-sm font-semibold text-[#2f2623] outline-none"
                          min={1}
                          onChange={(event) => updateQuantity(item.id, Number(event.target.value) || 1)}
                          type="number"
                          value={item.quantity}
                        />
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center text-[#7f231e]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          type="button"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#aa2e28] underline underline-offset-4 transition hover:text-[#7f231e]"
                      onClick={() => removeFromCart(item.id)}
                      type="button"
                    >
                      <Trash2 className="size-4" />
                      {t.remove}
                    </button>
                  </div>
                  <div className="mt-4 space-y-1 text-right md:mt-0">
                    <p className="text-sm text-[#8c716d]">
                      {t.quantity}: {item.quantity}
                    </p>
                    {item.quantity > 1 ? (
                      <>
                        <p className="text-sm text-[#8c716d]">
                          {t.price}: {formatPrice(item.unitPrice)} / adet
                        </p>
                        <p className="text-xl font-medium text-[#aa2e28]">
                          {t.subtotal}: {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-medium text-[#aa2e28]">
                        {t.price}: {formatPrice(item.unitPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6 text-right">
            <span className="font-serif text-2xl font-medium tracking-wider text-[#aa2e28]">
              {t.cartTotal}: {formatPrice(total)}
            </span>
          </div>
        </div>

        <aside className="w-full lg:w-96">
          <div className="sticky top-36 rounded-[1.8rem] border border-[#e3c5bf] bg-white/84 p-8 shadow-[0_22px_52px_-38px_rgba(170,46,40,0.22)] backdrop-blur-md">
            <h2 className="mb-10 text-center font-serif text-2xl font-medium uppercase tracking-widest text-[#aa2e28]">
              {t.summaryTitle}
            </h2>
            <div className="mb-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-light text-[#6d5b57]">{t.subtotal}:</span>
                <span className="font-medium text-[#2f2623]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-light text-[#6d5b57]">{t.estimatedTax}:</span>
                <span className="font-medium text-[#2f2623]">{formatPrice(estimatedTax)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-light text-[#6d5b57]">{t.shipping} ({t.complimentary}):</span>
                <span className="font-medium text-[#2f2623]">{formatPrice(0)}</span>
              </div>
            </div>
            <div className="space-y-6 text-center">
              <Link
                className="block w-full rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#aa2e2833] transition hover:opacity-95"
                href="/odeme"
              >
                {t.checkout}
              </Link>
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#8c716d]">
                <Sparkles className="size-4" />
                {t.securePayment}
              </div>
              <Link
                className="block text-sm font-light uppercase tracking-widest text-[#aa2e28] underline underline-offset-8 transition hover:text-[#7f231e]"
                href="/magaza"
              >
                {t.continueShopping}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
