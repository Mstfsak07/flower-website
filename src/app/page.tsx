import Link from "next/link";
import { CheckCircle2, Store } from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { PremiumHero } from "@/components/premium-hero";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories, faqs, featuredProducts, trustHighlights } from "@/lib/data";

export default function HomePage() {
  const curatedPaths = [
    {
      title: "Hizli surpriz",
      description: "Ayni gun cikar, kisa kart notu ile dakikalar icinde secimini tamamla.",
      href: "/kategori/mini-buketler",
      cta: "Mini buketleri ac",
    },
    {
      title: "Daha premium bir jest",
      description: "Daha hacimli, fotografik etkisi guclu ve premium sunumlu secimler.",
      href: "/kategori/premium-buketler",
      cta: "Premium buketlere git",
    },
    {
      title: "Kurumsal ve etkinlik",
      description: "Teklif, adet, renk dili ve teslimat planini beraber netlestiren akis.",
      href: "/toptan",
      cta: "Kurumsal akis",
    },
  ];

  return (
    <div className="pb-16">
      <PremiumHero />

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {curatedPaths.map((path) => (
            <Link
              key={path.title}
              className="panel group rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1"
              href={path.href}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                Kesif rotasi
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">{path.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{path.description}</p>
              <div className="mt-5 text-sm font-semibold text-[var(--color-ink)] transition group-hover:text-[var(--color-accent)]">
                {path.cta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Koleksiyonlar"
          title="Ozenle secilmis, zarif tasarimlar"
          description="Sevdiklerinize duygularinizi en saf haliyle iletmek uzere hazirlanmis, her detayi dusunulmus cicek aranjmanlari."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Imza Tasarimlar"
          title="Mevsimin en taze ve dikkat cekici urunleri"
          description="Doganin zarafetini tasiyan, her biri ozel tasarim imza aranjmanlarimizi kesfedin."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            ["Hizli secim", "Ayni gun uygun urunler, en cok tercih edilenler ve fiyat araligina gore kisa karar akisi."],
            ["Kisisellestirme", "Kart notu, boyut secimi ve renk aksesuariyla temel jesti daha anlamli hale getir."],
            ["Teslimat netligi", "Bolge, saat araligi ve stok akisi checkout oncesinde daha okunur ilerler."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5">
              <h3 className="text-lg font-semibold text-[var(--color-ink)]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="panel p-8">
            <SectionHeading
              eyebrow="Neden Biz"
              title="Ayricalikli ve ozenli bir deneyim"
              description="Siparisinizin her asamasinda kalite, hiz ve zarafeti on planda tutuyoruz. Sizin icin sadece en iyisini seciyoruz."
            />
            <div className="mt-8 grid gap-4">
              {trustHighlights.map((item) => (
                <div key={item} className="glass-panel flex items-center gap-3 rounded-[1.5rem] px-4 py-4">
                  <CheckCircle2 className="size-5 text-[var(--color-leaf)]" />
                  <span className="text-sm font-medium text-[var(--color-ink)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-8">
            <SectionHeading
              eyebrow="Sik Sorulanlar"
              title="Akliniza takilan tum sorular"
              description="Teslimat, bakim ve siparis surecleri ile ilgili en cok merak edilenler."
            />
            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="glass-panel rounded-[1.5rem] p-5">
                  <h3 className="text-lg font-semibold text-[var(--color-ink)]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="panel p-8">
            <SectionHeading
              eyebrow="Siparis Akisi"
              title="Karardan teslimate sade bir akis"
              description="Yerel cicekcide kararin hizli, hazirligin kontrollu ve teslimatin gorunur oldugu bir deneyim kurduk."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["01", "Urunu sec", "Kategori, fiyat ve rozet filtresiyle uygun tasarimi bul."],
                ["02", "Detaylari netlestir", "Boyut, not ve teslim saatini tek akista tamamla."],
                ["03", "Takip et", "Siparis numarasi uzerinden operasyon akisini gor."],
              ].map(([step, title, copy]) => (
                <div key={step} className="rounded-[1.75rem] bg-[var(--color-card)] p-5">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {step}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--color-ink)]">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-8">
            <SectionHeading
              eyebrow="Teslimat Bolgesi"
              title="Kadikoy merkezli hizli dagitim"
              description="Gun ici planlanan siparislerde mahalle ve saat penceresine gore dagitim yogunlugunu yonetiyoruz."
            />
            <div className="mt-8 space-y-3">
              {[
                "Caddebostan, Suadiye ve Erenkoy cikisli hizli dagitim",
                "15:00 oncesi siparislerde ayni gun uygunlugu",
                "Kurumsal toplu teslimatlar icin ozel planlama",
                "WhatsApp destekle son dakika teyit akisi",
              ].map((item) => (
                <div key={item} className="glass-panel flex items-center gap-3 rounded-[1.5rem] px-4 py-4">
                  <CheckCircle2 className="size-5 text-[var(--color-leaf)]" />
                  <span className="text-sm font-medium text-[var(--color-ink)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="panel flex flex-col items-start justify-between gap-5 p-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              B2B ve Etkinlik
            </p>
            <h2 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">
              Kurumsal ihtiyaclariniza ozel tasarimlar
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-muted)]">
              Dugun, davet, kurumsal etkinlikler ve otel dekorasyonlari icin markaniza ve konseptinize ozel cicek tasarimlari ve toptan tedarik sagliyoruz.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-dark)]"
            href="/toptan"
          >
            <Store className="size-4" />
            Toptan Teklif Al
          </Link>
        </div>
      </section>
    </div>
  );
}
