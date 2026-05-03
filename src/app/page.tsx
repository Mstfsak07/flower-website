import type { Metadata } from "next";
import { ContactBrief } from "@/components/contact-brief";
import { BrandStory } from "@/components/home/BrandStory";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Iris Atalier | Editorial Floral Design",
};

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          "linear-gradient(180deg, #fcf6ef 0%, #f8efe5 42%, #f3e8dc 100%)",
      }}
    >

      {/* Global ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute organic-blob-1 blur-3xl"
          style={{
            top: "-10%", left: "-10%",
            width: "50vw", height: "50vw",
            backgroundColor: "#ff9248",
            opacity: 0.12,
          }}
        />
        <div
          className="absolute organic-blob-2 blur-3xl"
          style={{
            top: "20%", right: "-5%",
            width: "40vw", height: "60vw",
            backgroundColor: "#448064",
            opacity: 0.10,
          }}
        />
        <div
          className="absolute organic-blob-3 blur-3xl"
          style={{
            bottom: "-10%", left: "30%",
            width: "35vw", height: "35vw",
            backgroundColor: "#ff9248",
            opacity: 0.08,
          }}
        />
      </div>

      <SiteHeader locale={locale} />

      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero locale={locale} />
        <FeaturedProducts locale={locale} />
        <BrandStory locale={locale} />
        <ContactBrief locale={locale} />
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
