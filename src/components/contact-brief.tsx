import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/locale";
import { getBrandName, getContactEmail, getSiteConfigValue } from "@/lib/site-config";

const copy = {
  tr: {
    address: "Adres",
    cta: "İletişim sayfasına git",
    description:
      "Sipariş, teslimat, iade veya kurumsal talepleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz.",
    email: "E-posta",
    eyebrow: "İletişim",
    phone: "Telefon",
    supportHours: "Destek Saatleri",
    title: (brandName: string) => `${brandName} destek ekibine ulaşın.`,
  },
  en: {
    address: "Address",
    cta: "Go to contact page",
    description:
      "Use the channels below for orders, deliveries, returns, or corporate requests.",
    email: "Email",
    eyebrow: "Contact",
    phone: "Phone",
    supportHours: "Support Hours",
    title: (brandName: string) => `Contact the ${brandName} support team.`,
  },
} as const;

export function ContactBrief({ locale = "tr" }: { locale?: Locale }) {
  const t = copy[locale];
  const brandName = getBrandName();
  const phone = getSiteConfigValue("phone");
  const email = getContactEmail();
  const address = getSiteConfigValue("address");
  const supportHours = getSiteConfigValue("supportHours");

  return (
    <section className="relative overflow-hidden bg-[#f7efe7] px-6 py-20 text-[#2f2623]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(68,128,100,0.14),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(255,146,72,0.16),transparent_22%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#ead8d2] bg-white/82 p-8 shadow-[0_24px_70px_-48px_rgba(47,38,35,0.3)] backdrop-blur lg:grid-cols-[1fr_1.2fr] lg:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#aa2e28]">
            {t.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#2f2623]">
            {t.title(brandName)}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#6d5b57]">
            {t.description}
          </p>
          <Link
            className="mt-7 inline-flex rounded-full bg-[#2f2623] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#aa2e28]"
            href="/iletisim"
          >
            {t.cta}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard icon={<Phone className="size-5" />} label={t.phone} value={phone} />
          <ContactCard icon={<Mail className="size-5" />} label={t.email} value={email} />
          <ContactCard icon={<MapPin className="size-5" />} label={t.address} value={address} />
          <ContactCard label={t.supportHours} value={supportHours} />
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#ead8d2] bg-[#fff8f3] p-5">
      <div className="flex items-center gap-3 text-[#aa2e28]">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-3 break-words text-sm leading-7 text-[#3c302d]">{value}</p>
    </div>
  );
}
