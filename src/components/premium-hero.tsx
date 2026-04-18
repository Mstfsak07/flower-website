"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Stars } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { heroSlides, visualExperienceConfigs } from "@/lib/data";

export function PremiumHero() {
  const reduceMotion = useReducedMotion();
  const parallaxEnabled = visualExperienceConfigs.some(
    (item) => item.key === "enableParallax" && item.value === "true",
  );

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-16">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-white/60 p-8 sm:p-12 glass-panel" y={18}>
        <div className="soft-orb left-[-3rem] top-[-2rem] h-48 w-48 bg-[rgba(196,91,109,.2)]" />
        <div className="soft-orb right-[5%] top-[8%] h-36 w-36 bg-[rgba(208,192,220,.4)]" />
        <div className="soft-orb bottom-[-2rem] right-[-2rem] h-56 w-56 bg-[rgba(107,138,103,.15)]" />

        <div className="relative space-y-8">
          <Reveal delay={0.05}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)] backdrop-blur-md shadow-sm">
              <Sparkles className="size-3.5" />
              Yeni Koleksiyon
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              <h1 className="max-w-3xl font-serif text-5xl leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-6xl md:text-7xl">
                Duygulariniza zarif bir dokunus.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
                Ozenle secilmis taze cicekler ve modern tasarim anlayisiyla, her aninizi unutulmaz kilacak essiz aranjmanlar.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/5"
                href="/kategori/mini-buketler"
              >
                Koleksiyonu Kesfet
                <ArrowRight className="size-4" />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/60 px-8 py-3.5 text-sm font-semibold text-[var(--color-ink)] backdrop-blur-md transition hover:bg-white/80 active:scale-[0.98]"
                href="/toptan"
              >
                Kurumsal Teklif Al
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {[
              ["Ayni Gun Teslimat", "15:00 oncesi siparislerde"],
              ["Ozel Tasarim", "Kisisellestirilmis notlar"],
              ["Premium Hizmet", "Ozenli ve guvenli paketleme"],
            ].map(([title, subtitle], index) => (
              <Reveal className="rounded-[1.6rem] border border-white/50 bg-white/40 p-5 backdrop-blur-md shadow-sm transition hover:bg-white/60" delay={0.18 + index * 0.05} key={title}>
                <div className="text-sm font-semibold text-[var(--color-ink)]">{title}</div>
                <div className="mt-1.5 text-xs text-[var(--color-muted)] leading-relaxed">{subtitle}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6">
        <TiltCard className="relative min-h-[22rem] overflow-hidden rounded-[2.5rem] border border-white/45 p-8 text-white shadow-2xl shadow-[var(--color-ink)]/5">
          <motion.div
            animate={
              reduceMotion || !parallaxEnabled
                ? { scale: 1, y: 0 }
                : { scale: [1, 1.05, 1], y: [0, -8, 0] }
            }
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(42,31,34,.1),rgba(42,31,34,.6)),url(${heroSlides[1].imageUrl})`,
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <div className="relative flex h-full flex-col justify-between">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
              <Stars className="size-3.5" />
              Imza Serisi
            </div>
            <div>
              <h2 className="max-w-sm font-serif text-4xl leading-tight text-white drop-shadow-sm">Gunun En Cok Tercih Edileni</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/90 drop-shadow-sm">Sevdiklerinizi mutlu etmenin en zarif yolu. Taze guller ve mevsim yesilliklerinin essiz uyumu.</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white/90 active:scale-[0.98] shadow-lg"
                  href={heroSlides[1].ctaUrl}
                >
                  Siparise Basla
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </TiltCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Taze ve Ozenli",
              text: "Siparisiniz uzerine ozenle hazirlanan, en taze mevsim cicekleri.",
            },
            {
              title: "Zarif Sunum",
              text: "Estetik detaylarla zenginlestirilmis, goz alici premium paketleme.",
            },
          ].map((item, index) => (
            <Reveal
              className="rounded-[2rem] border border-white/50 bg-white/40 p-6 backdrop-blur-md shadow-sm transition hover:bg-white/60"
              delay={0.12 + index * 0.06}
              key={item.title}
            >
              <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
