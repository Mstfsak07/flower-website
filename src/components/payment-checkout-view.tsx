"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { CreditCard, Wallet } from "lucide-react";

import { CheckoutConsentFields } from "@/components/checkout-consent-fields";
import { useStore } from "@/components/providers/store-provider";
import { coupons, getLocalizedProduct, getProductById } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  customerEmail: z.string().email(),
  recipientName: z.string().min(2),
  recipientPhone: z.string().min(10),
  city: z.string().min(2),
  district: z.string().min(2),
  neighborhood: z.string().min(2),
  addressLine: z.string().min(5),
  deliveryDate: z.string().min(1),
  deliverySlot: z.string().min(1),
  paymentMethod: z.enum(["CARD", "BANK_TRANSFER", "CASH_ON_DELIVERY"]),
  cardMessage: z.string().optional(),
  note: z.string().optional(),
  couponCode: z.string().optional(),
  acceptDistanceSales: z.boolean().refine(Boolean, {
    message: "Mesafeli Satış Sözleşmesini kabul etmelisin.",
  }),
  readPrivacyPolicy: z.boolean().refine(Boolean, {
    message: "Gizlilik Politikasını okuduğunu onaylamalısın.",
  }),
  readReturnPolicy: z.boolean().refine(Boolean, {
    message: "İade ve İptal Koşullarını okuduğunu onaylamalısın.",
  }),
});

type FormValues = z.infer<typeof schema>;

type PaymentCheckoutViewProps = {
  locale: Locale;
  serifClassName: string;
};

const copy = {
  tr: {
    addressLine: "Açık Adres",
    approvals: "Onaylar",
    backToShop: "Mağazaya Dön",
    cardName: "Kart Sahibinin Adı",
    cardNumber: "Kart Numarası",
    checkoutSubmit: "Siparişi Tamamla",
    city: "Şehir",
    coupon: "Kupon",
    customerName: "Ad Soyad",
    customerPhone: "Telefon",
    deliveryDate: "Teslimat Tarihi",
    deliveryInfo: "Teslimat Bilgileri",
    deliverySlot: "Saat Aralığı",
    district: "İlçe",
    emptyLabel: "SEPET BOŞ",
    emptyTitle: "Ödeme için önce sepetini doldur.",
    free: "Ücretsiz",
    loadingLabel: "ÖDEME YÜKLENİYOR",
    loadingTitle: "Sepet bilgileri hazırlanıyor.",
    neighborhood: "Mahalle",
    orderCreateError: "Sipariş oluşturulamadı. Lütfen tekrar dene.",
    orderSummary: "Sipariş Özeti",
    payment: "Ödeme",
    recipientName: "Alıcı Ad Soyad",
    recipientPhone: "Alıcı Telefon",
    secure: "Güvenli SSL Şifreli İşlem",
    shipping: "Kargo",
    subtotal: "Ara Toplam",
    total: "Toplam",
    unit: "adet",
  },
  en: {
    addressLine: "Full Address",
    approvals: "Approvals",
    backToShop: "Return to Shop",
    cardName: "Cardholder Name",
    cardNumber: "Card Number",
    checkoutSubmit: "Complete Order",
    city: "City",
    coupon: "Coupon",
    customerName: "Full Name",
    customerPhone: "Phone",
    deliveryDate: "Delivery Date",
    deliveryInfo: "Delivery Details",
    deliverySlot: "Time Slot",
    district: "District",
    emptyLabel: "CART EMPTY",
    emptyTitle: "Fill your cart before checkout.",
    free: "Free",
    loadingLabel: "PAYMENT LOADING",
    loadingTitle: "Preparing cart details.",
    neighborhood: "Neighborhood",
    orderCreateError: "Order could not be created. Please try again.",
    orderSummary: "Order Summary",
    payment: "Payment",
    recipientName: "Recipient Full Name",
    recipientPhone: "Recipient Phone",
    secure: "Secure SSL Encrypted Transaction",
    shipping: "Shipping",
    subtotal: "Subtotal",
    total: "Total",
    unit: "pcs",
  },
} as const;

export function PaymentCheckoutView({ locale, serifClassName }: PaymentCheckoutViewProps) {
  const t = copy[locale];
  const router = useRouter();
  const { cart, hydrated, recordOrder } = useStore();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: "Istanbul",
      district: "Kadikoy",
      neighborhood: "Caddebostan",
      deliverySlot: "12:00 - 15:00",
      paymentMethod: "CARD",
      acceptDistanceSales: false,
      readPrivacyPolicy: false,
      readReturnPolicy: false,
    },
  });

  const items = cart
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((entry): entry is { item: (typeof cart)[number]; product: NonNullable<ReturnType<typeof getProductById>> } => Boolean(entry.product));
  const localizedItems = items.map(({ item, product }) => ({ item, product: getLocalizedProduct(product, locale) }));
  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 1750 ? 0 : 90;
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const coupon = coupons.find((entry) => entry.code === couponCode);
  const discount =
    coupon && subtotal >= coupon.minOrderAmount
      ? coupon.type === "PERCENT"
        ? Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscountAmount ?? Infinity)
        : coupon.value
      : 0;
  const total = subtotal - discount + deliveryFee;

  if (!hydrated) {
    return (
      <div className="py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{t.loadingLabel}</p>
        <h1 className={`mt-4 text-4xl text-[#e5e2e1] ${serifClassName}`}>{t.loadingTitle}</h1>
      </div>
    );
  }

  if (localizedItems.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{t.emptyLabel}</p>
        <h1 className={`mt-4 text-4xl text-[#e5e2e1] ${serifClassName}`}>{t.emptyTitle}</h1>
        <div className="mt-8">
          <Link
            className="inline-flex rounded-full bg-[#f2ca50] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#3c2f00]"
            href="/magaza"
          >
            {t.backToShop}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
      <form
        id="payment-checkout-form"
        className="space-y-16 lg:col-span-7"
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitError(null);

          const response = await fetch("/api/orders", {
            body: JSON.stringify({
              ...values,
              items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                variantId: item.variantId,
                note: item.note,
                selectedOptions: item.selectedOptions,
              })),
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          });

          const result = (await response.json().catch(() => null)) as
            | { grandTotal?: number; message?: string; orderNumber?: string }
            | null;

          if (!response.ok || !result?.orderNumber) {
            setSubmitError(result?.message ?? t.orderCreateError);
            return;
          }

          const now = new Date().toISOString();
          const fallbackOrder: Order = {
            id: result.orderNumber,
            orderNumber: result.orderNumber,
            status: "PENDING",
            paymentStatus: "UNPAID",
            paymentMethod: values.paymentMethod,
            subtotal,
            discountTotal: discount,
            deliveryFee,
            grandTotal: result.grandTotal ?? total,
            customerName: values.customerName,
            customerPhone: values.customerPhone,
            customerEmail: values.customerEmail,
            recipientName: values.recipientName,
            recipientPhone: values.recipientPhone,
            deliveryDate: values.deliveryDate,
            deliverySlot: values.deliverySlot,
            cardMessage: values.cardMessage,
            note: values.note,
            addressSnapshotJson: JSON.stringify({
              city: values.city,
              district: values.district,
              neighborhood: values.neighborhood,
              addressLine: values.addressLine,
            }),
            couponCode: values.couponCode,
            items: localizedItems.map(({ item, product }) => ({
              id: item.id,
              productId: item.productId,
              productName: product.name,
              quantity: item.quantity,
              totalPrice: item.unitPrice * item.quantity,
              unitPrice: item.unitPrice,
            })),
            createdAt: now,
            updatedAt: now,
          };

          recordOrder(fallbackOrder);
          router.push(`/siparis-basarili?orderNumber=${result.orderNumber}`);
        })}
      >
        <section>
          <h2 className={`mb-8 text-3xl tracking-tight text-[#e5e2e1] ${serifClassName}`}>
            {t.deliveryInfo}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.customerName}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("customerName")} type="text" />
            </label>
            <label>
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">E-mail</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("customerEmail")} type="email" />
            </label>
            <label>
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.customerPhone}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("customerPhone")} type="tel" />
            </label>
            <label className="md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.recipientName}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("recipientName")} type="text" />
            </label>
            <label className="md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.recipientPhone}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("recipientPhone")} type="tel" />
            </label>
            <label className="md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.addressLine}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("addressLine")} type="text" />
            </label>
            <label>
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.city}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("city")} type="text" />
            </label>
            <label>
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.district}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("district")} type="text" />
            </label>
            <label>
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.neighborhood}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("neighborhood")} type="text" />
            </label>
            <label>
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.deliveryDate}</span>
              <input className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("deliveryDate")} type="date" />
            </label>
            <label>
              <span className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.deliverySlot}</span>
              <select className="ghost-border w-full rounded-md bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" {...form.register("deliverySlot")}>
                <option value="09:00 - 12:00">09:00 - 12:00</option>
                <option value="12:00 - 15:00">12:00 - 15:00</option>
                <option value="15:00 - 18:00">15:00 - 18:00</option>
              </select>
            </label>
          </div>
        </section>

        <section>
          <div className="mb-8 flex items-end justify-between">
            <h2 className={`text-3xl tracking-tight text-[#e5e2e1] ${serifClassName}`}>{t.payment}</h2>
            <div className="flex gap-3 pb-1">
              <CreditCard className="h-5 w-5 text-neutral-500" />
              <Wallet className="h-5 w-5 text-neutral-500" />
            </div>
          </div>
          <div className="rounded-xl border border-[#4d46351a] bg-[#0e0e0e] p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.cardName}</label>
                <input className="ghost-border w-full rounded-md border-[#f2ca5033] bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" type="text" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">{t.cardNumber}</label>
                <input className="ghost-border w-full rounded-md border-[#f2ca5033] bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">EXP</label>
                  <input className="ghost-border w-full rounded-md border-[#f2ca5033] bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" type="text" />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">CVV</label>
                  <input className="ghost-border w-full rounded-md border-[#f2ca5033] bg-[#353534] px-4 py-3 text-[#e5e2e1] focus:outline-none" type="password" />
                </div>
              </div>
              <input {...form.register("paymentMethod")} type="hidden" value="CARD" />
            </div>
          </div>
        </section>

        {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}

        <section>
          <h2 className={`mb-6 text-3xl tracking-tight text-[#e5e2e1] ${serifClassName}`}>
            {t.approvals}
          </h2>
          <CheckoutConsentFields
            distanceSalesInputProps={form.register("acceptDistanceSales")}
            locale={locale}
            privacyInputProps={form.register("readPrivacyPolicy")}
            returnPolicyInputProps={form.register("readReturnPolicy")}
            variant="dark"
          />
          <div className="mt-4 space-y-2 text-sm text-red-400">
            {form.formState.errors.acceptDistanceSales ? (
              <p>{form.formState.errors.acceptDistanceSales.message}</p>
            ) : null}
            {form.formState.errors.readPrivacyPolicy ? (
              <p>{form.formState.errors.readPrivacyPolicy.message}</p>
            ) : null}
            {form.formState.errors.readReturnPolicy ? (
              <p>{form.formState.errors.readReturnPolicy.message}</p>
            ) : null}
          </div>
        </section>
      </form>

      <aside className="lg:col-span-5">
        <div className="sticky top-32 rounded-2xl bg-[#1c1b1b] p-8 lg:p-12">
          <h3 className={`mb-10 border-b border-[#4d46351a] pb-6 text-2xl tracking-tight text-[#e5e2e1] ${serifClassName}`}>
            {t.orderSummary}
          </h3>

          <div className="mb-10 space-y-8">
            {localizedItems.map(({ item, product }) => (
              <div className="flex items-start gap-6" key={item.id}>
                <div className="h-32 w-24 overflow-hidden rounded-lg bg-[#201f1f]">
                  <Image alt={product.name} className="h-full w-full object-cover" height={128} src={product.images[0]?.imageUrl} unoptimized width={96} />
                </div>
                <div className="flex-1">
                  <h4 className={`${serifClassName} text-lg leading-snug`}>{product.name}</h4>
                  <p className="mt-1 text-xs uppercase tracking-widest text-neutral-500">{item.quantity} {t.unit}</p>
                  <p className={`mt-4 text-[#f2ca50] ${serifClassName}`}>{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-[#4d46351a] pt-8 text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>{t.subtotal}</span>
              <span className="text-[#e5e2e1]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>{t.shipping}</span>
              <span className="text-[#e5e2e1]">{deliveryFee === 0 ? t.free : formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>{t.coupon}</span>
              <span className="text-[#e5e2e1]">{discount ? `-${formatPrice(discount)}` : "-"}</span>
            </div>
            <div className="flex items-end justify-between pt-6">
              <span className={`text-xl text-[#e5e2e1] ${serifClassName}`}>{t.total}</span>
              <span className={`text-3xl text-[#f2ca50] ${serifClassName}`}>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            form="payment-checkout-form"
            className="mt-10 w-full rounded-md bg-[#f2ca50] py-5 text-sm font-bold uppercase tracking-[0.2em] text-[#3c2f00] transition-all duration-300 hover:bg-[#d4af37]"
            type="submit"
          >
            {t.checkoutSubmit}
          </button>
          <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-neutral-500">
            {t.secure}
          </p>
        </div>
      </aside>
    </div>
  );
}
