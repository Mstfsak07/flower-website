export const siteConfig = {
  companyName: "{{company_name}}",
  brandName: "Riva Çiçekçilik",
  taxOffice: "{{tax_office}}",
  taxNumber: "{{tax_number}}",
  mersisNo: "{{mersis_no}}",
  address: "{{address}}",
  email: "{{email}}",
  phone: "{{phone}}",
  kepAddress: "{{kep_address}}",
  supportHours: "{{support_hours}}",
  websiteUrl: "{{website_url}}",
  productType: "{{product_type}}",
  deliveryTime: "{{delivery_time}}",
  refundEmail: "{{refund_email}}",
  contactPerson: "{{contact_person}}",
  tradeRegistryNo: "{{trade_registry_no}}",
  chamberOfCommerce: "{{chamber_of_commerce}}",
  returnAddress: "{{return_address}}",
} as const;

export type SiteConfigKey = keyof typeof siteConfig;

export const legalLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/iade-ve-iptal-kosullari", label: "İade ve İptal Koşulları" },
] as const;

export const localizedLegalLinks = {
  tr: legalLinks,
  en: [
    { href: "/hakkimizda", label: "About" },
    { href: "/iletisim", label: "Contact" },
    { href: "/gizlilik-politikasi", label: "Privacy Policy" },
    { href: "/mesafeli-satis-sozlesmesi", label: "Distance Sales Agreement" },
    { href: "/iade-ve-iptal-kosullari", label: "Returns and Cancellations" },
  ],
} as const;

export function hasSiteConfigValue(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}

export function getSiteConfigValue(
  key: SiteConfigKey,
  fallback = "Bilgi güncellenecektir.",
) {
  const value = siteConfig[key];
  return hasSiteConfigValue(value) ? value : fallback;
}

export function getBrandName() {
  return getSiteConfigValue("brandName", getSiteConfigValue("companyName", "Marka"));
}

export function getContactEmail() {
  return getSiteConfigValue("email", getSiteConfigValue("refundEmail", "destek@example.com"));
}

export function getRefundEmail() {
  return getSiteConfigValue("refundEmail", getContactEmail());
}
