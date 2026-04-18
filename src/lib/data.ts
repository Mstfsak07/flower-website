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

export const siteSettings: SiteSettings = {
  storeName: "Luna Cicek",
  phone: "0 (532) 456 78 90",
  whatsapp: "+905324567890",
  address: "Bagdat Caddesi No: 112, Caddebostan / Istanbul",
  instagram: "https://instagram.com/lunacicek",
  facebook: "https://facebook.com/lunacicek",
  deliveryCutoffHour: 15,
  defaultDeliveryFee: 120,
  seoTitle: "Luna Cicek | Yerel cicekciden uygun fiyatli siparis",
  seoDescription:
    "Buket, tekli gul, saksi cicegi ve toptan etkinlik cicekleri icin yerel cicekciden dogrudan siparis.",
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
    isFeatured: id === "p1" || id === "p3" || id === "p5" || id === "p8",
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
        imageUrl: `${imageUrl}&sat=-15`,
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
    "Yumusak Pembe Mini Buket",
    "yumusak-pembe-mini-buket",
    "cat-2",
    690,
    790,
    "https://images.unsplash.com/photo-1526397751294-331021109fbd?auto=format&fit=crop&w=900&q=80",
    "Pudra tonlarinda gul ve cipso ile gunluk surprizler icin hafif bir secim.",
    ["Ayni Gun", "Cok Satan"],
  ),
  product(
    "p2",
    "Kirmizi Gul Uclusu",
    "kirmizi-gul-uclusu",
    "cat-1",
    490,
    undefined,
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    "Kisa notlu, sade ve ekonomik kirmizi gul gonderimi.",
    ["Ekonomik"],
  ),
  product(
    "p3",
    "Beyaz Zarafet Buketi",
    "beyaz-zarafet-buketi",
    "cat-3",
    980,
    1120,
    "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=900&q=80",
    "Lisyantus ve beyaz gul karisimiyla temiz, sakin bir sunum.",
    ["Yeni"],
  ),
  product(
    "p4",
    "Sampanya Ton Premium Tasarim",
    "sampanya-ton-premium-tasarim",
    "cat-4",
    1590,
    1790,
    "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=80",
    "Gosterisli sunum arayanlar icin premium dokulu ozel tasarim.",
    ["Premium"],
  ),
  product(
    "p5",
    "Baris Zambagi Saksisi",
    "baris-zambagi-saksisi",
    "cat-5",
    890,
    undefined,
    "https://images.unsplash.com/photo-1487537023671-8dce1a785863?auto=format&fit=crop&w=900&q=80",
    "Uzun omurlu, ofis ve ev icin bakimi kolay saksili bitki.",
    ["Uzun Omurlu"],
  ),
  product(
    "p6",
    "Etkinlik Masasi Cicek Seti",
    "etkinlik-masasi-cicek-seti",
    "cat-6",
    2450,
    2850,
    "https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad1?auto=format&fit=crop&w=900&q=80",
    "Toplu alimlar icin standart olculu masa ustu cicek seti.",
    ["Toptan"],
  ),
  product(
    "p7",
    "Mini Lale Demeti",
    "mini-lale-demeti",
    "cat-2",
    720,
    undefined,
    "https://images.unsplash.com/photo-1494336934272-fd6f3d63d5e3?auto=format&fit=crop&w=900&q=80",
    "Mevsimsel lale renkleriyle yumusak ve zarif bir jest.",
    ["Mevsimsel"],
  ),
  product(
    "p8",
    "Somon Gul Kutusu",
    "somon-gul-kutusu",
    "cat-4",
    1380,
    1510,
    "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80",
    "Kutulu premium sunumla daha duzenli ve kurumsal bir hediye secenegi.",
    ["Kurumsal"],
  ),
  product(
    "p9",
    "Lavanta Dokulu Buket",
    "lavanta-dokulu-buket",
    "cat-3",
    940,
    undefined,
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80",
    "Dogal tonlari sevenler icin lavanta esintili rahat buket.",
    ["Ayni Gun"],
  ),
  product(
    "p10",
    "Orkide Duo",
    "orkide-duo",
    "cat-5",
    1260,
    1390,
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80",
    "Minimal ic mekanlar icin ikili orkide sunumu.",
    ["Ofis"],
  ),
  product(
    "p11",
    "Yedi Gul Romantik Paket",
    "yedi-gul-romantik-paket",
    "cat-1",
    860,
    940,
    "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
    "Daha etkili ama hala ulasilabilir bir gul gonderimi.",
    ["Kampanyali"],
  ),
  product(
    "p12",
    "Nisan Tagi Baslangic Paketi",
    "nisan-tagi-baslangic-paketi",
    "cat-6",
    3200,
    undefined,
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
    "Kucuk olcekli organizasyonlar icin ekonomik paketleme.",
    ["Etkinlik"],
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
    seoTitle: "Gizlilik Politikasi | Luna Cicek",
    seoDescription: "Kisisel verilerin islenmesi ve korunmasina dair bilgilendirme.",
    isPublished: true,
    content:
      "Luna Cicek, siparis ve iletisim sureclerinde paylasilan bilgileri sadece hizmetin sunulmasi, siparis takibi ve yasal zorunluluklar kapsaminda kullanir. Veriler izinsiz ucuncu taraflarla pazarlama amacli paylasilmaz.",
  },
  {
    id: "content-2",
    title: "Mesafeli Satis Sozlesmesi",
    slug: "mesafeli-satis-sozlesmesi",
    seoTitle: "Mesafeli Satis Sozlesmesi | Luna Cicek",
    seoDescription: "Siparis, teslimat ve cayma sartlarini aciklayan sozlesme.",
    isPublished: true,
    content:
      "Siparis olusturuldugunda, urun bilgileri, teslimat tarihi, odeme sekli ve toplam tutar kullaniciya acik bicimde sunulur. Canli urunlerin dogasi geregi cayma ve iade kosullari urun ozelinde degisebilir.",
  },
  {
    id: "content-3",
    title: "On Bilgilendirme Formu",
    slug: "on-bilgilendirme-formu",
    seoTitle: "On Bilgilendirme Formu | Luna Cicek",
    seoDescription: "Siparis oncesi temel bilgilendirme ozeti.",
    isPublished: true,
    content:
      "Magaza unvani, iletisim bilgileri, teslimat kapsami, urun nitelikleri, toplam bedel ve odeme sekli siparis oncesi kullaniciya gosterilir. Siparisin tamamlanmasiyla bu bilgilendirme kabul edilmis sayilir.",
  },
  {
    id: "content-4",
    title: "Teslimat ve Iade",
    slug: "teslimat-ve-iade",
    seoTitle: "Teslimat ve Iade | Luna Cicek",
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
