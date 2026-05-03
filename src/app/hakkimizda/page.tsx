import type { Metadata } from "next";
import Link from "next/link";

import { LegalLayout, LegalSection } from "@/components/legal-layout";
import { getLocale } from "@/lib/i18n";
import { getBrandName, getContactEmail, siteConfig } from "@/lib/site-config";

const brandName = getBrandName();

const copy = {
  tr: {
    metadataTitle: `Hakkımızda | ${brandName}`,
    metadataDescription:
      "Markanın kimliği, sunduğu ürün ve hizmetler, müşteri yaklaşımı ve destek kanalları hakkında kurumsal bilgilendirme.",
    eyebrow: "Kurumsal",
    title: "Hakkımızda",
    description: `${brandName}, müşterilerine güvenilir, şeffaf ve erişilebilir bir online alışveriş/hizmet deneyimi sunmayı hedefleyen bir markadır.`,
    whoTitle: "Biz Kimiz",
    whoBody1: `${siteConfig.companyName}, ${siteConfig.websiteUrl} üzerinden ${siteConfig.productType} alanında satış ve/veya hizmet sunan bir işletmedir. Markamız, kullanıcıların ihtiyaç duyduğu ürün ve hizmetlere açık bilgi, güvenli ödeme ve düzenli iletişim süreçleriyle ulaşmasını amaçlar.`,
    whoBody2:
      "Ticari ve yasal bilgilerimiz, kullanıcıların sipariş öncesinde işletmeyi net şekilde tanıyabilmesi için iletişim ve yasal bilgilendirme sayfalarında merkezi olarak paylaşılır.",
    offerTitle: "Ne Sunuyoruz",
    offerBody:
      "Ürün ve hizmetlerimizi; doğru açıklama, şeffaf fiyatlandırma, sipariş öncesi bilgilendirme ve ulaşılabilir destek prensipleriyle sunuyoruz. Kullanıcılar, sipariş öncesinde ürün/hizmet kapsamını, teslimat veya ifa süresini, iade/iptal koşullarını ve ödeme adımlarını inceleyebilir.",
    approachTitle: "Müşteri Yaklaşımımız",
    approachBody:
      "Müşteri deneyiminde net iletişimi, zamanında bilgilendirmeyi ve talep yönetimini önceliklendiriyoruz. Sipariş, teslimat, randevu, dijital erişim, iade veya iptal süreçlerinde kullanıcıların yazılı başvuru yapabileceği kanalları açık tutarız.",
    supportTitle: "İletişim ve Destek",
    supportBody: `Destek ekibimize ${siteConfig.supportHours} saatleri içinde ulaşabilirsiniz. Genel sorularınız için ${getContactEmail()} adresine yazabilir veya iletişim sayfasındaki formu kullanabilirsiniz.`,
    contactCta: "İletişime Geç",
  },
  en: {
    metadataTitle: `About | ${brandName}`,
    metadataDescription:
      "Corporate information about the brand identity, products and services, customer approach, and support channels.",
    eyebrow: "Corporate",
    title: "About",
    description: `${brandName} is a brand focused on providing a reliable, transparent, and accessible online shopping and service experience.`,
    whoTitle: "Who We Are",
    whoBody1: `${siteConfig.companyName} is a business that offers ${siteConfig.productType} through ${siteConfig.websiteUrl}. Our brand aims to help users reach the products and services they need with clear information, secure payment, and consistent communication.`,
    whoBody2:
      "Commercial and legal information is shared centrally on our contact and legal information pages so users can identify the business clearly before placing an order.",
    offerTitle: "What We Offer",
    offerBody:
      "We present our products and services with accurate descriptions, transparent pricing, pre-order information, and reachable support. Users can review the product or service scope, delivery or performance timing, return and cancellation terms, and payment steps before ordering.",
    approachTitle: "Our Customer Approach",
    approachBody:
      "We prioritize clear communication, timely updates, and structured request handling. We keep written support channels available for orders, deliveries, appointments, digital access, returns, and cancellations.",
    supportTitle: "Contact and Support",
    supportBody: `You can reach our support team during ${siteConfig.supportHours}. For general questions, write to ${getContactEmail()} or use the form on the contact page.`,
    contactCta: "Contact Us",
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

export default async function AboutPage() {
  const locale = await getLocale();
  const t = copy[locale];

  return (
    <LegalLayout
      description={t.description}
      eyebrow={t.eyebrow}
      locale={locale}
      title={t.title}
    >
      <LegalSection title={t.whoTitle}>
        <p>{t.whoBody1}</p>
        <p>{t.whoBody2}</p>
      </LegalSection>

      <LegalSection title={t.offerTitle}>
        <p>{t.offerBody}</p>
      </LegalSection>

      <LegalSection title={t.approachTitle}>
        <p>{t.approachBody}</p>
      </LegalSection>

      <LegalSection title={t.supportTitle}>
        <p>{t.supportBody}</p>
        <Link
          className="inline-flex rounded-full bg-[#2f2623] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#aa2e28]"
          href="/iletisim"
        >
          {t.contactCta}
        </Link>
      </LegalSection>
    </LegalLayout>
  );
};
