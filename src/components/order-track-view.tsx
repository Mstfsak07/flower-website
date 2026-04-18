"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useStore } from "@/components/providers/store-provider";
import { formatDate, formatPrice } from "@/lib/utils";

const schema = z.object({
  orderNumber: z.string().min(3),
  contact: z.string().min(5),
});

export function OrderTrackView() {
  const { orders } = useStore();
  const [resultOrderNumber, setResultOrderNumber] = useState("");
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const order = useMemo(
    () =>
      orders.find(
        (entry) =>
          entry.orderNumber.toLocaleLowerCase("tr-TR") ===
          resultOrderNumber.toLocaleLowerCase("tr-TR"),
      ),
    [orders, resultOrderNumber],
  );

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[24rem_1fr] lg:px-8">
      <form
        className="panel h-fit space-y-4 p-6"
        onSubmit={form.handleSubmit((values) => setResultOrderNumber(values.orderNumber))}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Siparis Takip
        </p>
        <h1 className="font-serif text-4xl text-[var(--color-ink)]">Numara ile sorgula</h1>
        <label className="grid gap-2 text-sm font-medium">
          Siparis Numarasi
          <input
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            placeholder="CK-24041101"
            {...form.register("orderNumber")}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Telefon veya E-posta
          <input
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            placeholder="0532..."
            {...form.register("contact")}
          />
        </label>
        <button
          className="w-full rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
          type="submit"
        >
          Takibi Goster
        </button>
      </form>

      <div className="panel p-8">
        {order ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Siparis Bulundu
              </p>
              <h2 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">{order.orderNumber}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {formatDate(order.createdAt)} tarihinde olusturuldu.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Siparis Durumu
                </div>
                <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">{order.status}</div>
              </div>
              <div className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Odeme Durumu
                </div>
                <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                  {order.paymentStatus}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between rounded-[1.5rem] border border-[var(--color-line)] p-4 text-sm">
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Takip sonucu
            </p>
            <h2 className="font-serif text-4xl text-[var(--color-ink)]">Siparis bilgisi burada gorunecek.</h2>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
              Demo sistemde ornek siparis numarasi olarak `CK-24041101` kullanabilirsin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
