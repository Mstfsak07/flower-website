"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useStore } from "@/components/providers/store-provider";

const schema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  phone: z.string().min(10),
  email: z.string().email(),
  city: z.string().min(2),
  district: z.string().min(2),
  eventType: z.string().min(2),
  eventDate: z.string().min(1),
  quantity: z.string().min(1),
  budget: z.string().min(1),
  details: z.string().min(10),
});

export function WholesaleFormView() {
  const { submitWholesaleInquiry } = useStore();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: "Istanbul",
    },
  });

  const packages = [
    {
      name: "Mekan Ritmi",
      description: "Kafe, restoran ve oteller icin haftalik taze cicek rotasi.",
      details: "Resepsiyon, masa ve vitrin icin 12-24 arasi duzenli aranjman.",
    },
    {
      name: "Etkinlik Gunu",
      description: "Nisan, dugun, davet ve lansman gunleri icin sahne ve masa setleri.",
      details: "Alan kesfi, renk paleti ve teslimat saati birlikte planlanir.",
    },
    {
      name: "Kurumsal Hediye",
      description: "Acikilis, ekip kutlamasi ve VIP gonderimler icin coklu siparis paketi.",
      details: "Teklif, kart notu ve teslim listesi ayni panelden netlestirilir.",
    },
  ];

  const processSteps = [
    {
      title: "Brief ve ihtiyac toplama",
      description: "Mekan tipi, renk dili, adet, teslim penceresi ve butce ayni gorusmede netlesir.",
    },
    {
      title: "Ornek set ve teklif",
      description: "Urun karmasi, birim/adet maliyeti ve lojistik plani kisa surede paylasilir.",
    },
    {
      title: "Hazirlama ve sahaya cikis",
      description: "Atolye planlamasi, paketleme ve teslimat ekibi etkinlik akisina gore organize edilir.",
    },
  ];

  const trustPoints = [
    "Kafe, otel ve ajans akislari icin tekrar eden siparis duzeni",
    "Teslimat saati, alan kurulumu ve son dakika adet revizyonu icin esnek operasyon",
    "Butceyi koruyan kademeli paket yapisi ve ayni gun teyit akisi",
  ];

  const references = [
    "Lokal kahve zinciri icin haftalik masaustu cicek yenileme",
    "80 kisilik nisanda giris, nikah masasi ve hediye buketi koordinasyonu",
    "Marka lansmaninda sahne onu ve VIP masa duzenlemeleri",
  ];

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
      <div className="space-y-6">
        <div className="panel overflow-hidden p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Toptan Teklif
          </p>
          <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">
            Etkinlik, mekan ve kurumsal alimlar icin daha net plan, daha hizli teklif
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
            Dugun, nisan, lansman, otel, kafe ve duzenli ofis ihtiyaclari icin adet, tarih,
            renk dili ve butceyi birlikte planlayan operasyon akisi kuruyoruz.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["24 saat", "ilk geri donus hedefi"],
              ["3 adim", "brief, teklif, teslim"],
              ["Esnek", "adet ve kurulum revizyonu"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[1.75rem] border border-white/60 bg-white/70 p-4">
                <div className="text-2xl font-semibold text-[var(--color-ink)]">{value}</div>
                <div className="mt-1 text-sm text-[var(--color-muted)]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {packages.map((item) => (
            <div key={item.name} className="panel p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Paket
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">{item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">{item.description}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{item.details}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
          <div className="panel p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Neden Biz
            </div>
            <div className="mt-4 space-y-3">
              {trustPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/80 px-4 py-4 text-sm leading-6 text-[var(--color-ink)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Referans Hissi
            </div>
            <div className="mt-4 space-y-3">
              {references.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] bg-[var(--color-card)] px-4 py-4 text-sm leading-6 text-[var(--color-ink)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Surec
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] bg-[var(--color-card)] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  Adim {index + 1}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <form
        className="panel grid gap-4 p-8"
        onSubmit={form.handleSubmit((values) => {
          submitWholesaleInquiry({
            ...values,
            quantity: Number(values.quantity),
            budget: Number(values.budget),
          });
          form.reset();
        })}
      >
        {[
          ["fullName", "Ad Soyad"],
          ["companyName", "Firma Adi"],
          ["phone", "Telefon"],
          ["email", "E-posta"],
          ["city", "Sehir"],
          ["district", "Ilce"],
          ["eventType", "Etkinlik Turu"],
          ["eventDate", "Tarih"],
          ["quantity", "Tahmini Adet"],
          ["budget", "Butce"],
        ].map(([name, label]) => (
          <label className="grid gap-2 text-sm font-medium" key={name}>
            {label}
            <input
              className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
              type={name === "eventDate" ? "date" : name === "quantity" || name === "budget" ? "number" : "text"}
              {...form.register(name as keyof z.infer<typeof schema>)}
            />
          </label>
        ))}
        <label className="grid gap-2 text-sm font-medium">
          Aciklama
          <textarea
            className="min-h-32 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 outline-none"
            {...form.register("details")}
          />
        </label>
        <div className="rounded-[1.5rem] border border-dashed border-[var(--color-line)] bg-[var(--color-card)] px-4 py-4 text-sm leading-6 text-[var(--color-muted)]">
          Teklifte genelde teslim tarihi, tahmini adet, renk yonu, kurulum ihtiyaci ve butce araligi
          yeterli olur. Sonraki adimda sizi arayip ayrintiyi netlestiririz.
        </div>
        <button
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white"
          type="submit"
        >
          Teklif Talebi Gonder
        </button>
      </form>
    </section>
  );
}
