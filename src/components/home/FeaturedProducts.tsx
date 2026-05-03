import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/locale";

const copy = {
  tr: {
    eyebrow: "Öne Çıkan Ürünler",
    title: "Seçkin Aranjmanlar",
    card1: "Gün Doğumu",
    card2: "Yıldız Çiçeği Seçkisi",
    card3: "Kır Çiçekleri",
    badge1: "Canlı",
    badge2: "Pastel",
    badge3: "Botanik",
    addCart: "Sepete Ekle",
    favorite: "Favorilere ekle",
  },
  en: {
    eyebrow: "Featured Pieces",
    title: "Artful Arrangements",
    card1: "The Sunrise",
    card2: "The Dahlia Edit",
    card3: "The Wildflower",
    badge1: "Vivid",
    badge2: "Pastel",
    badge3: "Botanical",
    addCart: "Add to Cart",
    favorite: "Add to favorites",
  },
} as const;

type FeaturedProductsProps = { locale: Locale };

export function FeaturedProducts({ locale }: FeaturedProductsProps) {
  const t = copy[locale];

  const cards = [
    {
      image: "/products/rose-classic.jpg", name: t.card1, price: "₺450",
      href: "/urun/gul-buketi", badge: t.badge1,
      badgeBg: "#994700", badgeColor: "#ffffff",
      blobColor: "#448064", blobPos: { top: "-1rem", right: "-1rem" },
      offset: 0,
    },
    {
      image: "/products/rose-pastel.jpg", name: t.card2, price: "₺480",
      href: "/urun/pembe-gul-buketi", badge: t.badge2,
      badgeBg: "#2a674c", badgeColor: "#ffffff",
      blobColor: "#ff9248", blobPos: { bottom: "-1.5rem", left: "-1rem" },
      offset: 48,
    },
    {
      image: "/products/white-daisies.jpg", name: t.card3, price: "₺300",
      href: "/urun/papatya-buketi", badge: t.badge3,
      badgeBg: "#aa2e28", badgeColor: "#ffffff",
      blobColor: "#448064", blobPos: { top: "-1rem", left: "-0.5rem" },
      offset: 0,
    },
  ];

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, rgba(248,239,229,0.96) 0%, rgba(245,231,220,0.98) 100%)",
        position: "relative",
        overflow: "hidden",
        padding: "6rem 3rem",
        borderTop: "1px solid rgba(224,191,187,0.45)",
        borderBottom: "1px solid rgba(224,191,187,0.38)",
      }}
    >
      {/* Background blob */}
      <div style={{
        position: "absolute", bottom: "-5rem", right: "-5rem",
        width: "40vw", height: "40vw",
        backgroundColor: "#ff9248",
        borderRadius: "70% 30% 50% 50% / 30% 60% 40% 70%",
        opacity: 0.16, filter: "blur(70px)",
        pointerEvents: "none",
      }} />
      <div
        style={{
          position: "absolute",
          top: "-6rem",
          left: "-4rem",
          width: "34vw",
          height: "34vw",
          backgroundColor: "#ffd6bf",
          borderRadius: "60% 40% 30% 70% / 50% 30% 70% 50%",
          opacity: 0.24,
          filter: "blur(72px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.7rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.3em",
            color: "#2a674c",
            display: "block", marginBottom: "1rem",
          }}>
            {t.eyebrow}
          </span>
          <h2 style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "3.5rem", lineHeight: 1.1,
            color: "#aa2e28", margin: 0,
          }}>
            {t.title}
          </h2>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem 2rem" }}>
          {cards.map((card, i) => (
            <article
              key={card.name}
              style={{
                display: "flex", flexDirection: "column", gap: "1.5rem",
                position: "relative",
                marginTop: `${card.offset}px`,
              }}
            >
              {/* Per-card organic blob */}
              <div style={{
                position: "absolute",
                ...card.blobPos,
                width: "6rem", height: "6rem",
                backgroundColor: card.blobColor,
                borderRadius: i === 0 ? "60% 40% 30% 70% / 60% 30% 70% 40%"
                  : i === 1 ? "30% 70% 70% 30% / 30% 30% 70% 70%"
                  : "40% 60% 70% 30% / 40% 50% 60% 50%",
                opacity: 0.20,
                zIndex: 0,
                transition: "transform 0.5s",
                pointerEvents: "none",
              }} />

              {/* Image card */}
              <Link
                href={card.href}
                style={{
                  display: "block", position: "relative",
                  aspectRatio: "4/5",
                  borderRadius: "2rem",
                  overflow: "hidden",
                  backgroundColor: "#e5e2dd",
                  zIndex: 1,
                }}
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                  style={{ transition: "transform 0.7s ease" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Fav button */}
                <button
                  aria-label={t.favorite}
                  style={{
                    position: "absolute", top: "1rem", right: "1rem",
                    width: "2.5rem", height: "2.5rem",
                    borderRadius: "50%",
                    background: "rgba(252,249,244,0.82)",
                    backdropFilter: "blur(12px)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#aa2e28",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>

                {/* Badge */}
                <div style={{
                  position: "absolute", bottom: "1rem", left: "1rem",
                  backgroundColor: card.badgeBg, color: card.badgeColor,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.65rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  {card.badge}
                </div>
              </Link>

              {/* Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", zIndex: 1 }}>
                <h3 style={{
                  fontFamily: "'Noto Serif', serif",
                  fontSize: "1.5rem", color: "#1c1c19", margin: 0,
                }}>
                  {card.name}
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#aa2e28", fontWeight: 600, fontSize: "1.1rem",
                  }}>
                    {card.price}
                  </span>
                  <button style={{
                    display: "flex", alignItems: "center", gap: "0.25rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.85rem", fontWeight: 700,
                    color: "#994700",
                    background: "none", border: "none", cursor: "pointer",
                    transition: "color 0.2s",
                  }}>
                    {t.addCart}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
