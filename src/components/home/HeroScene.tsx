"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

export type HeroSceneProps = {
  eyebrow: string;
  brand: string;
  tagline: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  featured: {
    name: string;
    price: string;
    href: string;
    imageUrl: string;
    imageAlt: string;
    badge: string;
    viewLabel: string;
  };
  categories: { name: string; href: string; imageUrl: string }[];
  categoriesLabel: string;
};

const petals = [
  { left: "6%", size: 14, dur: 17, delay: 0, drift: 90 },
  { left: "14%", size: 10, dur: 21, delay: 6, drift: -60 },
  { left: "23%", size: 16, dur: 19, delay: 3, drift: 110 },
  { left: "33%", size: 9, dur: 24, delay: 11, drift: -80 },
  { left: "42%", size: 12, dur: 18, delay: 8, drift: 70 },
  { left: "51%", size: 15, dur: 22, delay: 1, drift: -100 },
  { left: "60%", size: 10, dur: 20, delay: 13, drift: 85 },
  { left: "68%", size: 13, dur: 23, delay: 5, drift: -70 },
  { left: "76%", size: 17, dur: 18, delay: 9, drift: 120 },
  { left: "84%", size: 11, dur: 25, delay: 2, drift: -90 },
  { left: "91%", size: 14, dur: 20, delay: 12, drift: 60 },
  { left: "97%", size: 9, dur: 22, delay: 7, drift: -50 },
] as const;

const serifFont = { fontFamily: "var(--font-display), 'Noto Serif', serif" } as const;

export function HeroScene({
  eyebrow,
  brand,
  tagline,
  subtitle,
  primaryCta,
  secondaryCta,
  featured,
  categories,
  categoriesLabel,
}: HeroSceneProps) {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#2a1646] text-white">
      <div className="hero-zoom absolute inset-0 -z-20">
        <Image
          alt=""
          className="object-cover object-[50%_38%]"
          fill
          priority
          sizes="100vw"
          src="/hero/hero-bg.png"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(24,10,44,0.38)_0%,rgba(24,10,44,0)_28%,rgba(24,10,44,0)_55%,rgba(24,10,44,0.6)_100%)]" />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {petals.map((petal, index) => (
          <span
            className="hero-petal"
            key={index}
            style={
              {
                "--left": petal.left,
                "--size": `${petal.size}px`,
                "--dur": `${petal.dur}s`,
                "--delay": `-${petal.delay}s`,
                "--drift": `${petal.drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 pb-6 pt-28 sm:px-6 lg:px-8">
        <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)_minmax(0,19rem)]">
          <Reveal y={22}>
            <div className="hero-glass rounded-[2.5rem] p-7 sm:p-10">
              <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#ffc2cd]">
                <span className="size-2 rounded-full bg-[#ff5d7a] shadow-[0_0_14px_#ff5d7a]" />
                {eyebrow}
              </div>
              <h1
                className="mt-5 text-5xl leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl"
                style={serifFont}
              >
                {brand}
              </h1>
              <p
                className="mt-3 text-2xl italic leading-snug text-[#ffd0d9] sm:text-[1.7rem]"
                style={serifFont}
              >
                {tagline}
              </p>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85">{subtitle}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#3a1a52] shadow-[0_14px_40px_-12px_rgba(255,255,255,0.55)] transition hover:scale-[1.03] active:scale-[0.98]"
                  href={primaryCta.href}
                >
                  {primaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  className="text-sm font-semibold text-white/90 underline decoration-white/40 underline-offset-[6px] transition hover:text-white hover:decoration-white"
                  href={secondaryCta.href}
                >
                  {secondaryCta.label}
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="hidden lg:block" />

          <Reveal className="hidden lg:block" delay={0.2} y={26}>
            <div className="hero-float">
              <Link
                className="hero-glass group block rounded-[2.25rem] p-5 transition hover:border-white/50"
                href={featured.href}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-white/10">
                  <Image
                    alt={featured.imageAlt}
                    className="object-cover transition duration-700 group-hover:scale-105"
                    fill
                    sizes="304px"
                    src={featured.imageUrl}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#2a1646]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ffd0d9] backdrop-blur-md">
                    {featured.badge}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-lg text-white" style={serifFont}>
                      {featured.name}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[#ffc2cd]">{featured.price}</div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#3a1a52] transition group-hover:bg-white">
                    {featured.viewLabel}
                    <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3} y={20}>
          <nav
            aria-label={categoriesLabel}
            className="hero-glass mt-4 overflow-hidden rounded-[2rem] px-3 py-4 sm:px-6"
          >
            <ul className="flex snap-x gap-3 overflow-x-auto pb-1 sm:justify-center sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((category) => (
                <li className="shrink-0 snap-start" key={category.href}>
                  <Link
                    className="group flex w-24 flex-col items-center gap-2 text-center sm:w-28"
                    href={category.href}
                  >
                    <span className="relative size-16 overflow-hidden rounded-full ring-2 ring-white/35 transition duration-300 group-hover:scale-110 group-hover:ring-white/80 sm:size-[4.5rem]">
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="72px"
                        src={category.imageUrl}
                      />
                    </span>
                    <span className="text-xs font-semibold leading-tight text-white/90 group-hover:text-white">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
