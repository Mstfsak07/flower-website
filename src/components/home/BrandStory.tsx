import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/locale";

const copy = {
  tr: {
    eyebrow: "Felsefemiz",
    title1: "Doğadan ilham alarak,",
    title2: "zarafet için tasarlandı.",
    text: "Iris Atalier, yüksek tasarım anlayışını sürdürülebilir dokunuşlarla her aranjmanda bir araya getirir. Her çiçek, her düzenleme bilinçli bir seçimdir.",
    cta: "Hikayemizi Oku",
  },
  en: {
    eyebrow: "Our Philosophy",
    title1: "Inspired by nature,",
    title2: "crafted for elegance.",
    text: "Iris Atalier brings high-end floral direction and sustainable practices into every arrangement. Every bloom, every decision is made with intention.",
    cta: "Read Our Story",
  },
} as const;

type BrandStoryProps = { locale: Locale };

export function BrandStory({ locale }: BrandStoryProps) {
  const t = copy[locale];

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, rgba(241,231,223,0.98) 0%, rgba(236,225,214,1) 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "6rem 3rem",
        borderTop: "1px solid rgba(224,191,187,0.35)",
      }}
    >
      {/* Background blob */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "50vw", height: "50vw",
        backgroundColor: "#448064",
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        opacity: 0.14, filter: "blur(90px)",
        pointerEvents: "none",
      }} />
      <div
        style={{
          position: "absolute",
          right: "-12%",
          bottom: "-18%",
          width: "42vw",
          height: "42vw",
          backgroundColor: "#ffbf92",
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          opacity: 0.18,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      <div style={{
        maxWidth: "1400px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "4rem", alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "4rem", overflow: "hidden", boxShadow: "0 20px 60px -15px rgba(42,103,76,0.15)" }}>
          <Image
            src="/products/lavender-bouquet.jpg"
            alt="Lavanta buketi hazırlık detayı"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Green decorative blob on image corner */}
          <div style={{
            position: "absolute", bottom: "-2rem", right: "-2rem",
            width: "8rem", height: "8rem",
            backgroundColor: "#2a674c",
            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
            opacity: 0.18, filter: "blur(1.5rem)",
            pointerEvents: "none",
          }} />
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.7rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.3em",
            color: "#2a674c",
          }}>
            {t.eyebrow}
          </span>

          <h2 style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            lineHeight: 1.2, color: "#1c1c19", margin: 0,
          }}>
            {t.title1}
            <br />
            <span style={{ color: "#aa2e28", fontStyle: "italic" }}>{t.title2}</span>
          </h2>

          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.05rem", lineHeight: 1.75,
            color: "#59413e", margin: 0, maxWidth: "36rem",
          }}>
            {t.text}
          </p>

          <Link
            href="/hakkimizda"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: "0.9rem",
              color: "#aa2e28", textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            {t.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
