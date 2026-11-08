import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/locale";
import { notoSerif as serif, plusJakartaSans as sans } from "@/lib/fonts";

const sectionImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ26gW42UQHroP7wM7tdzhVm9CJ5PwyP5VwEtdWYA_cjLDs7IUDTbPCUXwDLAsUVDSzUUoNc0WLFWlrUkF3TV93BgG7IuCrZVG8GOnVYcEuyCvTKE8aCBqy3irHZzR6oZMzgb_1n1sb1yJIJtBQJuKsU7QYpyvZ2HHkeeqQWlUU1-m3t-6e3NRPK2TfHSLyxL8tLbT3-DlUiyM1rIBISYlYAJ0z6CEsC-BqRFClkH3Tk1TXAWR7z8Ti7AHiU04CoThLeSAbY-5w8hp",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDMv5tnOOt8xYnWeRXeHvg_Cg1_bCOvEKn8RoC005RoAUr93OKu_-CHhGoyMy4enLWhcN8IGrmgxNEd5_Yjz2JmsG3Ue4k3Pl7EPcsogy8B3CryabHKYh6__6MREp96ZD1YYLyrnnAll_jDzfGkvsf2EqalYGJ2_8xJBNbrSzHGumg3AB57IRgU6iwwuZLJSplnjvfd12vQzfkW4vxS87HdjLYhuFQsVUebb_QzkNRE_qIppS-fZV_1rFVrAMcoAt-WFZhUOjFt5W7C",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ5L5XpaTC6XW-zzIsr1kSBtDTEA2j8hLpq88CN9Khvf_ueNYuiFHgvwZXxLmx7oscDNh2zWrZU_owrBOBc7-04az1oz8cAyyY6zJ1HT0ShQ6Q3kqdv10P-yDEVy7MAl2lZ9iYCOC3zIbDyT0pxnOmvvZxOPxlzsM_Xvu5JClLuas5dOhaWviDb_rEuSNUdmoaThmOwVsfCmBnPXlIKbEwcRt-PZSPJNJmnAY1WJsssOotVkRhu0B1dI7Q9ygpVfj9xo6XWYZUfDax",
] as const;

const copy = {
  tr: {
    sections: [
      { title: "Kendi Buketini Olustur", description: "Renk, doku ve mevsim secimlerini bir araya getirerek kendi floral kurgunu tasarla.", ctaLabel: "Tasarlamaya Basla", href: "/buket-olustur" },
      { title: "Hazir Buketlere Goz At", description: "Hazir edit koleksiyonlarini incele, hemen teslim seceneklerle dogru aranjmani sec.", ctaLabel: "Magazayi Ac", href: "/magaza" },
      { title: "Ne Istedigini Anlat", description: "Yapay zeka tarifine gore sana ozel buket onerisi hazirlasin.", ctaLabel: "Tarifimi Baslat", href: "/buket-olustur" },
    ],
    contact: "Iletisim",
    about: "Hakkinda",
  },
  en: {
    sections: [
      { title: "Build Your Own Bouquet", description: "Blend color, texture, and seasonality to shape a bouquet around your taste.", ctaLabel: "Start Designing", href: "/buket-olustur" },
      { title: "Browse Ready Bouquets", description: "Explore ready floral edits with fast delivery and curated presentation.", ctaLabel: "Open Shop", href: "/magaza" },
      { title: "Describe What You Want", description: "Let AI prepare a bouquet suggestion tailored to your description.", ctaLabel: "Start My Brief", href: "/buket-olustur" },
    ],
    contact: "Contact",
    about: "About",
  },
} as const;

export function CollectionsPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <div className={`${sans.className} min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fcf6ef_0%,#f7efe6_45%,#f2e7dc_100%)] text-[#2f2623]`}>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_12%,rgba(255,146,72,0.16),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(107,92,165,0.12),transparent_24%),radial-gradient(circle_at_50%_92%,rgba(68,128,100,0.12),transparent_30%)]" />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <section className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b5ca5]">
            {locale === "tr" ? "Aranjmanlar" : "Arrangements"}
          </p>
          <h1 className={`${serif.className} text-5xl leading-tight text-[#aa2e28] md:text-6xl`}>
            {locale === "tr" ? "Hazir ve kisisel floral kurgulari ayni sayfada kesfet." : "Discover ready-to-order and bespoke floral edits in one place."}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6d5b57]">
            {locale === "tr"
              ? "Riva Çiçekçilik aranjmanlarini ister hazir koleksiyonlardan sec, ister kendi buketini kur, istersen de tarifinle ozel yonlendirme al."
              : "Browse Riva Çiçekçilik arrangements through ready collections, custom bouquet building, or guided AI recommendations."}
          </p>
        </section>

        <div className="space-y-8">
          {t.sections.map((section, index) => (
            <section
              className="relative overflow-hidden rounded-[2rem] border border-[#e3c5bf] bg-white/80 shadow-[0_24px_60px_-36px_rgba(170,46,40,0.14)]"
              key={section.title}
            >
              <div className="grid min-h-[360px] items-center gap-0 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative z-10 p-8 md:p-12">
                  <span className="mb-5 inline-flex rounded-full bg-[#fff1e8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b5ca5]">
                    {index === 0 ? (locale === "tr" ? "Bespoke" : "Bespoke") : index === 1 ? (locale === "tr" ? "Hazir Secki" : "Ready Edit") : "AI"}
                  </span>
                  <h2 className={`${serif.className} mb-4 text-4xl leading-tight text-[#aa2e28] md:text-5xl`}>
                    {section.title}
                  </h2>
                  <p className="mb-8 max-w-lg text-base leading-8 text-[#6d5b57]">
                    {section.description}
                  </p>
                  <Link
                    className="inline-flex rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_16px_34px_-18px_rgba(170,46,40,0.35)] transition hover:opacity-95"
                    href={section.href}
                  >
                    {section.ctaLabel}
                  </Link>
                </div>
                <div className="relative min-h-[300px] lg:min-h-[360px]">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,248,243,0.2),rgba(255,248,243,0)_22%,rgba(255,248,243,0)_100%)]" />
                  <Image
                    alt={section.title}
                    className="object-cover"
                    fetchPriority={index === 0 ? "high" : "auto"}
                    fill
                    loading={index < 2 ? "eager" : undefined}
                    sizes="(max-width: 1024px) 100vw, 44vw"
                    src={sectionImages[index]}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#ffcfb2]/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 left-20 h-28 w-28 rounded-full bg-[#cdbdf3]/35 blur-3xl" />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
