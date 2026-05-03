"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getLocalizedProduct, getProductById } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Order } from "@/lib/types";
import { formatLocalizedDate, formatPrice } from "@/lib/utils";

const schema = z.object({
  orderNumber: z.string().min(3),
  contact: z.string().min(5),
});

const copy = {
  tr: {
    contact: "Telefon veya E-posta",
    created: "tarihinde oluşturuldu.",
    emptyDefault: "Demo sistemde örnek sipariş numarası olarak `CK-24041101` kullanabilirsin.",
    emptyResult: "Takip sonucu",
    emptyTitle: "Sipariş bilgisi burada görünecek.",
    found: "Sipariş Bulundu",
    notFound: "Sipariş bulunamadı.",
    orderNumber: "Sipariş Numarası",
    orderStatus: "Sipariş Durumu",
    paymentStatus: "Ödeme Durumu",
    searchTitle: "Numara ile sorgula",
    show: "Takibi Göster",
    submitting: "Sorgulanıyor",
    title: "Sipariş Takip",
    missing: (number: string) => `${number} için aktif bir sipariş kaydı bulunamadı.`,
  },
  en: {
    contact: "Phone or Email",
    created: "created on.",
    emptyDefault: "You can use `CK-24041101` as a sample order number in the demo system.",
    emptyResult: "Tracking result",
    emptyTitle: "Order details will appear here.",
    found: "Order Found",
    notFound: "Order not found.",
    orderNumber: "Order Number",
    orderStatus: "Order Status",
    paymentStatus: "Payment Status",
    searchTitle: "Search by number",
    show: "Show Tracking",
    submitting: "Searching",
    title: "Order Tracking",
    missing: (number: string) => `No active order record was found for ${number}.`,
  },
} as const;

export function OrderTrackView({ locale = "tr" }: { locale?: Locale }) {
  const t = copy[locale];
  const [resultOrderNumber, setResultOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[24rem_1fr] lg:px-8">
      <form
        className="panel h-fit space-y-4 p-6"
        onSubmit={form.handleSubmit(async (values) => {
          setResultOrderNumber(values.orderNumber);
          setLookupError(null);

          const query = new URLSearchParams({ contact: values.contact });
          const response = await fetch(
            `/api/orders/${encodeURIComponent(values.orderNumber)}/track?${query.toString()}`,
          );
          if (!response.ok) {
            const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
            setOrder(null);
            setLookupError(errorBody?.message ?? t.notFound);
            return;
          }

          const result = (await response.json()) as Order;
          setOrder(result);
        })}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          {t.title}
        </p>
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">{t.searchTitle}</h1>
        <label className="grid gap-2 text-sm font-medium">
          {t.orderNumber}
          <input
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            placeholder="CK-24041101"
            {...form.register("orderNumber")}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {t.contact}
          <input
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            placeholder="0532..."
            {...form.register("contact")}
          />
        </label>
        <button
          disabled={form.formState.isSubmitting}
          className="w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
          type="submit"
        >
          {form.formState.isSubmitting ? t.submitting : t.show}
        </button>
      </form>

      <div className="panel p-8">
        {order ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {t.found}
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">{order.orderNumber}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {formatLocalizedDate(order.createdAt, locale)} {t.created}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {t.orderStatus}
                </div>
                <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">{order.status}</div>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {t.paymentStatus}
                </div>
                <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                  {order.paymentStatus}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => {
                const product = getProductById(item.productId);
                const localizedProduct = product ? getLocalizedProduct(product, locale) : null;
                return (
                <div key={item.id} className="flex justify-between rounded-[1.5rem] border border-[var(--color-line)] p-4 text-sm">
                  <span>
                    {localizedProduct?.name ?? item.productName} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.totalPrice)}</span>
                </div>
              );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              {t.emptyResult}
            </p>
            <h2 className="font-serif text-4xl text-[var(--color-ink)]">{t.emptyTitle}</h2>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
              {lookupError ??
                (resultOrderNumber
                  ? t.missing(resultOrderNumber)
                  : t.emptyDefault)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
