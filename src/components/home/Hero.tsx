import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/locale";

const copy = {
  tr: {
    title1: "Doğanın",
    title2: "Canlı Enerjisini",
    title3: "Her Çiçekte Hissettiriyoruz.",
    body: "Seçkin zevkler için kurate edilmiş botanik aranjmanlar. Sezonluk koleksiyonlarımızla editorial bir deneyim yaşayın.",
    cta: "Aranjmanları Keşfet",
    badge: "Şimdi Mevcut",
    productName: '"Pastel Gül Seçkisi"',
  },
  en: {
    title1: "Cultivating",
    title2: "Spirited Energy",
    title3: "in Every Bloom.",
    body: "Bespoke botanical arrangements curated for the modern aesthetic. Experience editorial fluidity with our seasonal collections.",
    cta: "Shop Arrangements",
    badge: "Available Now",
    productName: '"Pastel Rose Edit"',
  },
} as const;

type HeroProps = { locale: Locale };

export function Hero({ locale }: HeroProps) {
  const t = copy[locale];

  return (
    <section
      style={{
        backgroundColor: "#fcf9f4",
        minHeight: "100vh",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section-level warm blobs */}
      <div style={{
        position: "absolute", top: "-5%", right: "-8%",
        width: "45vw", height: "45vw",
        backgroundColor: "#ff9248",
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        opacity: 0.12, filter: "blur(80px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "0", left: "-5%",
        width: "35vw", height: "35vw",
        backgroundColor: "#448064",
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        opacity: 0.10, filter: "blur(80px)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "1400px", margin: "0 auto",
        padding: "0 3rem",
        display: "flex", flexDirection: "row",
        alignItems: "center", gap: "4rem",
        flexWrap: "wrap",
      }}>
        {/* Left: text */}
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-5rem",
              left: "-8rem",
              width: "42rem",
              maxWidth: "120%",
              height: "34rem",
              background:
                "radial-gradient(circle at 18% 45%, rgba(246, 191, 205, 0.34) 0%, rgba(255, 214, 223, 0.24) 38%, rgba(255, 214, 223, 0.08) 58%, rgba(255, 214, 223, 0) 78%)",
              filter: "blur(42px)",
              opacity: 1,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <h1 style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#1c1c19",
            margin: 0,
            position: "relative",
            zIndex: 1,
          }}>
            {t.title1}
            <br />
            <span style={{ color: "#aa2e28", fontStyle: "italic" }}>{t.title2}</span>
            <br />
            {t.title3}
          </h1>

          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "#59413e",
            maxWidth: "32rem",
            margin: 0,
            position: "relative",
            zIndex: 1,
          }}>
            {t.body}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center", paddingTop: "0.5rem", position: "relative", zIndex: 1 }}>
            <Link
              href="/magaza"
              className="btn-primary"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "1rem 2rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, fontSize: "1rem",
                borderRadius: "9999px",
                textDecoration: "none",
              }}
            >
              {t.cta}
            </Link>
          </div>
        </div>

        {/* Right: hero image */}
        <div
          style={{
            flex: 1,
            minWidth: "280px",
            position: "relative",
            height: "clamp(400px, 58vw, 780px)",
            transform: "translateY(-1rem)",
          }}
        >
          {/* Decorative blur behind image */}
          <div style={{
            position: "absolute", bottom: "-2.5rem", left: "-2.5rem",
            width: "12rem", height: "12rem",
            backgroundColor: "#fcf9f4",
            borderRadius: "50%",
            filter: "blur(2rem)",
            opacity: 0.6,
            pointerEvents: "none",
          }} />

          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "4rem",
            overflow: "hidden",
            boxShadow: "0 20px 60px -15px rgba(42,103,76,0.18)",
            backgroundColor: "#e5e2dd",
          }}>
            <Image
              src="/products/rose-pastel.jpg"
              alt="Pastel pembe ve krem güllerden oluşan premium buket"
              fill
              priority
              className="object-cover object-center"
              style={{ transition: "transform 1s ease" }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(170,46,40,0.12) 0%, transparent 40%)",
            }} />
          </div>

          {/* Floating badge */}
          <div style={{
            position: "absolute", bottom: "-2rem", left: "-2rem", zIndex: 10,
            padding: "1.25rem 1.5rem",
            borderRadius: "1.75rem",
            background: "rgba(252,249,244,0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(28,28,25,0.10)",
          }}>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.65rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.22em",
              color: "#2a674c", margin: "0 0 0.25rem 0",
            }}>
              {t.badge}
            </p>
            <p style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "1.1rem", fontStyle: "italic",
              color: "#1c1c19", margin: 0,
            }}>
              {t.productName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
