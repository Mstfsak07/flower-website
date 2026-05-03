"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { Locale } from "@/lib/locale";

const copy = {
  tr: {
    home: "Ana Sayfaya Dön",
    label: "Sipariş Başarılı",
    orderNumber: "Sipariş numarası",
    pending: "oluşturuluyor",
    title: "Siparişin alındı ve hazırlama sürecine girdi.",
    track: "Siparişi Takip Et",
  },
  en: {
    home: "Back to Home",
    label: "Order Successful",
    orderNumber: "Order number",
    pending: "being created",
    title: "Your order has been received and entered the preparation process.",
    track: "Track Order",
  },
} as const;

export function OrderSuccessView({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const t = copy[locale];

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="panel p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          {t.label}
        </p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">{t.title}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          {t.orderNumber}: <strong>{orderNumber ?? t.pending}</strong>
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
            href="/siparis-takip"
          >
            {t.track}
          </Link>
          <Link
            className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            href="/"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
