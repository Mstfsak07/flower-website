import type { Metadata } from "next";
import { Building2, Clock, Hash, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { getLocale } from "@/lib/i18n";
import {
  getBrandName,
  getContactEmail,
  hasSiteConfigValue,
  siteConfig,
} from "@/lib/site-config";

const brandName = getBrandName();

const copy = {
  tr: {
    metadataTitle: `İletişim | ${brandName}`,
    metadataDescription:
      "Şirket adresi, telefon, e-posta, KEP, vergi ve MERSİS bilgileri ile iletişim formu.",
    eyebrow: "İletişim",
    title: "Bize ulaşın",
    description:
      "Sipariş, teslimat, iade, iptal, teknik destek veya kurumsal talepleriniz için aşağıdaki iletişim kanallarını kullanabilirsiniz.",
    infoTitle: "İletişim Bilgileri",
    mapTitle: "Google Maps",
    mapDescription: `Harita entegrasyonu için Google Maps iframe veya harita bileşeni bu alana eklenebilir. Adres placeholder: ${siteConfig.address}`,
    formTitle: "İletişim Formu",
    formDescription:
      "Form üzerinden ilettiğiniz bilgiler yalnızca talebinize dönüş yapmak ve destek sürecini yürütmek amacıyla kullanılır.",
    labels: {
      address: "Adres",
      chamberOfCommerce: "Ticaret Odası",
      companyName: "Şirket / İşletme Adı",
      contactPerson: "Yetkili Kişi",
      email: "E-posta",
      kepAddress: "KEP Adresi",
      mersisNo: "MERSİS Numarası",
      phone: "Telefon",
      supportHours: "Destek Saatleri",
      taxNumber: "Vergi Numarası",
      taxOffice: "Vergi Dairesi",
      tradeRegistryNo: "Ticaret Sicil No",
    },
  },
  en: {
    metadataTitle: `Contact | ${brandName}`,
    metadataDescription:
      "Contact form and company details including address, phone, email, KEP, tax, and MERSIS information.",
    eyebrow: "Contact",
    title: "Get in touch",
    description:
      "Use the contact channels below for orders, delivery, returns, cancellations, technical support, or corporate requests.",
    infoTitle: "Contact Details",
    mapTitle: "Google Maps",
    mapDescription: `A Google Maps iframe or map component can be placed here. Address placeholder: ${siteConfig.address}`,
    formTitle: "Contact Form",
    formDescription:
      "Information submitted through the form is used only to respond to your request and manage the support process.",
    labels: {
      address: "Address",
      chamberOfCommerce: "Chamber of Commerce",
      companyName: "Company / Business Name",
      contactPerson: "Contact Person",
      email: "Email",
      kepAddress: "KEP Address",
      mersisNo: "MERSIS Number",
      phone: "Phone",
      supportHours: "Support Hours",
      taxNumber: "Tax Number",
      taxOffice: "Tax Office",
      tradeRegistryNo: "Trade Registry No",
    },
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = copy[locale];

  return {
    title: t.metadataTitle,
    description: t.metadataDescription,
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = copy[locale];
  const contactItems = [
    { icon: Building2, label: t.labels.companyName, value: siteConfig.companyName },
    { icon: MapPin, label: t.labels.address, value: siteConfig.address },
    { icon: Phone, label: t.labels.phone, value: siteConfig.phone },
    { icon: Mail, label: t.labels.email, value: getContactEmail() },
    { icon: Mail, label: t.labels.kepAddress, value: siteConfig.kepAddress },
    { icon: Hash, label: t.labels.taxNumber, value: siteConfig.taxNumber },
    { icon: Hash, label: t.labels.taxOffice, value: siteConfig.taxOffice },
    { icon: Hash, label: t.labels.mersisNo, value: siteConfig.mersisNo },
    { icon: Clock, label: t.labels.supportHours, value: siteConfig.supportHours },
    { icon: Hash, label: t.labels.tradeRegistryNo, value: siteConfig.tradeRegistryNo },
    { icon: Building2, label: t.labels.chamberOfCommerce, value: siteConfig.chamberOfCommerce },
    { icon: Building2, label: t.labels.contactPerson, value: siteConfig.contactPerson },
  ].filter((item) => hasSiteConfigValue(item.value));

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fcf9f4_0%,#f6eee6_55%,#f2e7dc_100%)] px-4 pb-20 pt-32 text-[#2f2623] sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,146,72,0.16),transparent_23%),radial-gradient(circle_at_90%_14%,rgba(68,128,100,0.13),transparent_24%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#aa2e28]">
            {t.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#2f2623] sm:text-6xl">
            {t.title}
          </h1>
          <p className="mt-5 text-base leading-8 text-[#6d5b57]">{t.description}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[2rem] border border-[#ead8d2] bg-white/90 p-6 shadow-[0_26px_70px_-46px_rgba(47,38,35,0.35)] sm:p-8">
            <h2 className="font-serif text-3xl text-[#aa2e28]">{t.infoTitle}</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {contactItems.map(({ icon: Icon, label, value }) => (
                <div className="rounded-[1.5rem] border border-[#ead8d2] bg-[#fff8f3] p-5" key={label}>
                  <dt className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#aa2e28]">
                    <Icon className="size-4" />
                    {label}
                  </dt>
                  <dd className="mt-3 break-words text-sm leading-7 text-[#3c302d]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-dashed border-[#d9bdb5] bg-[#fff8f3] p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#aa2e28]">
                {t.mapTitle}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6d5b57]">
                {t.mapDescription}
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#ead8d2] bg-white/90 p-6 shadow-[0_26px_70px_-46px_rgba(47,38,35,0.35)] sm:p-8">
            <h2 className="font-serif text-3xl text-[#aa2e28]">{t.formTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#6d5b57]">{t.formDescription}</p>
            <div className="mt-6">
              <ContactForm locale={locale} />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
