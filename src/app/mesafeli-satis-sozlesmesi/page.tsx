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
    metadataTitle: `Mesafeli Satış Sözleşmesi | ${brandName}`,
    metadataDescription:
      "Sipariş, ödeme, teslimat, cayma hakkı ve iade süreçlerine ilişkin mesafeli satış sözleşmesi şablonu.",
    title: "Mesafeli Satış Sözleşmesi",
    description: `${brandName} üzerinden verilen siparişlerde ürün veya hizmetin temel koşullarını, ödeme ve teslimat süreçlerini, cayma hakkını ve uyuşmazlık çözüm yollarını açıklar.`,
    note: "Bu metin örnek şablondur, hukuki danışmanlık niteliği taşımaz. Şirketinizin faaliyet alanı, ürün/hizmet tipi ve güncel mevzuat bakımından gerekirse hukuk uzmanına kontrol ettirilmelidir.",
    buyerInfo:
      "Alıcı bilgileri; sipariş formunda belirtilen ad soyad/unvan, teslimat adresi, telefon, e-posta ve fatura bilgileri esas alınarak belirlenir.",
    labels: {
      address: "Adres",
      brand: "Marka",
      email: "E-posta",
      kep: "KEP",
      mersis: "MERSİS No",
      phone: "Telefon",
      seller: "Satıcı / Sağlayıcı",
      taxNo: "Vergi No",
      taxOffice: "Vergi Dairesi",
    },
    sections: [
      {
        title: "1. Taraflar",
        body: "İşbu Mesafeli Satış Sözleşmesi, aşağıda bilgileri yer alan satıcı/sağlayıcı ile sipariş sırasında bilgilerini paylaşan alıcı/tüketici arasında elektronik ortamda kurulmuştur.",
      },
      {
        title: "2. Konu",
        body: `Sözleşmenin konusu, alıcının ${siteConfig.websiteUrl} internet sitesi üzerinden elektronik ortamda sipariş verdiği ${siteConfig.productType} niteliğindeki ürün veya hizmetin satışı, ifası, teslimi, ödeme koşulları ve tarafların hak ve yükümlülüklerinin belirlenmesidir.`,
      },
      {
        title: "3. Ürün / Hizmet Bilgisi",
        body: "Ürün veya hizmetin temel nitelikleri, satış bedeli, vergiler dahil toplam tutarı, teslimat veya ifa yöntemi, varsa ek masraflar ve siparişe özel seçenekler ödeme öncesinde alıcıya gösterilir. Alıcı, siparişi tamamlamadan önce bu bilgileri kontrol etmekle yükümlüdür.",
        items: [
          `Ürün/hizmet türü: ${siteConfig.productType}`,
          `Tahmini teslimat/ifa süresi: ${siteConfig.deliveryTime}`,
          "Stok, bölgesel teslimat uygunluğu veya hizmet takvimi sipariş onayı öncesinde kontrol edilebilir.",
        ],
        extra:
          "Dijital ürün, dijital içerik veya çevrim içi hizmet satışı yapılması halinde; erişim bağlantısı, hesap aktivasyonu, randevu bilgisi veya hizmet başlangıç zamanı alıcıya elektronik ortamda iletilebilir. Dijital içeriklerde hizmetin alıcının onayıyla anında başlaması cayma hakkı değerlendirmesini etkileyebilir.",
      },
      {
        title: "4. Sipariş ve Ödeme",
        body: "Alıcı, siparişini onaylayarak ürün/hizmet bilgilerini, toplam bedeli, teslimat veya ifa şartlarını ve bu sözleşmeyi okuyup kabul ettiğini beyan eder. Ödeme, sitede sunulan ödeme yöntemleriyle yapılır.",
        extra:
          "Kart ve ödeme aracı bilgileri, kullanılan ödeme altyapısına göre ödeme kuruluşu veya ilgili finansal kuruluş tarafından işlenebilir. Site, ödeme altyapısı sağlayıcısının güvenli ödeme ekranı üzerinden işlenen hassas kart verilerini doğrudan saklamayabilir.",
      },
      {
        title: "5. Teslimat / İfa",
        body: "Fiziksel ürünlerde teslimat, siparişte belirtilen adrese ve seçilen teslimat yöntemine göre yapılır. Teslimat süresi, ürünün hazırlanma koşulları, stok durumu, teslimat bölgesi ve taşıyıcı süreçlerine göre değişebilir.",
        extra:
          "Hizmet veya dijital içeriklerde ifa; randevu oluşturulması, hizmetin sunulması, erişim bilgilerinin gönderilmesi veya dijital içeriğin alıcıya açılması ile gerçekleşebilir. Dijital ürün veya hizmetlerde teslimat, fiziki kargo yerine elektronik posta, kullanıcı hesabı, indirme bağlantısı, çevrim içi toplantı bağlantısı veya benzer dijital kanallar üzerinden yapılabilir.",
      },
      {
        title: "6. Cayma Hakkı",
        body: `Alıcı, ilgili mevzuatta öngörülen hallerde, mal satışlarında ürünün tesliminden itibaren; hizmet satışlarında sözleşmenin kurulduğu tarihten itibaren on dört gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma bildirimi ${getRefundEmail()} adresine veya iletişim sayfasında yer alan kanallara yazılı olarak iletilebilir.`,
      },
      {
        title: "7. Cayma Hakkının İstisnaları",
        body: "Aşağıdaki hallerde, niteliğine göre cayma hakkı kullanılamayabilir veya sınırlı şekilde değerlendirilebilir:",
        items: [
          "Alıcının istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan ürünler.",
          "Çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler.",
          "Tesliminden sonra ambalaj, bant, mühür veya koruyucu unsur açılmış; sağlık veya hijyen açısından iadesi uygun olmayan ürünler.",
          "Elektronik ortamda anında ifa edilen hizmetler veya alıcının açık onayıyla teslim edilen dijital içerikler.",
          "Belirli bir tarih veya dönemde yapılması gereken konaklama, taşıma, yemek, eğlence, etkinlik, rezervasyon, randevu veya danışmanlık hizmetleri.",
          "İfasına başlanan ve tüketicinin onayıyla tamamlanan hizmetler.",
        ],
      },
      {
        title: "8. İade Süreci",
        body: `Cayma veya iade talebi uygun bulunduğunda, ürünün iade adresine gönderilmesi ya da hizmet/dijital içerik erişiminin iptal edilmesi gerekebilir. İade adresi: ${siteConfig.returnAddress}.`,
        extra:
          "İade edilecek tutar; ödeme yöntemi, ödeme kuruluşu ve banka süreçlerine bağlı olarak alıcının ödeme yaptığı araca yansıtılır. Ürün, hizmet veya kampanya koşullarına göre kargo, kurye, komisyon veya hizmet bedeli gibi kalemler ayrıca değerlendirilebilir.",
      },
      {
        title: "9. Uyuşmazlık Çözümü",
        body: "Taraflar, uyuşmazlıkların öncelikle iyi niyetli iletişim yoluyla çözülmesini hedefler. Çözüm sağlanamaması halinde alıcı, mevzuatta belirlenen parasal sınırlar dahilinde Tüketici Hakem Heyetlerine veya Tüketici Mahkemelerine başvurabilir.",
      },
      {
        title: "10. Yürürlük",
        body: "Alıcı, sipariş öncesi onay adımında bu sözleşmeyi okuyup kabul ederek elektronik ortamda yürürlüğe girmesini kabul eder. Sözleşme, siparişe ilişkin taraf yükümlülükleri tamamlanıncaya kadar geçerlidir.",
      },
    ],
  },
  en: {
    metadataTitle: `Distance Sales Agreement | ${brandName}`,
    metadataDescription:
      "Distance sales agreement template covering orders, payment, delivery, withdrawal rights, and returns.",
    title: "Distance Sales Agreement",
    description: `This agreement explains the core product or service terms, payment and delivery processes, withdrawal rights, and dispute resolution channels for orders placed through ${brandName}.`,
    note: "This text is a sample template and does not constitute legal advice. It should be reviewed by a legal professional where necessary according to your business activity, product/service type, and current legislation.",
    buyerInfo:
      "Buyer information is based on the name/title, delivery address, phone, email, and invoice information provided in the order form.",
    labels: {
      address: "Address",
      brand: "Brand",
      email: "Email",
      kep: "KEP",
      mersis: "MERSIS No",
      phone: "Phone",
      seller: "Seller / Provider",
      taxNo: "Tax No",
      taxOffice: "Tax Office",
    },
    sections: [
      {
        title: "1. Parties",
        body: "This Distance Sales Agreement is established electronically between the seller/provider whose details are listed below and the buyer/consumer who shares their details during the order process.",
      },
      {
        title: "2. Subject",
        body: `The subject of this agreement is the sale, performance, delivery, payment terms, and rights and obligations of the parties regarding the ${siteConfig.productType} ordered electronically by the buyer through ${siteConfig.websiteUrl}.`,
      },
      {
        title: "3. Product / Service Information",
        body: "The essential characteristics, sales price, total amount including taxes, delivery or performance method, additional costs if any, and order-specific options are shown to the buyer before payment. The buyer is responsible for checking this information before completing the order.",
        items: [
          `Product/service type: ${siteConfig.productType}`,
          `Estimated delivery/performance time: ${siteConfig.deliveryTime}`,
          "Stock, regional delivery eligibility, or service schedule may be checked before order confirmation.",
        ],
        extra:
          "For digital products, digital content, or online services, access links, account activation, appointment information, or service start time may be provided electronically. Immediate start of digital content with the buyer's approval may affect withdrawal right assessment.",
      },
      {
        title: "4. Order and Payment",
        body: "By confirming the order, the buyer declares that they have reviewed and accepted the product/service information, total price, delivery or performance terms, and this agreement. Payment is made through the methods offered on the site.",
        extra:
          "Card and payment instrument information may be processed by the payment institution or relevant financial institution depending on the payment infrastructure used. The site may not directly store sensitive card data processed through the secure payment screen of the payment provider.",
      },
      {
        title: "5. Delivery / Performance",
        body: "For physical products, delivery is made to the address stated in the order and according to the selected delivery method. Delivery time may vary based on preparation conditions, stock, delivery region, and carrier processes.",
        extra:
          "For services or digital content, performance may occur through appointment creation, service delivery, sending access details, or opening digital content to the buyer. Digital product or service delivery may be carried out via email, user account, download link, online meeting link, or similar digital channels instead of physical shipment.",
      },
      {
        title: "6. Right of Withdrawal",
        body: `Where provided by applicable law, the buyer may exercise the right of withdrawal within fourteen days from delivery for goods and from agreement establishment for services without stating any reason. The withdrawal notice may be sent in writing to ${getRefundEmail()} or through the contact channels on the contact page.`,
      },
      {
        title: "7. Exceptions to the Right of Withdrawal",
        body: "In the following cases, the right of withdrawal may not be available or may be assessed with limitations depending on the nature of the product/service:",
        items: [
          "Products prepared according to the buyer's requests or personal needs.",
          "Perishable products or products that may expire quickly.",
          "Products unsuitable for return for health or hygiene reasons after packaging, seal, tape, or protective elements are opened.",
          "Services performed instantly electronically or digital content delivered with the buyer's explicit approval.",
          "Accommodation, transport, food, entertainment, event, reservation, appointment, or consulting services required on a specific date or period.",
          "Services started and completed with the consumer's approval.",
        ],
      },
      {
        title: "8. Return Process",
        body: `If a withdrawal or return request is accepted, the product may need to be sent to the return address or service/digital content access may need to be cancelled. Return address: ${siteConfig.returnAddress}.`,
        extra:
          "The amount to be refunded is reflected to the payment instrument used by the buyer depending on the payment method, payment provider, and bank processes. Shipping, courier, commission, or service fees may be evaluated separately according to product, service, or campaign conditions.",
      },
      {
        title: "9. Dispute Resolution",
        body: "The parties aim to resolve disputes first through good-faith communication. If no resolution is reached, the buyer may apply to consumer arbitration committees or consumer courts within the monetary limits set by applicable legislation.",
      },
      {
        title: "10. Effectiveness",
        body: "By reading and accepting this agreement at the pre-order approval step, the buyer accepts that it enters into force electronically. The agreement remains valid until the obligations related to the order are fulfilled.",
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

export default async function DistanceSalesAgreementPage() {
  const locale = await getLocale();
  const t = copy[locale];

  return (
    <LegalLayout description={t.description} locale={locale} note={t.note} title={t.title}>
      {t.sections.map((section, index) => (
        <LegalSection key={section.title} title={section.title}>
          <p>{section.body}</p>
          {index === 0 ? (
            <>
              <dl className="grid gap-3 rounded-2xl bg-[#fff8f3] p-5 text-sm sm:grid-cols-2">
                <Info label={t.labels.seller} value={siteConfig.companyName} />
                <Info label={t.labels.brand} value={siteConfig.brandName} />
                <Info label={t.labels.address} value={siteConfig.address} />
                <Info label={t.labels.email} value={getContactEmail()} />
                <Info label={t.labels.phone} value={siteConfig.phone} />
                <Info label={t.labels.taxOffice} value={siteConfig.taxOffice} />
                <Info label={t.labels.taxNo} value={siteConfig.taxNumber} />
                <Info label={t.labels.mersis} value={siteConfig.mersisNo} />
                <Info label={t.labels.kep} value={siteConfig.kepAddress} />
              </dl>
              <p>{t.buyerInfo}</p>
            </>
          ) : null}
          {"items" in section && section.items ? <BulletList items={[...section.items]} /> : null}
          {"extra" in section && section.extra ? <p>{section.extra}</p> : null}
        </LegalSection>
      ))}
    </LegalLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[#aa2e28]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-[#3c302d]">{value}</dd>
    </div>
  );
}
