"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, CheckCircle2, CreditCard, Lock, ShieldCheck, Truck } from "lucide-react";

import { CheckoutConsentFields } from "@/components/checkout-consent-fields";
import { useStore } from "@/components/providers/store-provider";
import { coupons, getProductById } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

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
  confirmRecipient: z.literal(true, {
    message: "Teslimat bilgilerini kontrol etmelisin.",
  }),
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

type CheckoutValidationResponse = {
  deliveryZone: {
    cutoffHour: number;
    fee: number;
    minDeliveryHours: number;
    name: string;
    sameDayAvailable: boolean;
  } | null;
  paymentOptions: Array<"CARD" | "BANK_TRANSFER" | "CASH_ON_DELIVERY">;
  supportsSameDay: boolean;
};

export function CheckoutPageView() {
  const router = useRouter();
  const { cart, hydrated, recordOrder } = useStore();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checkoutValidation, setCheckoutValidation] = useState<CheckoutValidationResponse | null>(null);
  const [validationLoading, setValidationLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: "Istanbul",
      district: "Kadikoy",
      neighborhood: "Caddebostan",
      deliverySlot: "12:00 - 15:00",
      paymentMethod: "CARD",
      confirmRecipient: true,
      acceptDistanceSales: false,
      readPrivacyPolicy: false,
      readReturnPolicy: false,
    },
  });

  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 1750 ? 0 : 90;
  const items = cart.map((item) => ({ item, product: getProductById(item.productId) })).filter(Boolean);
  const couponCode = useWatch({
    control: form.control,
    name: "couponCode",
  });
  const checkoutSnapshot = useWatch({
    control: form.control,
  });
  const coupon = coupons.find((entry) => entry.code === couponCode);
  const discount =
    coupon && subtotal >= coupon.minOrderAmount
      ? coupon.type === "PERCENT"
        ? Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscountAmount ?? Infinity)
        : coupon.value
      : 0;
  const total = subtotal - discount + deliveryFee;

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (
      !checkoutSnapshot?.customerName ||
      !checkoutSnapshot.customerPhone ||
      !checkoutSnapshot.customerEmail ||
      !checkoutSnapshot.recipientName ||
      !checkoutSnapshot.recipientPhone ||
      !checkoutSnapshot.city ||
      !checkoutSnapshot.district ||
      !checkoutSnapshot.neighborhood ||
      !checkoutSnapshot.addressLine ||
      !checkoutSnapshot.deliveryDate ||
      !checkoutSnapshot.deliverySlot ||
      !checkoutSnapshot.paymentMethod
    ) {
      const resetTimer = window.setTimeout(() => {
        setCheckoutValidation(null);
      }, 0);

      return () => {
        window.clearTimeout(resetTimer);
      };
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setValidationLoading(true);
      fetch("/api/checkout/validate", {
        body: JSON.stringify({
          ...checkoutSnapshot,
          cardMessage: checkoutSnapshot.cardMessage ?? "",
          couponCode: checkoutSnapshot.couponCode ?? "",
          note: checkoutSnapshot.note ?? "",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Teslimat kurallari alinmadi.");
          }

          return (await response.json()) as CheckoutValidationResponse;
        })
        .then((result) => {
          setCheckoutValidation(result);
          setSubmitError(null);
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) {
            return;
          }

          setCheckoutValidation(null);
          setSubmitError(error instanceof Error ? error.message : "Teslimat kurallari dogrulanamadi.");
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setValidationLoading(false);
          }
        });
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [checkoutSnapshot, hydrated]);

  if (!hydrated) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="panel p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Checkout yukleniyor
          </p>
          <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">Siparis adimi hazirlaniyor.</h1>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="panel p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">Checkout</p>
          <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)] sm:text-5xl">Odeme icin once sepetini hazirla.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            Bu adimda teslimat, alici bilgileri ve odeme tercihleri birlikte tamamlanir. Sepetinde urun olmadigi icin
            checkout acilamadi.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Ayni gun teslimat",
                copy: "Uygun bolgelerde hizli dagitim secenekleri checkout adiminda gosterilir.",
              },
              {
                icon: ShieldCheck,
                title: "Guvenli siparis akisi",
                copy: "Alici ve teslimat bilgileri onay kutulari ile netlestirilir.",
              },
              {
                icon: CreditCard,
                title: "Esnek odeme",
                copy: "Kart, havale veya kapida odeme secenekleri siparise gore secilebilir.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <div className="rounded-[1.5rem] bg-[var(--color-card)]/80 p-5" key={title}>
                <Icon className="size-5 text-[var(--color-accent)]" />
                <div className="mt-3 font-semibold text-[var(--color-ink)]">{title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
              href="/kategori/mini-buketler"
            >
              Koleksiyona Don
            </Link>
            <Link
              className="inline-flex rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-ink)]"
              href="/sepet"
            >
              Sepeti Gor
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_24rem] lg:px-8">
      <form
        className="panel grid gap-5 p-8"
        onSubmit={form.handleSubmit(async (values) => {
          setSubmitError(null);

          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
          });

          const result = (await response.json().catch(() => null)) as
            | {
                ok?: boolean;
                orderNumber?: string;
                grandTotal?: number;
                message?: string;
              }
            | null;

          if (!response.ok || !result?.orderNumber) {
            setSubmitError(result?.message ?? "Siparis olusturulamadi. Lutfen tekrar dene.");
            return;
          }

          const now = new Date().toISOString();
          const fallbackOrder: Order = {
            id: result.orderNumber,
            orderNumber: result.orderNumber,
            status: "PENDING",
            paymentStatus: values.paymentMethod === "CASH_ON_DELIVERY" ? "UNPAID" : "UNPAID",
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
            items: items
              .filter(({ product }) => Boolean(product))
              .map(({ item, product }) => ({
                id: item.id,
                productId: item.productId,
                productName: product?.name ?? "Urun",
                variantName: undefined,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.unitPrice * item.quantity,
                note: item.note,
                selectedOptionsJson: item.selectedOptions
                  ? JSON.stringify(item.selectedOptions)
                  : undefined,
              })),
            createdAt: now,
            updatedAt: now,
          };

          const trackResponse = await fetch(`/api/orders/${encodeURIComponent(result.orderNumber)}/track`);
          const canonicalOrder = trackResponse.ok
            ? ((await trackResponse.json()) as Order)
            : fallbackOrder;

          recordOrder(canonicalOrder);
          router.push(`/siparis-basarili?orderNumber=${result.orderNumber}`);
        })}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Checkout
          </p>
          <h1 className="mt-3 font-serif text-5xl text-[var(--color-ink)]">Siparisi tamamla</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Alici, teslimat ve odeme bilgilerini tek akista topla. Son kontrolden sonra siparisin dogrudan olusturulur.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["customerName", "Gonderen Ad Soyad"],
            ["customerPhone", "Gonderen Telefon"],
            ["customerEmail", "Gonderen E-posta"],
            ["recipientName", "Teslim Alici Ad Soyad"],
            ["recipientPhone", "Teslim Alici Telefon"],
            ["city", "Sehir"],
            ["district", "Ilce"],
            ["neighborhood", "Mahalle"],
          ].map(([name, label]) => (
            <label className="grid gap-2 text-sm font-medium" key={name}>
              {label}
              <input
                className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
                {...form.register(name as keyof FormValues)}
              />
            </label>
          ))}
        </div>

        <label className="grid gap-2 text-sm font-medium">
          Acik Adres
          <textarea
            className="min-h-28 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            {...form.register("addressLine")}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Teslimat Tarihi
            <input
              className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              type="date"
              {...form.register("deliveryDate")}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Saat Araligi
            <select
              className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              {...form.register("deliverySlot")}
            >
              <option>09:00 - 12:00</option>
              <option>12:00 - 15:00</option>
              <option>15:00 - 18:00</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Karta Not
            <textarea
              className="min-h-28 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              {...form.register("cardMessage")}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Siparis Notu
            <textarea
              className="min-h-28 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              {...form.register("note")}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Kupon
            <input
              className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              placeholder="HOSGELDIN10"
              {...form.register("couponCode")}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Odeme Yontemi
            <select
              className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              {...form.register("paymentMethod")}
            >
              <option value="CARD">Kart ile Odeme</option>
              <option value="BANK_TRANSFER">Havale / EFT</option>
              <option value="CASH_ON_DELIVERY">Kapida Odeme</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] bg-[var(--color-card)]/85 p-5 text-sm text-[var(--color-muted)]">
          <div className="flex gap-3">
            <Lock className="mt-0.5 size-4 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Teslimat oncesi kontrol</div>
              <div className="mt-1 leading-6">Kart notu, alici telefonu ve adres bilgileri ekip tarafindan gozden gecirilir.</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Truck className="mt-0.5 size-4 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Bolgeye gore zamanlama</div>
              <div className="mt-1 leading-6">
                Ayni gun dagitim icin teslimat saati secimi yogunluga ve bolgeye gore netlesebilir.
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] border border-[var(--color-line)] bg-white/80 p-5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Teslimat kurallari</div>
              <div className="mt-1 text-[var(--color-muted)]">
                Bolge, ayni gun uygunlugu ve cutoff saati siparis oncesi kontrol edilir.
              </div>
            </div>
            {validationLoading ? (
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Kontrol
              </span>
            ) : null}
          </div>
          {checkoutValidation?.deliveryZone ? (
            <div className="grid gap-2 text-[var(--color-muted)]">
              <div>
                <span className="font-semibold text-[var(--color-ink)]">{checkoutValidation.deliveryZone.name}</span>
                {" "}icin teslimat ucreti{" "}
                <span className="font-semibold text-[var(--color-ink)]">
                  {formatPrice(checkoutValidation.deliveryZone.fee)}
                </span>
                .
              </div>
              <div>
                Minimum hazirlama suresi {checkoutValidation.deliveryZone.minDeliveryHours} saat, ayni gun teslimat{" "}
                {checkoutValidation.supportsSameDay ? "aktif" : "kapali"}.
              </div>
              <div>
                Cutoff saati: {checkoutValidation.deliveryZone.cutoffHour}:00. Bu saatten sonraki siparisler bir sonraki planlamaya kayabilir.
              </div>
            </div>
          ) : (
            <div className="text-[var(--color-muted)]">
              Teslimat bolgesi dogrulanana kadar sehir, ilce ve alici alanlarini doldur.
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <label className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--color-line)] bg-white px-4 py-4 text-sm text-[var(--color-muted)]">
            <input className="mt-1 size-4" type="checkbox" {...form.register("confirmRecipient")} />
            <span>
              Alici bilgilerini ve teslimat adresini kontrol ettim. Gerekirse siparis oncesi iletisime gecilebilir.
            </span>
          </label>
          {form.formState.errors.confirmRecipient ? (
            <p className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="size-4" />
              {form.formState.errors.confirmRecipient.message}
            </p>
          ) : null}
          <CheckoutConsentFields
            distanceSalesInputProps={form.register("acceptDistanceSales")}
            privacyInputProps={form.register("readPrivacyPolicy")}
            returnPolicyInputProps={form.register("readReturnPolicy")}
          />
          {form.formState.errors.acceptDistanceSales ? (
            <p className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="size-4" />
              {form.formState.errors.acceptDistanceSales.message}
            </p>
          ) : null}
          {form.formState.errors.readPrivacyPolicy ? (
            <p className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="size-4" />
              {form.formState.errors.readPrivacyPolicy.message}
            </p>
          ) : null}
          {form.formState.errors.readReturnPolicy ? (
            <p className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="size-4" />
              {form.formState.errors.readReturnPolicy.message}
            </p>
          ) : null}
        </div>

        <button
          disabled={form.formState.isSubmitting || Boolean(checkoutValidation && !checkoutValidation.deliveryZone)}
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white"
          type="submit"
        >
          {form.formState.isSubmitting ? "Siparis Olusturuluyor" : "Siparisi Tamamla"}
        </button>
        {submitError ? (
          <p className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="size-4" />
            {submitError}
          </p>
        ) : null}
      </form>

      <aside className="panel h-fit space-y-5 p-6">
        <h2 className="font-serif text-3xl text-[var(--color-ink)]">Siparis Ozeti</h2>
        <div className="space-y-3 text-sm">
          {items.map(({ item, product }) =>
            product ? (
              <div className="rounded-[1.35rem] bg-white/70 p-4" key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[var(--color-ink)]">{product.name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      {item.quantity} adet
                    </div>
                  </div>
                  <span className="font-medium text-[var(--color-ink)]">{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-muted)]">
                  <span className="rounded-full bg-[var(--color-card)] px-3 py-1.5">
                    Hazirlama: {product.minPreparationHours} saat
                  </span>
                  {item.note?.trim() ? (
                    <span className="rounded-full bg-[var(--color-card)] px-3 py-1.5">Kart notu eklendi</span>
                  ) : null}
                </div>
              </div>
            ) : null,
          )}
        </div>
        <div className="space-y-2 rounded-[1.5rem] bg-[var(--color-card)] p-5 text-sm">
          <div className="flex justify-between">
            <span>Ara Toplam</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kupon</span>
            <span>{discount ? `-${formatPrice(discount)}` : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Teslimat</span>
            <span>{deliveryFee === 0 ? "Ucretsiz" : formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-[var(--color-ink)]">
            <span>Toplam</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="flex gap-3 rounded-[1.35rem] bg-white/70 p-4 text-[var(--color-muted)]">
            <CheckCircle2 className="mt-0.5 size-4 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Siparis sonrasi bilgilendirme</div>
              <div className="mt-1 leading-6">Siparis numarasi aninda olusturulur ve takip ekranindan izlenebilir.</div>
            </div>
          </div>
          <div className="flex gap-3 rounded-[1.35rem] bg-white/70 p-4 text-[var(--color-muted)]">
            <ShieldCheck className="mt-0.5 size-4 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Guvenli onay</div>
              <div className="mt-1 leading-6">Toplam ve urun verileri siparis aninda sunucuda yeniden dogrulanir.</div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
