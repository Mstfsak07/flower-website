import Link from "next/link";
import { AtSign, MapPin, MessageCircleMore, Sparkles } from "lucide-react";
import { Noto_Serif } from "next/font/google";

import { categories, getLocalizedCategory, siteSettings } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import { getBrandName, getSiteConfigValue, localizedLegalLinks } from "@/lib/site-config";

const serif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const copy = {
  tr: {
    newsletterTitle: "Bultene Katil",
    newsletterDescription:
      "Yeni koleksiyonlari ve ozel gun secimlerini ilk sen gor. Kampanyalar, yeni aranjmanlar ve sezon secimleri icin e-posta listemize katil.",
    emailPlaceholder: "E-posta Adresiniz",
    subscribe: "Katil",
    privacyNote: "Katilarak gizlilik politikamizi kabul etmis olursunuz.",
    brandDescription:
      "Doganin en zarif anlarini, ozenli cicek tasarimlariyla yasam alanlariniza tasiyoruz.",
    quickMenu: "Hizli Menu",
    arrangements: "Aranjmanlar",
    corporate: "Kurumsal",
    legal: "KVKK ve Yasal",
    followInstagram: "Instagram'da Takip Et",
    whatsapp: "WhatsApp'tan Yaz",
    rights: "Tum Haklari Saklidir.",
    menuLinks: [
      ["/", "Ana Sayfa"],
      ["/magaza", "Magaza"],
      ["/aranjmanlar", "Aranjmanlar"],
      ["/hakkimizda", "Hakkımızda"],
      ["/iletisim", "Iletisim"],
    ],
    legalLinks: [
      ["/hakkimizda", "Hakkımızda"],
      ["/iletisim", "İletişim"],
      ["/gizlilik-politikasi", "Gizlilik Politikası"],
      ["/mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi"],
      ["/iade-ve-iptal-kosullari", "İade ve İptal Koşulları"],
    ],
  },
  en: {
    newsletterTitle: "Join The Newsletter",
    newsletterDescription:
      "See new collections and signature floral edits first. Join our e-mail list for campaigns, new arrangements, and seasonal selections.",
    emailPlaceholder: "Your Email Address",
    subscribe: "Join",
    privacyNote: "By joining, you agree to our privacy policy.",
    brandDescription:
      "We bring nature's most elegant moments into your spaces through refined floral compositions.",
    quickMenu: "Quick Menu",
    arrangements: "Arrangements",
    corporate: "Corporate",
    legal: "Privacy and Legal",
    followInstagram: "Follow on Instagram",
    whatsapp: "Message on WhatsApp",
    rights: "All Rights Reserved.",
    menuLinks: [
      ["/", "Home"],
      ["/magaza", "Shop"],
      ["/arrangements", "Arrangements"],
      ["/hakkimizda", "About"],
      ["/iletisim", "Contact"],
    ],
    legalLinks: [
      ["/hakkimizda", "About"],
      ["/iletisim", "Contact"],
      ["/gizlilik-politikasi", "Privacy Policy"],
      ["/mesafeli-satis-sozlesmesi", "Distance Sales Agreement"],
      ["/iade-ve-iptal-kosullari", "Returns and Cancellations"],
    ],
  },
} as const;

type SiteFooterProps = {
  currentLocale: Locale;
};

export function SiteFooter({ currentLocale }: SiteFooterProps) {
  const t = copy[currentLocale];
  const brandName = getBrandName();
  const address = getSiteConfigValue("address", siteSettings.address);
  const menuLinks = t.menuLinks as ReadonlyArray<readonly [string, string]>;
  const legalLinks = localizedLegalLinks[currentLocale];
  const whatsappHref = `https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`;

  return (
    <footer className="relative overflow-hidden border-t border-[#e3c5bf] bg-[#f8f1eb] pt-20 pb-10 text-[#2f2623]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(255,146,72,0.18),transparent_58%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-8">
        <section className="mb-24">
          <div className="rounded-[2rem] border border-[#e3c5bf] bg-white/84 px-8 py-12 shadow-[0_24px_60px_-42px_rgba(170,46,40,0.18)] backdrop-blur-[20px] lg:px-12 lg:py-16">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
              <div className="flex-1 space-y-5">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#aa2e28]">
                  <Sparkles className="size-3.5" />
                  {t.newsletterTitle}
                </div>
                <h2 className={`${serif.className} max-w-xl text-4xl leading-tight text-[#2f2623] lg:text-5xl`}>
                  {t.newsletterTitle}
                </h2>
                <p className="max-w-md text-lg font-light leading-relaxed text-[#6d5b57]">
                  {t.newsletterDescription}
                </p>
              </div>

              <div className="flex-1">
                <form className="flex flex-col gap-4 sm:flex-row">
                  <input
                    className="w-full rounded-full border border-[#e0bfbb] bg-[#fff8f5] px-6 py-4 text-[#1b1c19] placeholder:text-[#8c716d] outline-none transition focus:border-[#aa2e28] focus:ring-1 focus:ring-[#aa2e28]"
                    placeholder={t.emailPlaceholder}
                    type="email"
                  />
                  <button
                    className="rounded-full bg-[linear-gradient(135deg,#aa2e28_0%,#cc473e_100%)] px-10 py-4 font-bold text-white transition duration-300 hover:-translate-y-1"
                    type="submit"
                  >
                    {t.subscribe}
                  </button>
                </form>
                <p className="mt-4 text-xs font-light tracking-wide text-[#8b716a]">
                  {t.privacyNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col space-y-6">
            <span className={`${serif.className} text-xl text-[#aa2e28]`}>
              {brandName}
            </span>
            <p className="text-sm font-light leading-relaxed tracking-wide text-[#6d5b57]">
              {t.brandDescription}
            </p>
            <div className="flex items-center gap-4 pt-2 text-[#aa2e28]">
              <a
                className="transition-all hover:translate-x-1 hover:text-[#cc473e]"
                href={siteSettings.instagram}
                rel="noreferrer"
                target="_blank"
              >
                <AtSign className="size-5" />
              </a>
              <a
                className="transition-all hover:translate-x-1 hover:text-[#cc473e]"
                href={whatsappHref}
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircleMore className="size-5" />
              </a>
              <a
                className="transition-all hover:translate-x-1 hover:text-[#cc473e]"
                href="https://maps.google.com/?q=Konyaalti+Antalya"
                rel="noreferrer"
                target="_blank"
              >
                <MapPin className="size-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <h4 className="text-sm font-medium uppercase tracking-[0.24em] text-[#aa2e28]">
              {t.quickMenu}
            </h4>
            <ul className="flex flex-col space-y-4">
              {menuLinks.map(([href, label]) => (
                <li key={href}>
                  <Link
                    className="text-[#6d5b57] transition-all hover:translate-x-1 hover:text-[#aa2e28]"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-6">
            <h4 className="text-sm font-medium uppercase tracking-[0.24em] text-[#aa2e28]">
              {t.arrangements}
            </h4>
            <ul className="flex flex-col space-y-4">
              {categories.slice(0, 5).map((category) => {
                const localizedCategory = getLocalizedCategory(category, currentLocale);
                return (
                  <li key={category.id}>
                  <Link
                    className="text-[#6d5b57] transition-all hover:translate-x-1 hover:text-[#aa2e28]"
                    href={`/kategori/${category.slug}`}
                  >
                    {localizedCategory.name}
                  </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col space-y-8">
            <div>
              <h4 className="mb-6 text-sm font-medium uppercase tracking-[0.24em] text-[#aa2e28]">
                {t.corporate}
              </h4>
              <div className="space-y-4 text-sm font-light tracking-wide text-[#6d5b57]">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 text-[#aa2e28]" />
                  <span>{address}</span>
                </p>
                <a
                  className="inline-flex items-center gap-2 rounded-full border border-[#e0bfbb] bg-white/70 px-4 py-3 text-[#aa2e28] transition-colors hover:text-[#cc473e]"
                  href={whatsappHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircleMore className="size-4" />
                  {t.whatsapp}
                </a>
                <a
                  className="flex items-center gap-2 text-[#aa2e28]/80 transition-colors hover:text-[#cc473e]"
                  href={siteSettings.instagram}
                  rel="noreferrer"
                  target="_blank"
                >
                  <AtSign className="size-4" />
                  {t.followInstagram}
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-6 text-sm font-medium uppercase tracking-[0.24em] text-[#aa2e28]">
                {t.legal}
              </h4>
              <ul className="flex flex-col space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="text-[#6d5b57] transition-all hover:translate-x-1 hover:text-[#aa2e28]"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[#e3c5bf] pt-8 md:flex-row">
          <p className="text-xs font-light tracking-wide text-[#8b716a]">
            &copy; {new Date().getFullYear()} {brandName}. {t.rights}
          </p>
          <div className="h-6 w-28 rounded bg-[linear-gradient(90deg,rgba(170,46,40,0.06),rgba(170,46,40,0.22),rgba(170,46,40,0.06))] opacity-60" />
        </div>
      </div>
    </footer>
  );
}
