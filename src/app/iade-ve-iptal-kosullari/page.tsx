import type { Metadata } from "next";

import { BulletList, LegalLayout, LegalSection } from "@/components/legal-layout";
import { getLocale } from "@/lib/i18n";
import {
  getBrandName,
  getContactEmail,
  getRefundEmail,
  siteConfig,
} from "@/lib/site-config";

const brandName = getBrandName();

const copy = {
  tr: {
    metadataTitle: `İade ve İptal Koşulları | ${brandName}`,
    metadataDescription:
      "Fiziksel ürün, dijital ürün ve hizmet rezervasyonu senaryoları için iptal ve iade koşulları.",
    title: "İade ve İptal Koşulları",
    description: `${brandName} üzerinden satın alınan fiziksel ürünler, dijital ürünler ve hizmet/randevu rezervasyonları için genel iptal ve iade süreçlerini açıklar.`,
    note: "Bu sayfa genel şablon niteliğindedir. İade ve iptal koşullarını kendi ürün/hizmet modeliniz, teslimat operasyonunuz ve güncel mevzuat çerçevesinde uyarlamanız gerekir.",
    processTitle: "Süreç ve Başvuru Yöntemi",
    outsideTitle: "İade Kapsamı Dışında Kalan Haller",
    contactTitle: "İletişim",
    general: {
      title: "1. Genel Şartlar",
      body: "İade ve iptal talepleri; ürün/hizmetin niteliği, siparişin hazırlanma durumu, teslimat veya ifa zamanı, kişiselleştirme seviyesi ve ilgili mevzuattaki cayma hakkı istisnaları dikkate alınarak değerlendirilir.",
      items: [
        `Ürün/hizmet türü: ${siteConfig.productType}`,
        `Tahmini teslimat/ifa süresi: ${siteConfig.deliveryTime}`,
        `İade başvuru e-postası: ${getRefundEmail()}`,
        `İade adresi: ${siteConfig.returnAddress}`,
      ],
    },
    scenarios: [
      {
        title: "2. Fiziksel Ürün",
        cancelTitle: "İptal koşulları",
        cancelBody:
          "Sipariş hazırlık veya kargo/kurye sürecine alınmadan önce iptal talebi iletilebilir. Ürün kişiye özel hazırlanmışsa, hızlı bozulan nitelikteyse veya teslimata çıkarılmışsa iptal talebi ayrıca değerlendirilebilir.",
        refundTitle: "İade şartları",
        refundItems: [
          "Ürün kullanılmamış, yeniden satışa uygun ve mümkünse orijinal ambalajıyla gönderilmelidir.",
          "Kişiye özel hazırlanan, hızlı bozulan veya hijyen sebebiyle iadesi uygun olmayan ürünlerde iade hakkı sınırlı olabilir.",
          "Hasarlı, ayıplı veya yanlış ürün tesliminde talep, fotoğraf ve sipariş bilgileriyle birlikte iletilmelidir.",
        ],
      },
      {
        title: "3. Dijital Ürün",
        cancelTitle: "İptal koşulları",
        cancelBody:
          "Dijital içeriğe erişim sağlanmadan, lisans/aktivasyon kodu oluşturulmadan veya hizmet başlatılmadan önce iptal talebi değerlendirilebilir.",
        refundTitle: "İade şartları",
        refundBody:
          "Dijital ürün veya içeriğin alıcının onayıyla anında teslim edilmesi, erişime açılması, indirilmesi veya aktivasyon kodunun kullanılması halinde iade talebi ürünün niteliğine göre reddedilebilir. Teknik erişim problemi varsa destek ekibi önce çözüm veya yeniden erişim sağlamayı hedefler.",
      },
      {
        title: "4. Hizmet Rezervasyonu / Randevu / Danışmanlık",
        cancelTitle: "İptal koşulları",
        cancelBody:
          "Randevu, danışmanlık, rezervasyon veya belirli bir tarihte sunulacak hizmetlerde iptal talebinin hizmet tarihinden makul süre önce iletilmesi beklenir. Hizmet hazırlığı başlamışsa veya hizmet tarihi çok yaklaşmışsa kesinti uygulanabilir.",
        refundTitle: "İade şartları",
        refundItems: [
          "Hizmet henüz başlamadıysa iptal ve iade talebi değerlendirilebilir.",
          "Hizmet alıcının onayıyla başladıysa veya tamamlandıysa iade hakkı sınırlı olabilir.",
          "Randevuya katılmama, geç kalma veya alıcı kaynaklı aksaklıklarda iade yapılamayabilir.",
        ],
      },
    ],
    processBodies: [
      `İade veya iptal başvurusu için sipariş numarası, ad soyad, iletişim bilgisi, talep nedeni ve varsa destekleyici görseller ${getRefundEmail()} adresine gönderilmelidir. Talep alındıktan sonra ekip, sipariş durumunu ve ürün/hizmet niteliğini kontrol ederek kullanıcıya dönüş yapar.`,
      "İade onaylanırsa ödeme, kullanılan ödeme yöntemine ve ödeme kuruluşu/banka süreçlerine bağlı olarak aynı ödeme aracına aktarılır. Banka veya ödeme kuruluşu kaynaklı yansıma süreleri değişebilir.",
    ],
    outsideItems: [
      "Alıcının talebiyle kişiselleştirilmiş ürünler.",
      "Hızlı bozulan veya belirli tarihte kullanılması gereken ürünler.",
      "Teslimden sonra hijyen, sağlık veya güvenlik sebebiyle iadesi uygun olmayan ürünler.",
      "Kullanılmış, hasar görmüş veya yeniden satışa uygun olmayan ürünler.",
      "Alıcının açık onayıyla erişime açılan dijital içerikler.",
      "Başlamış, tamamlanmış veya belirli tarihli hizmet rezervasyonları.",
      "Alıcı kaynaklı yanlış adres, eksik bilgi, teslim almama veya randevuya katılmama halleri.",
    ],
    contactBody: `İade ve iptal talepleri için öncelikli kanal ${getRefundEmail()} adresidir. Genel destek için ${getContactEmail()} adresinden veya ${siteConfig.phone} numaralı telefondan iletişime geçebilirsiniz.`,
  },
  en: {
    metadataTitle: `Returns and Cancellations | ${brandName}`,
    metadataDescription:
      "Cancellation and return terms for physical products, digital products, and service reservations.",
    title: "Returns and Cancellations",
    description: `This page explains the general cancellation and return process for physical products, digital products, and service/appointment reservations purchased through ${brandName}.`,
    note: "This page is a general template. Return and cancellation terms should be adapted to your own product/service model, delivery operations, and current legislation.",
    processTitle: "Process and Application Method",
    outsideTitle: "Cases Outside the Return Scope",
    contactTitle: "Contact",
    general: {
      title: "1. General Conditions",
      body: "Return and cancellation requests are evaluated according to the nature of the product/service, order preparation status, delivery or performance time, personalization level, and legal exceptions to the right of withdrawal.",
      items: [
        `Product/service type: ${siteConfig.productType}`,
        `Estimated delivery/performance time: ${siteConfig.deliveryTime}`,
        `Return request email: ${getRefundEmail()}`,
        `Return address: ${siteConfig.returnAddress}`,
      ],
    },
    scenarios: [
      {
        title: "2. Physical Products",
        cancelTitle: "Cancellation terms",
        cancelBody:
          "A cancellation request may be submitted before the order is taken into preparation, cargo, or courier process. If the product is personalized, perishable, or already dispatched, the request may be evaluated separately.",
        refundTitle: "Return terms",
        refundItems: [
          "The product should be unused, suitable for resale, and preferably returned with its original packaging.",
          "Return rights may be limited for personalized, perishable, or hygiene-sensitive products.",
          "For damaged, defective, or incorrect products, the request should be submitted with photos and order details.",
        ],
      },
      {
        title: "3. Digital Products",
        cancelTitle: "Cancellation terms",
        cancelBody:
          "Cancellation may be evaluated before digital access is provided, a license/activation code is created, or the service begins.",
        refundTitle: "Return terms",
        refundBody:
          "If digital products or content are delivered instantly with the buyer's approval, opened for access, downloaded, or activated, a refund request may be rejected depending on the nature of the product. If there is a technical access issue, support first aims to resolve it or provide renewed access.",
      },
      {
        title: "4. Service Reservations / Appointments / Consulting",
        cancelTitle: "Cancellation terms",
        cancelBody:
          "For appointments, consulting, reservations, or services provided on a specific date, cancellation requests are expected to be submitted a reasonable time before the service date. If preparation has started or the date is very close, deductions may apply.",
        refundTitle: "Return terms",
        refundItems: [
          "If the service has not started, cancellation and refund requests may be evaluated.",
          "If the service has started with the buyer's approval or has been completed, refund rights may be limited.",
          "No-shows, late arrivals, or buyer-caused disruptions may not be eligible for refund.",
        ],
      },
    ],
    processBodies: [
      `For a return or cancellation request, order number, full name, contact details, request reason, and supporting images if available should be sent to ${getRefundEmail()}. After receiving the request, the team reviews the order status and product/service nature and responds to the user.`,
      "If the return is approved, the payment is refunded to the same payment instrument depending on the payment method and bank/payment provider processes. Bank or provider reflection times may vary.",
    ],
    outsideItems: [
      "Products personalized at the buyer's request.",
      "Perishable products or products required for a specific date.",
      "Products unsuitable for return after delivery due to hygiene, health, or safety reasons.",
      "Used, damaged, or non-resalable products.",
      "Digital content opened for access with the buyer's explicit approval.",
      "Started, completed, or date-specific service reservations.",
      "Buyer-caused wrong address, missing information, failure to receive delivery, or no-show cases.",
    ],
    contactBody: `The primary channel for return and cancellation requests is ${getRefundEmail()}. For general support, contact ${getContactEmail()} or call ${siteConfig.phone}.`,
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

export default async function ReturnAndCancellationPage() {
  const locale = await getLocale();
  const t = copy[locale];

  return (
    <LegalLayout description={t.description} locale={locale} note={t.note} title={t.title}>
      <LegalSection title={t.general.title}>
        <p>{t.general.body}</p>
        <BulletList items={[...t.general.items]} />
      </LegalSection>

      {t.scenarios.map((scenario) => (
        <LegalSection key={scenario.title} title={scenario.title}>
          <h3 className="text-lg font-semibold text-[#2f2623]">{scenario.cancelTitle}</h3>
          <p>{scenario.cancelBody}</p>
          <h3 className="text-lg font-semibold text-[#2f2623]">{scenario.refundTitle}</h3>
          {"refundItems" in scenario && scenario.refundItems ? (
            <BulletList items={[...scenario.refundItems]} />
          ) : (
            <p>{"refundBody" in scenario ? scenario.refundBody : ""}</p>
          )}
        </LegalSection>
      ))}

      <LegalSection title={`5. ${t.processTitle}`}>
        {t.processBodies.map((body) => (
          <p key={body}>{body}</p>
        ))}
      </LegalSection>

      <LegalSection title={`6. ${t.outsideTitle}`}>
        <BulletList items={[...t.outsideItems]} />
      </LegalSection>

      <LegalSection title={`7. ${t.contactTitle}`}>
        <p>{t.contactBody}</p>
      </LegalSection>
    </LegalLayout>
  );
}
