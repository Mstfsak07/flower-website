import type {
  Category,
  ContentPage,
  Coupon,
  DeliveryZone,
  HeroSlide,
  Order,
  Product,
  SiteSettings,
  VisualExperienceConfig,
  WholesaleInquiry,
} from "@/lib/types";
import type { Locale } from "@/lib/locale";

export const siteSettings: SiteSettings = {
  storeName: "Iris Atalier",
  phone: "0 (532) 456 78 90",
  whatsapp: "+905324567890",
  address: "Konyaalti / Antalya",
  instagram: "https://instagram.com/irisatalier",
  facebook: "https://facebook.com/irisatalier",
  deliveryCutoffHour: 15,
  defaultDeliveryFee: 120,
  seoTitle: "Iris Atalier | Yerel cicekciden premium siparis deneyimi",
  seoDescription:
    "Buket, premium aranjman, saksi cicegi ve etkinlik tasarimlari icin Iris Atalier'den dogrudan siparis.",
};

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "Uygun fiyatli cicekler, yerel cicekciden dogrudan kapiniza",
    subtitle:
      "Tekli gul, buket, ozel gun tasarimlari ve toptan siparis secenekleriyle hizli teslimat.",
    imageUrl:
      "https://images.unsplash.com/photo-1526397751294-331021109fbd?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Alisverise Basla",
    ctaUrl: "/kategori/mini-buketler",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "hero-2",
    title: "Nisan, dugun ve mekan dekorasyonu icin toptan teklif al",
    subtitle:
      "Kafe, otel, ajans ve organizasyonlar icin hizli teklif, net teslimat ve esnek butce planlamasi.",
    imageUrl:
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Toptan Teklif Al",
    ctaUrl: "/toptan",
    isActive: true,
    sortOrder: 2,
  },
];

export const visualExperienceConfigs: VisualExperienceConfig[] = [
  {
    id: "visual-1",
    key: "motionIntensity",
    value: "balanced",
    description: "Motion siddeti: calm, balanced, expressive",
  },
  {
    id: "visual-2",
    key: "enable3DHero",
    value: "false",
    description: "Faz 1'de gercek 3D kapali, hero 3D-ready kuruldu.",
  },
  {
    id: "visual-3",
    key: "enableParallax",
    value: "true",
    description: "Ana sayfada hafif katmanli hareket etkisi aktif.",
  },
  {
    id: "visual-4",
    key: "enableGlassmorphism",
    value: "true",
    description: "Cam kartlar ve yumusak blur paneller aktif.",
  },
  {
    id: "visual-5",
    key: "reducedEffectsOnMobile",
    value: "true",
    description: "Mobil ve reduced motion senaryolarinda efekt azalt.",
  },
  {
    id: "visual-6",
    key: "heroSceneVariant",
    value: "petal-orbit",
    description: "Faz 2'de gercek 3D eklendiginde kullanilacak hero varyanti.",
  },
  {
    id: "visual-7",
    key: "defaultThemeMode",
    value: "light-premium",
    description: "Varsayilan vitrinin ton karakteri.",
  },
];

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Tekli Guller",
    slug: "tekli-guller",
    description: "Minimal, temiz ve ekonomik gonderimler icin tekli gul secenekleri.",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "cat-2",
    name: "Mini Buketler",
    slug: "mini-buketler",
    description: "Gunluk gonderimler ve hizli surprizler icin uygun fiyatli mini buketler.",
    imageUrl:
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "cat-3",
    name: "Orta Boy Buketler",
    slug: "orta-boy-buketler",
    description: "Dogum gunu ve kutlamalar icin dengeli hacimde buket tasarimlari.",
    imageUrl:
      "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "cat-4",
    name: "Premium Buketler",
    slug: "premium-buketler",
    description: "Daha zengin tasarim, daha gosterisli sunum ve ozel gun odakli secimler.",
    imageUrl:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "cat-5",
    name: "Saksi Cicekleri",
    slug: "saksi-cicekleri",
    description: "Uzun omurlu hediye arayanlar icin bakimi kolay saksili turler.",
    imageUrl:
      "https://images.unsplash.com/photo-1487537023671-8dce1a785863?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "cat-6",
    name: "Toptan Etkinlik Cicekleri",
    slug: "toptan-etkinlik-cicekleri",
    description: "Mekan suslemesi, etkinlik ve kurumsal alimlar icin toplu cicek setleri.",
    imageUrl:
      "https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad1?auto=format&fit=crop&w=800&q=80",
    isActive: true,
    sortOrder: 6,
  },
];

const categoryTranslations: Partial<Record<Category["slug"], { name: string; description: string }>> = {
  "tekli-guller": {
    name: "Single Roses",
    description: "Single rose options for minimal, clean, and affordable gifting.",
  },
  "mini-buketler": {
    name: "Mini Bouquets",
    description: "Affordable mini bouquets for everyday deliveries and quick surprises.",
  },
  "orta-boy-buketler": {
    name: "Medium Bouquets",
    description: "Balanced bouquet designs for birthdays and celebrations.",
  },
  "premium-buketler": {
    name: "Premium Bouquets",
    description: "Richer designs and elevated presentations for meaningful occasions.",
  },
  "saksi-cicekleri": {
    name: "Potted Plants",
    description: "Easy-care potted gifts for those who want something longer lasting.",
  },
  "toptan-etkinlik-cicekleri": {
    name: "Wholesale Event Flowers",
    description: "Bulk floral sets for venues, events, and corporate purchases.",
  },
};

const productTranslations: Partial<Record<Product["slug"], Pick<Product, "name" | "shortDescription" | "description">>> = {
  "gul-buketi": {
    name: "Rose Bouquet",
    shortDescription: "A classic red rose bouquet with a clean and elegant presentation.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "pembe-gul-buketi": {
    name: "Pink Rose Bouquet",
    shortDescription: "A romantic and elegant bouquet prepared with soft pink roses.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "karanfil-buketi": {
    name: "Carnation Bouquet",
    shortDescription: "A fresh and vibrant carnation bouquet, durable and graceful.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "papatya-buketi": {
    name: "Daisy Bouquet",
    shortDescription: "A bouquet carefully arranged with fresh field daisies.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "sardunya-buketi": {
    name: "Geranium Bouquet",
    shortDescription: "A special geranium arrangement that stands out with warm tones.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "begonya-buketi": {
    name: "Begonia Bouquet",
    shortDescription: "A begonia bouquet highlighted by elegant leaves and refined tones.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "lavanta-buketi": {
    name: "Lavender Bouquet",
    shortDescription: "A fragrant fresh lavender bouquet with a calming presence.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "petunya-buketi": {
    name: "Petunia Bouquet",
    shortDescription: "A cheerful bouquet built from lively petunia blooms.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "kalanso-buketi": {
    name: "Kalanchoe Bouquet",
    shortDescription: "A kalanchoe arrangement with compact, vivid blossoms.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
  "menekse-buketi": {
    name: "Violet Bouquet",
    shortDescription: "A nostalgic bouquet arranged with delicate violets.",
    description: "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.",
  },
};

export function getLocalizedCategory(category: Category, locale: Locale): Category {
  if (locale === "tr") {
    return category;
  }

  const translation = categoryTranslations[category.slug];
  if (!translation) {
    return category;
  }

  return {
    ...category,
    ...translation,
  };
}

export function getLocalizedProduct(product: Product, locale: Locale): Product {
  if (locale === "tr") {
    return product;
  }

  const translation = productTranslations[product.slug];
  const name = translation?.name ?? product.name;

  return {
    ...product,
    ...translation,
    badges: product.badges?.map((badge) => translateProductBadge(badge)),
    images: product.images.map((image) => ({
      ...image,
      altText: name,
    })),
    options: product.options.map((option) => ({
      ...option,
      name: translateProductOptionName(option.name),
      values: option.values?.map((value) => ({
        ...value,
        value: translateProductOptionValue(value.value),
      })),
    })),
    variants: product.variants.map((variant) => ({
      ...variant,
      name: translateProductOptionName(variant.name),
      value: translateProductOptionValue(variant.value),
    })),
  };
}

function translateProductBadge(value: string) {
  const translations: Record<string, string> = {
    "Cok Satan": "Best Seller",
    Gunluk: "Everyday",
    Klasik: "Classic",
    Mevsimsel: "Seasonal",
    "Uzun Omurlu": "Long Lasting",
    Zarif: "Elegant",
  };

  return translations[value] ?? value;
}

function translateProductOptionName(value: string) {
  const translations: Record<string, string> = {
    Boyut: "Size",
    "Kart Ekle": "Add Card",
    "Kurdele Rengi": "Ribbon Color",
  };

  return translations[value] ?? value;
}

function translateProductOptionValue(value: string) {
  const translations: Record<string, string> = {
    "Ada cay yesili": "Sage Green",
    Buyuk: "Large",
    "Gul kurusu": "Dusty Rose",
    Krem: "Cream",
    Kucuk: "Small",
    Orta: "Medium",
  };

  return translations[value] ?? value;
}

function product(
  id: string,
  name: string,
  slug: string,
  categoryId: string,
  basePrice: number,
  compareAtPrice: number | undefined,
  imageUrl: string,
  shortDescription: string,
  badges: string[],
): Product {
  const detailImageUrl = imageUrl.includes("?") ? `${imageUrl}&sat=-15` : imageUrl;

  return {
    id,
    name,
    slug,
    shortDescription,
    description:
      "Taze gunluk cicek secimi, ayni gun hazirlama opsiyonu ve teslimat bolgesi kontrolu ile hazirlanan urun. Kart notu, teslimat saati ve varyant secimi desteklenir.",
    sku: `SKU-${id.toUpperCase()}`,
    basePrice,
    compareAtPrice,
    costPrice: Math.round(basePrice * 0.62),
    isActive: true,
    isFeatured: ["p1", "p6", "p10", "p12"].includes(id),
    stockTracking: true,
    stockQuantity: 12 + Number(id.replace("p", "")),
    minPreparationHours: 2,
    categoryId,
    images: [
      {
        id: `${id}-img-1`,
        imageUrl,
        altText: name,
        sortOrder: 1,
      },
      {
        id: `${id}-img-2`,
        imageUrl: detailImageUrl,
        altText: `${name} detay`,
        sortOrder: 2,
      },
    ],
    variants: [
      {
        id: `${id}-small`,
        name: "Boyut",
        value: "Kucuk",
        priceDelta: 0,
        stockQuantity: 8,
        sku: `${id}-S`,
        isActive: true,
      },
      {
        id: `${id}-medium`,
        name: "Boyut",
        value: "Orta",
        priceDelta: 120,
        stockQuantity: 10,
        sku: `${id}-M`,
        isActive: true,
      },
      {
        id: `${id}-large`,
        name: "Boyut",
        value: "Buyuk",
        priceDelta: 260,
        stockQuantity: 6,
        sku: `${id}-L`,
        isActive: true,
      },
    ],
    options: [
      {
        id: `${id}-opt-ribbon`,
        name: "Kurdele Rengi",
        type: "SELECT",
        isRequired: false,
        values: [
          { id: `${id}-white`, value: "Krem", priceDelta: 0 },
          { id: `${id}-rose`, value: "Gul kurusu", priceDelta: 20 },
          { id: `${id}-green`, value: "Ada cay yesili", priceDelta: 20 },
        ],
      },
      {
        id: `${id}-opt-card`,
        name: "Kart Ekle",
        type: "BOOLEAN",
        isRequired: false,
      },
    ],
    deliveryZoneIds: ["zone-1", "zone-2", "zone-3"],
    badges,
  };
}

export const products: Product[] = [
  product(
    "p1",
    "Gül Buketi",
    "gul-buketi",
    "cat-2",
    450,
    undefined,
    "/products/rose-classic.jpg",
    "Standart kırmızı gül buketi, sade ve şık bir gönderim seçeneği.",
    ["Cok Satan", "Klasik"],
  ),
  product(
    "p10",
    "Pembe Gül Buketi",
    "pembe-gul-buketi",
    "cat-2",
    480,
    undefined,
    "/products/rose-pastel.jpg",
    "Zarif pembe güllerden hazırlanmış romantik ve şık buket.",
    ["Zarif", "Mevsimsel"],
  ),
  product(
    "p2",
    "Karanfil Buketi",
    "karanfil-buketi",
    "cat-2",
    250,
    undefined,
    "/products/mixed-delicate.jpg",
    "Taze ve canlı renkli karanfil buketi, dayanıklı ve zarif.",
    ["Gunluk"],
  ),
  product(
    "p3",
    "Papatya Buketi",
    "papatya-buketi",
    "cat-2",
    300,
    undefined,
    "/products/white-daisies.jpg",
    "Doğal ve taze kır papatyalarından özenle hazırlanmış buket.",
    ["Klasik"],
  ),
  product(
    "p4",
    "Sardunya Buketi",
    "sardunya-buketi",
    "cat-2",
    350,
    undefined,
    "/products/rose-soft.jpg",
    "Sıcak renkleriyle dikkat çeken özel sardunya aranjmanı.",
    ["Mevsimsel"],
  ),
  product(
    "p5",
    "Begonya Buketi",
    "begonya-buketi",
    "cat-2",
    380,
    undefined,
    "/products/mixed-delicate.jpg",
    "Zarif yaprakları ve renkleriyle öne çıkan begonya buketi.",
    ["Zarif"],
  ),
  product(
    "p6",
    "Lavanta Buketi",
    "lavanta-buketi",
    "cat-2",
    420,
    undefined,
    "/products/lavender-bouquet.jpg",
    "Mis kokulu, sakinleştirici etkiye sahip taze lavanta buketi.",
    ["Uzun Omurlu", "Zarif"],
  ),
  product(
    "p7",
    "Petunya Buketi",
    "petunya-buketi",
    "cat-2",
    340,
    undefined,
    "/products/violet-cluster.jpg",
    "Canlı petunya çiçeklerinden oluşan renkli ve neşeli buket.",
    ["Mevsimsel"],
  ),
  product(
    "p8",
    "Kalanşo Buketi",
    "kalanso-buketi",
    "cat-2",
    280,
    undefined,
    "/products/rose-soft.jpg",
    "Küçük ve canlı çiçekleriyle kalanşo (kalanchoe) aranjmanı.",
    ["Uzun Omurlu"],
  ),
  product(
    "p9",
    "Menekşe Buketi",
    "menekse-buketi",
    "cat-2",
    360,
    undefined,
    "/products/violet-cluster.jpg",
    "Tatlı ve narin menekşelerden hazırlanmış nostaljik buket.",
    ["Klasik"],
  ),
];

export const featuredProducts = products.filter((product) => product.isFeatured);

export const deliveryZones: DeliveryZone[] = [
  {
    id: "zone-1",
    name: "Merkez Bolge",
    city: "Istanbul",
    district: "Kadikoy",
    fee: 90,
    minDeliveryHours: 2,
    sameDayAvailable: true,
    cutoffHour: 16,
    isActive: true,
  },
  {
    id: "zone-2",
    name: "Anadolu Yakasi Genis Alan",
    city: "Istanbul",
    district: "Uskudar",
    fee: 120,
    minDeliveryHours: 3,
    sameDayAvailable: true,
    cutoffHour: 15,
    isActive: true,
  },
  {
    id: "zone-3",
    name: "Organizasyon Teslimati",
    city: "Istanbul",
    district: "Besiktas",
    fee: 180,
    minDeliveryHours: 6,
    sameDayAvailable: false,
    cutoffHour: 12,
    isActive: true,
  },
];

export const coupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "HOSGELDIN10",
    type: "PERCENT",
    value: 10,
    minOrderAmount: 750,
    maxDiscountAmount: 200,
    usageLimit: 100,
    usedCount: 12,
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    isActive: true,
  },
  {
    id: "coupon-2",
    code: "ETKINLIK250",
    type: "FIXED",
    value: 250,
    minOrderAmount: 2500,
    usageLimit: 50,
    usedCount: 4,
    startsAt: "2026-01-01T00:00:00.000Z",
    endsAt: "2026-12-31T23:59:59.000Z",
    isActive: true,
  },
];

export const seedOrders: Order[] = [
  {
    id: "order-cleimp-test-1",
    orderNumber: "CK-26042101",
    status: "PREPARING",
    paymentStatus: "PAID",
    paymentMethod: "CARD",
    subtotal: 480,
    discountTotal: 0,
    deliveryFee: 90,
    grandTotal: 570,
    customerName: "Cleimp Test",
    customerPhone: "05550000000",
    customerEmail: "cleimp.twich@gmail.com",
    recipientName: "Cleimp Test",
    recipientPhone: "05550000000",
    deliveryDate: "2026-04-22",
    deliverySlot: "12:00 - 15:00",
    cardMessage: "Test siparişidir.",
    note: "Admin ve hesap ekranı testi için eklendi.",
    addressSnapshotJson:
      '{"city":"İstanbul","district":"Kadıköy","neighborhood":"Merkez","addressLine":"Test Mah. Deneme Sok. No:1"}',
    items: [
      {
        id: "order-cleimp-test-1-item-1",
        productId: "p10",
        productName: "Pembe Gül Buketi",
        variantName: "Standart",
        quantity: 1,
        unitPrice: 480,
        totalPrice: 480,
      },
    ],
    createdAt: "2026-04-21T10:00:00.000Z",
    updatedAt: "2026-04-21T10:00:00.000Z",
  },
  {
    id: "order-1",
    orderNumber: "CK-24041101",
    status: "PREPARING",
    paymentStatus: "PAID",
    paymentMethod: "CARD",
    subtotal: 980,
    discountTotal: 98,
    deliveryFee: 90,
    grandTotal: 972,
    customerName: "Melis Koc",
    customerPhone: "05324567890",
    customerEmail: "melis@example.com",
    recipientName: "Sena Koc",
    recipientPhone: "05324567811",
    deliveryDate: "2026-04-18",
    deliverySlot: "12:00 - 15:00",
    cardMessage: "Iyi ki dogdun.",
    note: "Apartman girisinden ara.",
    addressSnapshotJson:
      '{"city":"Istanbul","district":"Kadikoy","neighborhood":"Suadiye","addressLine":"Bagdat Cd. No:45"}',
    couponCode: "HOSGELDIN10",
    items: [
      {
        id: "order-1-item-1",
        productId: "p3",
        productName: "Beyaz Zarafet Buketi",
        variantName: "Orta",
        quantity: 1,
        unitPrice: 980,
        totalPrice: 980,
      },
    ],
    createdAt: "2026-04-18T09:10:00.000Z",
    updatedAt: "2026-04-18T10:15:00.000Z",
  },
  {
    id: "order-2",
    orderNumber: "CK-24041072",
    status: "OUT_FOR_DELIVERY",
    paymentStatus: "PAID",
    paymentMethod: "BANK_TRANSFER",
    subtotal: 1590,
    discountTotal: 0,
    deliveryFee: 120,
    grandTotal: 1710,
    customerName: "Ece Tunar",
    customerPhone: "05321114455",
    customerEmail: "ece@example.com",
    recipientName: "Aylin Tunar",
    recipientPhone: "05321114466",
    deliveryDate: "2026-04-18",
    deliverySlot: "15:00 - 18:00",
    cardMessage: "Yeni isinde basarilar.",
    note: "",
    addressSnapshotJson:
      '{"city":"Istanbul","district":"Uskudar","neighborhood":"Altunizade","addressLine":"Kislaonu Sok. No:4"}',
    items: [
      {
        id: "order-2-item-1",
        productId: "p4",
        productName: "Sampanya Ton Premium Tasarim",
        variantName: "Buyuk",
        quantity: 1,
        unitPrice: 1590,
        totalPrice: 1590,
      },
    ],
    createdAt: "2026-04-17T14:20:00.000Z",
    updatedAt: "2026-04-18T11:00:00.000Z",
  },
];

export const seedInquiries: WholesaleInquiry[] = [
  {
    id: "inq-1",
    companyName: "Mavi Ajans",
    fullName: "Zeynep Yildiz",
    phone: "05345556677",
    email: "zeynep@maviajans.com",
    eventType: "Lansman",
    eventDate: "2026-05-02",
    quantity: 50,
    budget: 18000,
    city: "Istanbul",
    district: "Besiktas",
    details: "Sahne ve masa ustu duzenlemeleri gerekiyor.",
    status: "REVIEWING",
    createdAt: "2026-04-16T10:00:00.000Z",
    updatedAt: "2026-04-17T09:30:00.000Z",
  },
  {
    id: "inq-2",
    companyName: "Perla Hotel",
    fullName: "Mert Dogan",
    phone: "05346667788",
    email: "mert@perlahotel.com",
    eventType: "Lobi ve restoran haftalik duzenleme",
    eventDate: "2026-04-25",
    quantity: 20,
    budget: 9000,
    city: "Istanbul",
    district: "Sisli",
    details: "Haftalik taze cicek rotasyonu icin fiyat teklifi istiyoruz.",
    status: "QUOTED",
    createdAt: "2026-04-15T13:00:00.000Z",
    updatedAt: "2026-04-16T18:15:00.000Z",
  },
];

export const contentPages: ContentPage[] = [
  {
    id: "content-1",
    title: "Gizlilik Politikasi",
    slug: "gizlilik-politikasi",
    seoTitle: "Gizlilik Politikasi | Iris Atalier",
    seoDescription: "Kisisel verilerin islenmesi ve korunmasina dair bilgilendirme.",
    isPublished: true,
    content:
      "Iris Atalier, siparis ve iletisim sureclerinde paylasilan bilgileri sadece hizmetin sunulmasi, siparis takibi ve yasal zorunluluklar kapsaminda kullanir. Veriler izinsiz ucuncu taraflarla pazarlama amacli paylasilmaz.",
  },
  {
    id: "content-2",
    title: "Mesafeli Satis Sozlesmesi",
    slug: "mesafeli-satis-sozlesmesi",
    seoTitle: "Mesafeli Satis Sozlesmesi | Iris Atalier",
    seoDescription: "Siparis, teslimat ve cayma sartlarini aciklayan sozlesme.",
    isPublished: true,
    content:
      "Siparis olusturuldugunda, urun bilgileri, teslimat tarihi, odeme sekli ve toplam tutar kullaniciya acik bicimde sunulur. Canli urunlerin dogasi geregi cayma ve iade kosullari urun ozelinde degisebilir.",
  },
  {
    id: "content-3",
    title: "On Bilgilendirme Formu",
    slug: "on-bilgilendirme-formu",
    seoTitle: "On Bilgilendirme Formu | Iris Atalier",
    seoDescription: "Siparis oncesi temel bilgilendirme ozeti.",
    isPublished: true,
    content:
      "Magaza unvani, iletisim bilgileri, teslimat kapsami, urun nitelikleri, toplam bedel ve odeme sekli siparis oncesi kullaniciya gosterilir. Siparisin tamamlanmasiyla bu bilgilendirme kabul edilmis sayilir.",
  },
  {
    id: "content-4",
    title: "Teslimat ve Iade",
    slug: "teslimat-ve-iade",
    seoTitle: "Teslimat ve Iade | Iris Atalier",
    seoDescription: "Teslimat saatleri, iade ve iptal kosullari.",
    isPublished: true,
    content:
      "Ayni gun teslimat uygunlugunda siparisler cutoff saatine kadar ayni gun cikar. Canli urunler nedeniyle teslim edildi statulu siparislerde iade politikasi kalite sorunu veya hasar durumlariyla sinirlidir.",
  },
];

export const faqs = [
  {
    question: "Ayni gun teslimat var mi?",
    answer:
      "Kadikoy ve yakin bolgelerde saat 15:00'e kadar verilen siparislerde ayni gun teslimat sunuyoruz.",
  },
  {
    question: "Kart notu ekleyebilir miyim?",
    answer:
      "Evet. Urun detayinda ve checkout ekraninda kisa bir kart notu ekleyebilirsin.",
  },
  {
    question: "Toptan taleplere ne kadar surede donuyorsunuz?",
    answer:
      "Calisma saatleri icindeki taleplere genelde 1-2 saat icinde geri donuyoruz.",
  },
  {
    question: "Kapida odeme var mi?",
    answer:
      "MVP asamasinda secili bolgelerde kapida odeme ve havale secenekleri desteklenir.",
  },
];

export const trustHighlights = [
  "Yerel cicekciden dogrudan fiyatlama",
  "Ayni gun veya planli teslimat secenekleri",
  "WhatsApp destek hatti gorunur",
  "Bireysel ve toptan alim icin tek platform",
];

export const routeMap = [
  "/",
  "/arama",
  "/kategori/[slug]",
  "/urun/[slug]",
  "/sepet",
  "/odeme",
  "/siparis-basarili",
  "/siparis-takip",
  "/toptan",
  "/admin",
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(slug: string) {
  const category = getCategoryBySlug(slug);
  if (!category) {
    return [];
  }

  return products.filter((product) => product.categoryId === category.id);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getCategoryById(id: string) {
  return categories.find((category) => category.id === id);
}

export function getSimilarProducts(product: Product) {
  return products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 3);
}

export function getContentPage(slug: string) {
  return contentPages.find((page) => page.slug === slug);
}
