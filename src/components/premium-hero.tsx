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
  const leadSlide = heroSlides[0];
  const featureSlide = heroSlides[1];

  return (
    <section className="scene-shell mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="ambient-mesh pointer-events-none absolute inset-x-4 top-0 -z-10 h-[34rem] rounded-[3rem] opacity-60 sm:inset-x-6 lg:inset-x-8" />
      <div className="grid gap-8 lg:grid-cols-[1.04fr_.96fr]">
        <Reveal className="floating-surface relative overflow-hidden rounded-[2.75rem] p-8 sm:p-12" y={18}>
          <div className="soft-orb left-[-3rem] top-[-2rem] h-56 w-56 bg-[rgba(196,91,109,.22)]" />
          <div className="soft-orb right-[5%] top-[8%] h-40 w-40 bg-[rgba(208,192,220,.45)]" />
          <div className="soft-orb bottom-[-2rem] right-[-2rem] h-64 w-64 bg-[rgba(107,138,103,.16)]" />

          <div className="relative space-y-8">
          <Reveal delay={0.05}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/56 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)] backdrop-blur-md shadow-sm">
              <Sparkles className="size-3.5" />
              Spatial Floral Collection
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              <div className="editorial-label text-[var(--color-muted)]">Immersive gifting experience</div>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.03em] text-[var(--color-ink)] sm:text-6xl md:text-7xl">
                Floral jestleri sahne gibi hissettiren premium bir vitrin.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
                {leadSlide.subtitle} Katmanli yuzeyler, yumusak isik izleri ve atelier cikisli
                detay diliyle siparis deneyimini katalogdan sahneye tasiyoruz.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-8 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/5"
                href={leadSlide.ctaUrl}
              >
                {leadSlide.ctaText}
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
              ["Ayni Gun Akis", "15:00 oncesi siparislerde hizli dispatch"],
              ["Curated Styling", "Kurdele, kart notu ve ton secimi"],
              ["Spatial Packaging", "Derinlik hissini koruyan premium sunum"],
            ].map(([title, subtitle], index) => (
              <Reveal className="floating-surface rounded-[1.6rem] p-5 transition hover:-translate-y-1" delay={0.18 + index * 0.05} key={title}>
                <div className="text-sm font-semibold text-[var(--color-ink)]">{title}</div>
                <div className="mt-1.5 text-xs text-[var(--color-muted)] leading-relaxed">{subtitle}</div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="grid gap-3 rounded-[1.8rem] border border-white/55 bg-[rgba(255,255,255,0.42)] p-5 backdrop-blur-xl sm:grid-cols-[1.1fr_.9fr]">
              <div>
                <div className="editorial-label text-[var(--color-accent)]">Spatial promise</div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Hero, kart ve checkout boyunca tek bir depth dili kullaniyoruz: on planda
                  floating surface, orta planda floral imagery, arka planda diffuse glow.
                </p>
              </div>
              <div className="grid gap-2 text-sm text-[var(--color-muted)]">
                <div className="rounded-[1.2rem] bg-white/70 px-4 py-3">
                  3 katmanli visual hierarchy
                </div>
                <div className="rounded-[1.2rem] bg-white/70 px-4 py-3">
                  Reduced motion uyumlu spatial motion
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        </Reveal>

        <div className="grid gap-6">
          <TiltCard className="spotlight-ring relative min-h-[24rem] overflow-hidden rounded-[2.8rem] border border-white/45 p-8 text-white shadow-[var(--depth-shadow-strong)]">
          <motion.div
            animate={
              reduceMotion || !parallaxEnabled
                ? { scale: 1, y: 0 }
                : { scale: [1, 1.06, 1], y: [0, -10, 0] }
            }
            className="absolute inset-0 cinematic-image bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(160deg,rgba(28,16,22,.12),rgba(28,16,22,.68)),url(${featureSlide.imageUrl})`,
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
              Atmosfer Sahnesi
            </div>
            <div>
              <div className="mb-3 editorial-label text-white/68">Foreground / midground / glow</div>
              <h2 className="max-w-sm font-serif text-4xl leading-tight text-white drop-shadow-sm sm:text-[2.8rem]">
                {featureSlide.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/88 drop-shadow-sm">
                {featureSlide.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white/90 active:scale-[0.98] shadow-lg"
                  href={featureSlide.ctaUrl}
                >
                  {featureSlide.ctaText}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
          </TiltCard>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Foreground Focus",
                text: "Gorseller kutu icinde degil, cam yuzeyin icinden disari tasan obje gibi davranir.",
              },
              {
                title: "Diffused Glow",
                text: "Bolumler arasi isik izi ve blur katmanlari tek bir atmosfer sistemi kurar.",
              },
            ].map((item, index) => (
              <Reveal
                className="floating-surface rounded-[2rem] p-6 transition hover:-translate-y-1"
                delay={0.12 + index * 0.06}
                key={item.title}
              >
                <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
