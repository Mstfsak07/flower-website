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
import { buildCategories, categoryTranslationsEn, productOccasions } from "@/lib/category-taxonomy";
import { antalyaDeliveryZoneIds, antalyaDeliveryZones } from "@/lib/delivery-regions";

export const siteSettings: SiteSettings = {
  storeName: "Riva Çiçekçilik",
  phone: "0 (532) 456 78 90",
  whatsapp: "+905324567890",
  address: "Konyaalti / Antalya",
  instagram: "https://instagram.com/rivacicekantalya",
  facebook: "https://facebook.com/rivacicekantalya",
  deliveryCutoffHour: 15,
  defaultDeliveryFee: 120,
  seoTitle: "Riva Çiçekçilik | Yerel cicekciden premium siparis deneyimi",
  seoDescription:
    "Buket, premium aranjman, saksi cicegi ve etkinlik tasarimlari icin Riva Çiçekçilik'ten dogrudan siparis.",
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
    ctaUrl: "/kategori/buketler",
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

export const categories: Category[] = buildCategories();

const categoryTranslations: Partial<Record<Category["slug"], { name: string; description: string }>> =
  categoryTranslationsEn;

const enDefaultDescription =
  "Prepared with fresh daily flowers, same-day production options, and delivery-zone validation. Supports card notes, delivery slot selection, and variant choices.";

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
  "kutuda-pembe-guller": {
    name: "Pink Roses in a Box",
    shortDescription: "Pink roses presented in an elegant box, a graceful surprise for loved ones.",
    description: enDefaultDescription,
  },
  "sepette-renkli-papatyalar": {
    name: "Colorful Daisies in a Basket",
    shortDescription: "A cheerful, colorful daisy arrangement in a woven basket.",
    description: enDefaultDescription,
  },
  "vazoda-karisik-mevsim-cicekleri": {
    name: "Mixed Seasonal Flowers in a Vase",
    shortDescription: "An arrangement of the season's freshest flowers in a glass vase.",
    description: enDefaultDescription,
  },
  "solmayan-kirmizi-gul-kutusu": {
    name: "Preserved Red Rose Box",
    shortDescription: "Specially preserved red roses that stay beautiful for years.",
    description: enDefaultDescription,
  },
  "solmayan-pembe-gul-kutusu": {
    name: "Preserved Pink Rose Box",
    shortDescription: "Pink roses in an elegant box that never wilt.",
    description: enDefaultDescription,
  },
  "saksida-sardunya": {
    name: "Potted Geranium",
    shortDescription: "An easy-care potted geranium with vivid color.",
    description: enDefaultDescription,
  },
  "saksida-kalanso": {
    name: "Potted Kalanchoe",
    shortDescription: "A long-lasting, compact and colorful kalanchoe.",
    description: enDefaultDescription,
  },
  "iki-dal-mor-orkide": {
    name: "Two-Stem Purple Orchid",
    shortDescription: "A long-lasting purple orchid with two stems in a ceramic pot.",
    description: enDefaultDescription,
  },
  "tek-dal-beyaz-orkide": {
    name: "Single-Stem White Orchid",
    shortDescription: "A simple and refined single-stem white orchid.",
    description: enDefaultDescription,
  },
  "kelebekli-pembe-gul-buketi": {
    name: "Butterfly Pink Rose Bouquet",
    shortDescription: "A distinctive pink rose bouquet with butterfly details.",
    description: enDefaultDescription,
  },
  "mini-teraryum": {
    name: "Mini Terrarium",
    shortDescription: "A miniature garden in glass, an easy-care lasting gift.",
    description: enDefaultDescription,
  },
  "ayicikli-buket": {
    name: "Teddy Bear Bouquet",
    shortDescription: "A cute surprise gift bouquet with a teddy bear.",
    description: enDefaultDescription,
  },
  "pembe-ayicikli-buket": {
    name: "Pink Teddy Bear Bouquet",
    shortDescription: "A sweet bouquet of pink roses with a little teddy bear.",
    description: enDefaultDescription,
  },
  "acilis-celengi": {
    name: "Opening Wreath",
    shortDescription: "A striking standing wreath for newly opened businesses.",
    description: enDefaultDescription,
  },
  "dugun-nikah-celengi": {
    name: "Wedding & Engagement Wreath",
    shortDescription: "A carefully prepared wreath for weddings and engagement ceremonies.",
    description: enDefaultDescription,
  },
  "cenaze-celengi": {
    name: "Funeral Wreath",
    shortDescription: "A simple wreath in white tones for funerals and memorials.",
    description: enDefaultDescription,
  },
  "11-kirmizi-gul-buketi": {
    name: "11 Red Roses Bouquet",
    shortDescription: "A classic, romantic bouquet made of 11 red roses.",
    description: enDefaultDescription,
  },
  "25-kirmizi-gul-buketi": {
    name: "25 Red Roses Bouquet",
    shortDescription: "A showstopping special-occasion bouquet of 25 red roses.",
    description: enDefaultDescription,
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
    isFeatured: ["p1", "p2", "p7", "p9"].includes(id),
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
    deliveryZoneIds: ["zone-1", "zone-2", "zone-3", ...antalyaDeliveryZoneIds],
    badges,
  };
}

const legacyProducts: Product[] = [
  product(
    "p1",
    "Gül Buketi",
    "gul-buketi",
    "cat-gul-buketleri",
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
    "cat-gul-buketleri",
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
    "cat-buketler",
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
    "cat-buketler",
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
    "cat-buketler",
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
    "cat-buketler",
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
    "cat-buketler",
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
    "cat-buketler",
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
    "cat-buketler",
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
    "cat-buketler",
    360,
    undefined,
    "/products/violet-cluster.jpg",
    "Tatlı ve narin menekşelerden hazırlanmış nostaljik buket.",
    ["Klasik"],
  ),
  // ---------------------------------------------------------------------------
  // Kategori vitrini icin ornek urunler (kutahyadacicekci.com kategori yapisina gore).
  // Gorseller ve fiyatlar YER TUTUCUDUR: gercek foto/fiyatlar hazir olunca burada
  // (veya admin panelinden) guncellenir. compareAtPrice dolu olanlar kartta "%X indirim" gosterir.
  // ---------------------------------------------------------------------------
  product(
    "p21",
    "Kutuda Pembe Güller",
    "kutuda-pembe-guller",
    "cat-aranjmanlar",
    690,
    750,
    "/pembe-gul.jpg",
    "Şık kutuda sunulan pembe güller; sevgiliye ve özel günlere zarif bir sürpriz.",
    ["Zarif", "Mevsimsel"],
  ),
  product(
    "p22",
    "Sepette Renkli Papatyalar",
    "sepette-renkli-papatyalar",
    "cat-aranjmanlar",
    520,
    560,
    "/papatya.jpg",
    "Hasır sepette neşeli ve renkli papatya aranjmanı.",
    ["Gunluk"],
  ),
  product(
    "p23",
    "Vazoda Karışık Mevsim Çiçekleri",
    "vazoda-karisik-mevsim-cicekleri",
    "cat-aranjmanlar",
    580,
    undefined,
    "/products/mixed-delicate.jpg",
    "Cam vazoda mevsimin en taze çiçeklerinden hazırlanan aranjman.",
    ["Mevsimsel"],
  ),
  product(
    "p24",
    "Solmayan Kırmızı Gül Kutusu",
    "solmayan-kirmizi-gul-kutusu",
    "cat-solmayan-guller",
    950,
    1050,
    "/products/rose-classic.jpg",
    "Yıllarca canlı kalan, özel işlem görmüş kırmızı güller.",
    ["Uzun Omurlu", "Cok Satan"],
  ),
  product(
    "p25",
    "Solmayan Pembe Gül Kutusu",
    "solmayan-pembe-gul-kutusu",
    "cat-solmayan-guller",
    890,
    undefined,
    "/products/rose-pastel.jpg",
    "Zarif kutuda, yıllarca solmayan pembe güller.",
    ["Uzun Omurlu", "Zarif"],
  ),
  product(
    "p26",
    "Saksıda Sardunya",
    "saksida-sardunya",
    "cat-saksi-cicekleri",
    220,
    250,
    "/sardunya.jpg",
    "Bakımı kolay, canlı renkli saksılı sardunya.",
    ["Uzun Omurlu"],
  ),
  product(
    "p27",
    "Saksıda Kalanşo",
    "saksida-kalanso",
    "cat-saksi-cicekleri",
    200,
    undefined,
    "/kalanso.jpg",
    "Uzun ömürlü, kompakt ve rengarenk kalanşo.",
    ["Uzun Omurlu"],
  ),
  product(
    "p28",
    "İki Dal Mor Orkide",
    "iki-dal-mor-orkide",
    "cat-orkideler",
    950,
    1020,
    "/products/violet-cluster.jpg",
    "Seramik saksıda iki dallı, uzun ömürlü mor orkide.",
    ["Zarif", "Uzun Omurlu"],
  ),
  product(
    "p29",
    "Tek Dal Beyaz Orkide",
    "tek-dal-beyaz-orkide",
    "cat-orkideler",
    650,
    undefined,
    "/products/white-daisies.jpg",
    "Sade ve asil görünümlü tek dallı beyaz orkide.",
    ["Zarif"],
  ),
  product(
    "p30",
    "Kelebekli Pembe Gül Buketi",
    "kelebekli-pembe-gul-buketi",
    "cat-kelebek-buketleri",
    780,
    850,
    "/products/rose-soft.jpg",
    "Kelebek detaylarıyla farklı ve dikkat çekici pembe gül buketi.",
    ["Zarif"],
  ),
  product(
    "p31",
    "Mini Teraryum",
    "mini-teraryum",
    "cat-terrariumlar",
    340,
    undefined,
    "/begonya.jpg",
    "Cam içinde minyatür bahçe; bakımı kolay, kalıcı bir hediye.",
    ["Uzun Omurlu"],
  ),
  product(
    "p32",
    "Ayıcıklı Buket",
    "ayicikli-buket",
    "cat-ayicik-buketleri",
    890,
    960,
    "/products/rose-classic.jpg",
    "Sevimli ayıcıklı, sürpriz hediye buketi.",
    ["Cok Satan"],
  ),
  product(
    "p33",
    "Pembe Ayıcıklı Buket",
    "pembe-ayicikli-buket",
    "cat-ayicik-buketleri",
    840,
    undefined,
    "/pembe-gul.jpg",
    "Pembe güller ve minik ayıcıkla hazırlanan tatlı buket.",
    ["Zarif"],
  ),
  product(
    "p34",
    "Açılış Çelengi",
    "acilis-celengi",
    "cat-dugun-acilis-celenkleri",
    1500,
    1600,
    "/products/mixed-delicate.jpg",
    "Yeni açılan iş yerleri için gösterişli ayaklı çelenk.",
    ["Klasik"],
  ),
  product(
    "p35",
    "Düğün & Nikah Çelengi",
    "dugun-nikah-celengi",
    "cat-dugun-acilis-celenkleri",
    1700,
    undefined,
    "/products/rose-pastel.jpg",
    "Düğün ve nikah törenleri için özenle hazırlanmış çelenk.",
    ["Zarif"],
  ),
  product(
    "p36",
    "Cenaze Çelengi",
    "cenaze-celengi",
    "cat-cenaze-celenkleri",
    1400,
    undefined,
    "/products/white-daisies.jpg",
    "Cenaze ve anma törenleri için beyaz tonlarda sade çelenk.",
    ["Klasik"],
  ),
  product(
    "p37",
    "11 Kırmızı Gül Buketi",
    "11-kirmizi-gul-buketi",
    "cat-gul-buketleri",
    790,
    860,
    "/products/rose-classic.jpg",
    "11 adet kırmızı gülden hazırlanan klasik ve romantik buket.",
    ["Cok Satan", "Klasik"],
  ),
  product(
    "p38",
    "25 Kırmızı Gül Buketi",
    "25-kirmizi-gul-buketi",
    "cat-gul-buketleri",
    1650,
    1750,
    "/products/rose-classic.jpg",
    "25 adet kırmızı gülden gösterişli, özel gün buketi.",
    ["Zarif"],
  ),
];

void legacyProducts;

export const products: Product[] = [
  product("p1", "Kaleci Romansı 15'li Kırmızı Gül", "kaleci-romansi-kirmizi-gul", "cat-gul-buketleri", 580, 650, "/stitch-pages/store-01.jpg", "Aşkın en tutkulu tonlarını taşıyan 15 dal kırmızı gül ve okaliptüs tasarımı.", ["Bugün Teslim", "En Çok Satan"]),
  product("p2", "Lara Pembesi Şakayık Aranjmanı", "lara-pembesi-sakayik-aranjmani", "cat-buketler", 740, undefined, "/stitch-pages/store-02.jpg", "Pastel şakayıklar, lisyanthus ve okaliptüsle hazırlanan romantik Kepez seçkisi.", ["Bugün Teslim", "Pastel"]),
  product("p3", "Beyaz İnci Çift Kandilli Orkide", "beyaz-inci-cift-kandilli-orkide", "cat-orkideler", 690, undefined, "/stitch-pages/store-03.jpg", "Zarif seramik saksısında çift dallı beyaz orkide ve doğal yosun dokusu.", ["Uzun Ömürlü", "Zarif"]),
  product("p4", "Akdeniz Güneşi Papatya Demeti", "akdeniz-gunesi-papatya-demeti", "cat-buketler", 350, undefined, "/stitch-pages/store-04.jpg", "Mevsimin taze papatyaları ve yeşillikleriyle hazırlanan doğal kraft demet.", ["Bugün Teslim", "Taze Kesim"]),
  product("p5", "Kutuda Solmayan Kırmızı Aşk Gülleri", "kutuda-solmayan-kirmizi-ask-gulleri", "cat-solmayan-guller", 820, undefined, "/stitch-pages/store-05.jpg", "Özel işlemle kalıcılığını koruyan kırmızı güllerin zarif kutu sunumu.", ["3 Yıl Solmayan", "Kalıcı"]),
  product("p6", "Konyaaltı Meltemi Mor Lisyanthus", "konyaalti-meltemi-mor-lisyanthus", "cat-buketler", 490, undefined, "/stitch-pages/store-06.jpg", "Zarif mor lisyanthusların ipek kurdeleyle bağlandığı sıcak tebrik buketi.", ["Bugün Teslim", "Tebrik"]),
  product("p7", "Antalya Günbatımı Şeftali Gül Buketi", "antalya-gunbatimi-seftali-gul-buketi", "cat-buketler", 620, undefined, "/stitch-pages/store-07.jpg", "Şeftali bahçe gülleri, lisyanthus ve okaliptüsle hazırlanan imza buketimiz.", ["Bugün Teslim", "Tasarım"]),
  product("p8", "Beyaz Zambak & Kazablanka Sepeti", "beyaz-zambak-kazablanka-sepeti", "cat-aranjmanlar", 780, undefined, "/stitch-pages/store-08.jpg", "Kazablanka zambakları ve mevsim yeşillikleriyle hazırlanan hasır sepet.", ["Aynı Gün", "Tebrik"]),
  product("p9", "Riva Royal Velvet Kutusu", "riva-royal-velvet-kutusu", "cat-aranjmanlar", 950, undefined, "/stitch-pages/arrangements-01.jpg", "Kadife dokulu silindirik kutuda 25 adet kırmızı gül ve okaliptüs.", ["Taze Kesim", "En Çok Tercih Edilen"]),
  product("p10", "Akdeniz Meltemi Seramik Vazo", "akdeniz-meltemi-seramik-vazo", "cat-aranjmanlar", 1200, undefined, "/stitch-pages/arrangements-02.jpg", "El yapımı seramik vazoda lisyanthus, şeftali gülleri ve taze dallar.", ["Tasarım Ürünü", "Seramik Vazo"]),
  product("p11", "Toros Bahçesi Ahşap Kasa", "toros-bahcesi-ahsap-kasa", "cat-aranjmanlar", 680, undefined, "/stitch-pages/arrangements-03.jpg", "Doğal ahşap kasada mevsim çiçekleriyle hazırlanan rustik atölye tasarımı.", ["Doğal Ahşap Kasa"]),
  product("p12", "Sonsuz Aşk Cam Fanus", "sonsuz-ask-cam-fanus", "cat-solmayan-guller", 850, undefined, "/stitch-pages/arrangements-04.jpg", "Cam fanusta üç yıl canlılığını koruyan kırmızı solmayan gül.", ["3 Yıl Garantili", "Solmayan"]),
  product("p13", "Kır Neşesi Örme Sepet", "kir-nesesi-orme-sepet", "cat-aranjmanlar", 450, undefined, "/stitch-pages/arrangements-05.jpg", "Taze papatyalar ve mevsim yeşillikleriyle hazırlanan hasır sepet aranjmanı.", ["Taze Hasat", "Hasır Sepet"]),
  product("p14", "Kalıcı Zarafeti Lüks Kutu", "kalici-zarafeti-luks-kutu", "cat-aranjmanlar", 1150, undefined, "/stitch-pages/arrangements-06.jpg", "Mermer desenli kutuda 30 adet beyaz ve pudra tonlu premium gül.", ["Özel Koleksiyon", "Lüks Kutu"]),
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
  // Antalya bolgeleri: ucretler src/lib/delivery-regions.ts icinde duzenlenir.
  ...antalyaDeliveryZones,
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
    seoTitle: "Gizlilik Politikasi | Riva Çiçekçilik",
    seoDescription: "Kisisel verilerin islenmesi ve korunmasina dair bilgilendirme.",
    isPublished: true,
    content:
      "Riva Çiçekçilik, siparis ve iletisim sureclerinde paylasilan bilgileri sadece hizmetin sunulmasi, siparis takibi ve yasal zorunluluklar kapsaminda kullanir. Veriler izinsiz ucuncu taraflarla pazarlama amacli paylasilmaz.",
  },
  {
    id: "content-2",
    title: "Mesafeli Satis Sozlesmesi",
    slug: "mesafeli-satis-sozlesmesi",
    seoTitle: "Mesafeli Satis Sozlesmesi | Riva Çiçekçilik",
    seoDescription: "Siparis, teslimat ve cayma sartlarini aciklayan sozlesme.",
    isPublished: true,
    content:
      "Siparis olusturuldugunda, urun bilgileri, teslimat tarihi, odeme sekli ve toplam tutar kullaniciya acik bicimde sunulur. Canli urunlerin dogasi geregi cayma ve iade kosullari urun ozelinde degisebilir.",
  },
  {
    id: "content-3",
    title: "On Bilgilendirme Formu",
    slug: "on-bilgilendirme-formu",
    seoTitle: "On Bilgilendirme Formu | Riva Çiçekçilik",
    seoDescription: "Siparis oncesi temel bilgilendirme ozeti.",
    isPublished: true,
    content:
      "Magaza unvani, iletisim bilgileri, teslimat kapsami, urun nitelikleri, toplam bedel ve odeme sekli siparis oncesi kullaniciya gosterilir. Siparisin tamamlanmasiyla bu bilgilendirme kabul edilmis sayilir.",
  },
  {
    id: "content-4",
    title: "Teslimat ve Iade",
    slug: "teslimat-ve-iade",
    seoTitle: "Teslimat ve Iade | Riva Çiçekçilik",
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

  if (category.group === "occasion") {
    return products.filter((product) => (productOccasions[product.slug] ?? []).includes(category.slug));
  }

  return products.filter((product) => product.categoryId === category.id);
}

export function getCategoriesByGroup(group: Category["group"]) {
  return categories
    .filter((category) => category.isActive && category.group === group)
    .sort((a, b) => a.sortOrder - b.sortOrder);
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
