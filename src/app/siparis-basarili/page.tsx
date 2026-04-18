"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="panel p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Siparis Basarili
        </p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">
          Siparisin alindi ve hazirlama surecine girdi.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          Siparis numarasi: <strong>{orderNumber ?? "olusturuluyor"}</strong>
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
            href="/siparis-takip"
          >
            Siparisi Takip Et
          </Link>
          <Link
            className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            href="/"
          >
            Ana Sayfaya Don
          </Link>
        </div>
      </div>
    </section>
  );
}
