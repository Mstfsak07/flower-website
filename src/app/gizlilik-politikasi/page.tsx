import type { Metadata } from "next";

import { BulletList, LegalLayout, LegalSection } from "@/components/legal-layout";
import { getLocale } from "@/lib/i18n";
import { getBrandName, getContactEmail, siteConfig } from "@/lib/site-config";

const brandName = getBrandName();

const copy = {
  tr: {
    metadataTitle: `Gizlilik Politikası | ${brandName}`,
    metadataDescription:
      "Kişisel verilerin toplanması, işlenmesi, saklanması, çerezler ve kullanıcı haklarına ilişkin gizlilik politikası.",
    title: "Gizlilik Politikası",
    description: `${brandName}, kullanıcıların kişisel verilerinin gizliliğine önem verir. Bu politika, site ve hizmet kullanımı sırasında hangi verilerin hangi genel amaçlarla işlenebileceğini açıklar.`,
    note: "Bu politika genel bilgilendirme şablonudur. KVKK kapsamındaki veri sorumlusu yükümlülükleri, saklama süreleri ve aydınlatma metinleri şirketinizin gerçek süreçlerine göre ayrıca değerlendirilmelidir.",
    sections: [
      {
        title: "1. Toplanan Veriler",
        body: "Site üzerinden sipariş verilmesi, üyelik oluşturulması, iletişim formu gönderilmesi veya destek talebi açılması halinde aşağıdaki veri kategorileri işlenebilir:",
        items: [
          "Ad, soyad, unvan ve iletişim bilgileri.",
          "Teslimat, fatura ve iade adresi bilgileri.",
          "Sipariş içeriği, ürün/hizmet tercihleri, işlem tarihi ve sipariş numarası.",
          "İletişim formu mesajları, destek talepleri ve müşteri hizmetleri kayıtları.",
          "IP adresi, cihaz, tarayıcı, oturum ve çerez bilgileri.",
          "Yasal yükümlülükler kapsamında gerekli fatura, muhasebe ve işlem güvenliği bilgileri.",
        ],
      },
      {
        title: "2. Verilerin Toplanma Yöntemi",
        body: "Veriler; web sitesi formları, checkout adımları, kullanıcı hesabı işlemleri, e-posta, telefon, canlı destek, çerezler, sistem kayıtları ve ödeme altyapısı entegrasyonları aracılığıyla elektronik ortamda toplanabilir.",
      },
      {
        title: "3. İşleme Amaçları",
        body: "Kişisel veriler, ilgili mevzuata ve ölçülülük ilkesine uygun şekilde aşağıdaki genel amaçlarla işlenebilir:",
        items: [
          "Siparişin alınması, hazırlanması, teslim edilmesi veya hizmetin ifası.",
          "Ödeme, fatura, muhasebe ve finans süreçlerinin yürütülmesi.",
          "Müşteri destek taleplerinin yanıtlanması ve iletişim kurulması.",
          "İade, iptal, değişim ve şikayet süreçlerinin yönetilmesi.",
          "Site güvenliği, dolandırıcılık önleme ve işlem kayıtlarının tutulması.",
          "Yasal yükümlülüklerin yerine getirilmesi ve yetkili kurum taleplerinin karşılanması.",
        ],
      },
      {
        title: "4. Ödeme Altyapısı Sağlayıcılarıyla Paylaşım",
        body: "Ödeme işlemleri, kullanılan sanal POS veya ödeme altyapısı sağlayıcısı tarafından yürütülebilir. Kart numarası, son kullanma tarihi, CVV gibi hassas ödeme verileri ödeme kuruluşunun güvenli ödeme ekranı veya altyapısı üzerinden işlenebilir; bu veriler site tarafından doğrudan saklanmayabilir. Siparişin tamamlanması, ödeme güvenliği, iade/iptal süreçleri, sahtecilik önleme ve yasal yükümlülükler için gerekli sınırlı bilgiler ödeme altyapısı sağlayıcıları, bankalar, kargo/kurye firmaları, teknik hizmet sağlayıcılar ve yetkili kamu kurumlarıyla paylaşılabilir.",
      },
      {
        title: "5. Çerezler / Cookies",
        body: "Site; oturumun sürdürülmesi, sepetin çalışması, güvenlik, performans ölçümü ve kullanıcı deneyiminin iyileştirilmesi amacıyla çerezler kullanabilir. Zorunlu çerezler hizmetin çalışması için gerekli olabilir; analitik veya pazarlama amaçlı çerezler için uygulanabilir mevzuata göre ayrıca tercih veya onay mekanizması sunulabilir.",
      },
      {
        title: "6. Saklama Süresi",
        body: "Kişisel veriler, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı, muhasebe, vergi, tüketici ve e-ticaret yükümlülükleri kapsamında gerekli sürelerle saklanabilir. Sürenin sonunda veriler silinebilir, yok edilebilir veya anonim hale getirilebilir.",
      },
      {
        title: "7. Kullanıcı Hakları",
        body: "Kullanıcılar, yürürlükteki mevzuat çerçevesinde kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işleme amacını öğrenme, eksik veya yanlış verilerin düzeltilmesini isteme, şartları varsa silme/yok etme talep etme ve hukuka aykırı işleme nedeniyle zarara uğraması halinde giderim talep etme gibi haklara sahip olabilir.",
      },
      {
        title: "8. İletişim",
        body: `Gizlilik ve kişisel veri talepleriniz için ${siteConfig.companyName} ile aşağıdaki kanallardan iletişime geçebilirsiniz.`,
        items: [
          `E-posta: ${getContactEmail()}`,
          `KEP: ${siteConfig.kepAddress}`,
          `Adres: ${siteConfig.address}`,
          `Web sitesi: ${siteConfig.websiteUrl}`,
        ],
      },
    ],
  },
  en: {
    metadataTitle: `Privacy Policy | ${brandName}`,
    metadataDescription:
      "Privacy policy covering collection, processing, retention, cookies, payment providers, and user rights.",
    title: "Privacy Policy",
    description: `${brandName} values the privacy of users' personal data. This policy explains which data may be processed for general purposes during use of the website and services.`,
    note: "This policy is a general information template. Data controller obligations, retention periods, and disclosure texts should be reviewed according to your company's actual processes and applicable law.",
    sections: [
      {
        title: "1. Data Collected",
        body: "When an order is placed, an account is created, a contact form is submitted, or a support request is opened, the following data categories may be processed:",
        items: [
          "Name, surname, title, and contact details.",
          "Delivery, invoice, and return address information.",
          "Order content, product/service preferences, transaction date, and order number.",
          "Contact form messages, support requests, and customer service records.",
          "IP address, device, browser, session, and cookie information.",
          "Invoice, accounting, transaction security, and legal compliance information where required.",
        ],
      },
      {
        title: "2. Collection Method",
        body: "Data may be collected electronically through website forms, checkout steps, account actions, email, phone, live support, cookies, system logs, and payment infrastructure integrations.",
      },
      {
        title: "3. Processing Purposes",
        body: "Personal data may be processed for the following general purposes in line with applicable law and proportionality:",
        items: [
          "Receiving, preparing, delivering, or performing orders and services.",
          "Managing payment, invoice, accounting, and finance processes.",
          "Responding to customer support requests and communicating with users.",
          "Managing returns, cancellations, exchanges, and complaints.",
          "Maintaining site security, fraud prevention, and transaction records.",
          "Meeting legal obligations and responding to competent authority requests.",
        ],
      },
      {
        title: "4. Sharing With Payment Infrastructure Providers",
        body: "Payment transactions may be carried out by the virtual POS or payment infrastructure provider used. Sensitive payment data such as card number, expiry date, and CVV may be processed through the secure payment page or infrastructure of the payment institution; such data may not be stored directly by the website. Limited information required for order completion, payment security, returns/cancellations, fraud prevention, and legal obligations may be shared with payment providers, banks, couriers, technical service providers, and competent public authorities.",
      },
      {
        title: "5. Cookies",
        body: "The site may use cookies to maintain sessions, operate the cart, support security, measure performance, and improve user experience. Necessary cookies may be required for the service to function; analytics or marketing cookies may be subject to additional preference or consent mechanisms under applicable law.",
      },
      {
        title: "6. Retention Period",
        body: "Personal data may be retained for as long as required for the processing purpose and for periods required under accounting, tax, consumer, e-commerce, and limitation rules. At the end of the period, data may be deleted, destroyed, or anonymized.",
      },
      {
        title: "7. User Rights",
        body: "Users may have rights under applicable law to learn whether their personal data is processed, request information if processed, learn the purpose of processing, request correction of incomplete or inaccurate data, request deletion/destruction where conditions apply, and claim compensation in case of unlawful processing.",
      },
      {
        title: "8. Contact",
        body: `For privacy and personal data requests, you may contact ${siteConfig.companyName} through the channels below.`,
        items: [
          `Email: ${getContactEmail()}`,
          `KEP: ${siteConfig.kepAddress}`,
          `Address: ${siteConfig.address}`,
          `Website: ${siteConfig.websiteUrl}`,
        ],
      },
    ],
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

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const t = copy[locale];

  return (
    <LegalLayout description={t.description} locale={locale} note={t.note} title={t.title}>
      {t.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          <p>{section.body}</p>
          {"items" in section && section.items ? <BulletList items={[...section.items]} /> : null}
        </LegalSection>
      ))}
    </LegalLayout>
  );
}
