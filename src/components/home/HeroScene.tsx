"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Mouse } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { Reveal } from "@/components/motion/reveal";

export type HeroSceneProps = {
  eyebrow: string;
  brand: string;
  tagline: string;
  subtitle: string;
  scrollLabel: string;
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

const roseMask = "linear-gradient(to bottom, #000 70%, transparent 84%)";

function SlabLayers({ sheenX }: { sheenX: MotionValue<number> }) {
  return (
    <>
      <span aria-hidden className="hero-slab-back" />
      <span aria-hidden className="hero-slab-glass">
        <motion.span className="hero-slab-sheen" style={{ x: sheenX }} />
      </span>
    </>
  );
}

export function HeroScene({
  eyebrow,
  brand,
  tagline,
  subtitle,
  scrollLabel,
  primaryCta,
  secondaryCta,
  featured,
  categories,
  categoriesLabel,
}: HeroSceneProps) {
  const reduceMotion = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const motionEnabled = motionOverride ?? !reduceMotion;
  // desktop: statik 3D egim ve derinlik. tiltEnabled: ek olarak fareyi takip eden hareket.
  const tiltEnabled = motionEnabled;
  const stripRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fare konumu: -1 ile 1 arasi. Yay ile yumusatilir.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Katmanlar: uzak olan az, yakin olan cok hareket eder.
  const bgX = useTransform(sx, (v) => v * -14);
  const bgY = useTransform(sy, (v) => v * -9);
  const roseX = useTransform(sx, (v) => v * -22);
  const roseY = useTransform(sy, (v) => v * -14);
  const roseRotY = useTransform(sx, (v) => v * 8);
  const roseRotX = useTransform(sy, (v) => v * -5);
  const fgSlowX = useTransform(sx, (v) => v * -40);
  const fgSlowY = useTransform(sy, (v) => v * -24);
  const fgFastX = useTransform(sx, (v) => v * -66);
  const fgFastY = useTransform(sy, (v) => v * -40);

  // Cam paneller: taban egimi + fareye tepki.
  const leftRotY = useTransform(sx, (v) => 14 + v * 6);
  const leftRotX = useTransform(sy, (v) => v * -5);
  const leftX = useTransform(sx, (v) => v * -10);
  const rightRotY = useTransform(sx, (v) => -16 + v * 6);
  const rightRotX = useTransform(sy, (v) => v * -5);
  const rightX = useTransform(sx, (v) => v * -16);
  const stripRotX = useTransform(sy, (v) => 9 + v * -3);
  const stripRotY = useTransform(sx, (v) => v * 4);
  const sheenX = useTransform(sx, (v) => v * -110);

  // Dinleyici pencerede: fare ustteki sabit menunun uzerine gelse de takip surer.
  useEffect(() => {
    if (!tiltEnabled) {
      return;
    }
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) {
        return;
      }
      mx.set(clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2));
      my.set(clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2));
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      mx.set(0);
      my.set(0);
    };
  }, [tiltEnabled, mx, my]);
  const scrollStrip = (direction: 1 | -1) => {
    stripRef.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight - 40, behavior: "smooth" });
  };

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#2a1646] text-white"
      data-hero-motion={motionOverride === null ? undefined : motionEnabled ? "on" : "off"}
      ref={sectionRef}
    >
      <button
        type="button"
        aria-label="Sahne animasyonları"
        aria-pressed={motionEnabled}
        onClick={() => setMotionOverride(!motionEnabled)}
        className="absolute right-4 top-24 z-20 rounded-full border border-white/40 bg-[#2a1646]/80 px-3 py-2 text-xs text-white backdrop-blur-md"
      >
        {motionEnabled ? "Animasyonu durdur" : "Animasyonu aç"}
      </button>
      {/* Sahne: arka plan ve gul ayni kutuda, boylece hizalari her ekranda korunur */}
      <div className="absolute inset-0 -z-30 [container-type:size]">
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "38%",
            width: "calc(max(100cqw, 100cqh * 1.77685) * 1.06)",
            aspectRatio: "1672 / 941",
            transform: "translate(-50%, -38%)",
          }}
        >
          <div className="hero-zoom absolute inset-0">
            <motion.div
              className="absolute inset-0"
              style={tiltEnabled ? { x: bgX, y: bgY } : undefined}
            >
              <Image
                alt=""
                className="object-cover"
                fill
                priority
                sizes="110vw"
                src="/hero/scene.png"
              />
            </motion.div>

            <motion.div
              className="absolute inset-0"
              style={tiltEnabled ? { x: roseX, y: roseY } : undefined}
            >
              <div
                aria-hidden
                className="hero-rose-glow absolute"
                style={{ left: "31%", top: "10%", width: "38%", aspectRatio: "1 / 1" }}
              />
              <motion.div
                className="absolute"
                style={{
                  left: "37.5%",
                  top: "16.4%",
                  width: "25%",
                  aspectRatio: "1 / 1",
                  ...(tiltEnabled
                    ? { transformPerspective: 900, rotateY: roseRotY, rotateX: roseRotX }
                    : {}),
                }}
              >
                <div
                  className="hero-rose-sway relative size-full"
                  style={{ maskImage: roseMask, WebkitMaskImage: roseMask }}
                >
                  <div className="hero-rose-wind relative size-full">
                    <Image
                      alt=""
                      className="object-contain"
                      fill
                      priority
                      sizes="30vw"
                      src="/hero/layers/rose.png"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(24,10,44,0.38)_0%,rgba(24,10,44,0)_28%,rgba(24,10,44,0)_55%,rgba(24,10,44,0.6)_100%)]" />

      {/* Yapraklar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
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

      {/* On plan: kameraya yakin, en cok hareket eden katmanlar */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={tiltEnabled ? { x: fgSlowX, y: fgSlowY } : undefined}
        >
          <Image
            alt=""
            className="absolute"
            height={1000}
            src="/hero/layers/cluster.png"
            style={{ left: "-4vw", bottom: "-7vw", width: "clamp(200px, 30vw, 620px)", height: "auto" }}
            width={1000}
          />
          <div className="hero-float absolute hidden lg:block" style={{ right: "1vw", top: "46%" }}>
            <Image
              alt=""
              height={750}
              src="/hero/layers/petals.png"
              style={{ width: "clamp(150px, 18vw, 380px)", height: "auto" }}
              width={1000}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={tiltEnabled ? { x: fgFastX, y: fgFastY } : undefined}
        >
          <Image
            alt=""
            className="absolute"
            height={750}
            priority
            src="/hero/layers/branches.png"
            style={{
              right: "-6vw",
              bottom: "-9vw",
              width: "clamp(240px, 40vw, 780px)",
              height: "auto",
              transform: "scaleX(-1)",
            }}
            width={1000}
          />
          <Image
            alt=""
            className="absolute hidden lg:block"
            height={1000}
            src="/hero/layers/bloom.png"
            style={{
              left: "-5vw",
              top: "46%",
              width: "clamp(110px, 14vw, 300px)",
              height: "auto",
              transform: "rotate(-24deg)",
            }}
            width={1000}
          />
        </motion.div>
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-4 pb-6 pt-28 sm:px-6 lg:px-8">
        <div className="grid flex-1 items-center gap-8 py-6 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)_minmax(0,19rem)]">
          <Reveal y={22}>
            <motion.div
              className="hero-slab hero-slab--a"
              style={
                desktop
                  ? {
                      transformPerspective: 1100,
                      rotateY: leftRotY,
                      rotateX: leftRotX,
                      rotateZ: -3,
                      x: leftX,
                    }
                  : undefined
              }
            >
              <SlabLayers sheenX={sheenX} />
              <div
                className="hero-slab-content hero-3d p-7 sm:p-10"
                style={desktop ? { transform: "translateZ(48px)" } : undefined}
              >
                <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#ffc2cd]">
                  <span className="size-2 rounded-full bg-[#ff5d7a] shadow-[0_0_14px_#ff5d7a]" />
                  {eyebrow}
                </div>
                <h1
                  className="mt-5 text-5xl leading-[1.02] tracking-[-0.02em] text-white [text-shadow:0_6px_24px_rgba(20,6,40,0.45)] sm:text-6xl"
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
                <div
                  className="hero-3d mt-8 flex flex-wrap items-center gap-4"
                  style={desktop ? { transform: "translateZ(22px)" } : undefined}
                >
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#3a1a52] shadow-[0_18px_40px_-10px_rgba(20,6,40,0.6),0_0_30px_-6px_rgba(255,255,255,0.5)] transition hover:scale-[1.03] active:scale-[0.98]"
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
            </motion.div>
          </Reveal>

          <div className="hidden lg:block" />

          <Reveal className="hidden lg:block" delay={0.2} y={26}>
            <div className="hero-float">
              <motion.div
                className="hero-3d"
                style={
                  desktop
                    ? {
                        transformPerspective: 1100,
                        rotateY: rightRotY,
                        rotateX: rightRotX,
                        rotateZ: 3.5,
                        x: rightX,
                      }
                    : undefined
                }
              >
                <Link className="hero-slab hero-slab--b group block" href={featured.href}>
                  <SlabLayers sheenX={sheenX} />
                  <div className="hero-slab-content hero-3d p-5">
                    <div
                      className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-white/10 shadow-[0_26px_40px_-14px_rgba(20,6,40,0.7)]"
                    >
                      <Image
                        alt={featured.imageAlt}
                        className="object-cover transition duration-700 group-hover:scale-105"
                        fill
                        priority
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
                        <div className="mt-1 text-sm font-semibold text-[#ffc2cd]">
                          {featured.price}
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#3a1a52] shadow-[0_12px_24px_-8px_rgba(20,6,40,0.6)] transition group-hover:bg-white">
                        {featured.viewLabel}
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </Reveal>
        </div>

        <div className="relative">
          <button
            aria-label={scrollLabel}
            className="absolute -top-16 left-2 hidden items-center gap-3 text-xs font-medium text-white/80 transition hover:text-white lg:flex"
            onClick={scrollDown}
            type="button"
          >
            <span className="grid size-9 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md">
              <Mouse className="size-4" />
            </span>
            {scrollLabel}
          </button>

          <Reveal delay={0.3} y={20}>
            <motion.nav
              aria-label={categoriesLabel}
              className="hero-slab hero-slab--strip mt-4"
              style={
                desktop
                  ? { transformPerspective: 1300, rotateX: stripRotX, rotateY: stripRotY }
                  : undefined
              }
            >
              <SlabLayers sheenX={sheenX} />
              <div
                className="hero-slab-content hero-3d px-12 py-4 sm:px-16"
                style={desktop ? { transform: "translateZ(30px)" } : undefined}
              >
                <button
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/25 sm:left-5"
                  onClick={() => scrollStrip(-1)}
                  type="button"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <ul
                  className="flex snap-x gap-3 overflow-x-auto pb-1 sm:justify-center sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  ref={stripRef}
                >
                  {categories.map((category) => (
                    <li className="shrink-0 snap-start" key={category.href}>
                      <Link
                        className="group flex w-24 flex-col items-center gap-2 text-center sm:w-28"
                        href={category.href}
                      >
                        <span className="relative size-16 overflow-hidden rounded-full ring-2 ring-white/35 shadow-[0_14px_24px_-8px_rgba(20,6,40,0.7)] transition duration-300 group-hover:scale-110 group-hover:ring-white/80 sm:size-[4.5rem]">
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
                <button
                  aria-label="Next"
                  className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/25 sm:right-5"
                  onClick={() => scrollStrip(1)}
                  type="button"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </motion.nav>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
