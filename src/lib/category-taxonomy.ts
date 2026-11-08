import type { Category } from "@/lib/types";

/**
 * Vitrin kategori yapisi: iki grup.
 *  - "type": urun turu (Aranjmanlar, Buketler, Orkideler ...)
 *  - "occasion": gonderim amaci (Sevgiliye, Dogum Gunu ...)
 * Urun turu urunun categoryId alaninda tutulur; gonderim amaci ise asagidaki
 * productOccasions tablosuyla urun slug'ina baglanir (bir urun birden cok amaca girebilir).
 */

type CategoryDef = {
  name: string;
  slug: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
};

export const productCategoryDefs: CategoryDef[] = [
  { name: "Aranjmanlar", slug: "aranjmanlar", description: "Kutuda, sepette ve vazoda hazır çiçek aranjmanları.", nameEn: "Arrangements", descriptionEn: "Ready-made flower arrangements in boxes, baskets and vases." },
  { name: "Buketler", slug: "buketler", description: "Mevsim çiçeklerinden özenle hazırlanan buketler.", nameEn: "Bouquets", descriptionEn: "Bouquets carefully prepared with seasonal flowers." },
  { name: "Solmayan Güller", slug: "solmayan-guller", description: "Yıllarca canlı kalan, solmayan özel güller.", nameEn: "Preserved Roses", descriptionEn: "Special roses that stay beautiful for years." },
  { name: "Saksı Çiçekleri", slug: "saksi-cicekleri", description: "Uzun ömürlü hediye arayanlar için bakımı kolay saksılı türler.", nameEn: "Potted Plants", descriptionEn: "Easy-care potted gifts for those who want something longer lasting." },
  { name: "Orkideler", slug: "orkideler", description: "Zarif ve uzun ömürlü orkide çeşitleri.", nameEn: "Orchids", descriptionEn: "Elegant and long-lasting orchid varieties." },
  { name: "Kelebek Buketleri", slug: "kelebek-buketleri", description: "Kelebek detaylı, farklı ve dikkat çekici buketler.", nameEn: "Butterfly Bouquets", descriptionEn: "Distinctive bouquets with butterfly details." },
  { name: "Terrariumlar", slug: "terrariumlar", description: "Cam içinde minyatür bahçeler, bakımı kolay hediyeler.", nameEn: "Terrariums", descriptionEn: "Miniature gardens in glass, easy-care gifts." },
  { name: "Gül Buketleri", slug: "gul-buketleri", description: "Kırmızı, beyaz ve pembe güllerden romantik buketler.", nameEn: "Rose Bouquets", descriptionEn: "Romantic bouquets of red, white and pink roses." },
  { name: "Ayıcık Buketleri", slug: "ayicik-buketleri", description: "Sevimli ayıcıklı, sürpriz hediye buketleri.", nameEn: "Teddy Bear Bouquets", descriptionEn: "Cute surprise gift bouquets with a teddy bear." },
  { name: "Düğün & Açılış Çelenkleri", slug: "dugun-acilis-celenkleri", description: "Düğün, nikah ve açılış törenleri için çelenkler.", nameEn: "Wedding & Opening Wreaths", descriptionEn: "Wreaths for weddings, engagements and opening ceremonies." },
  { name: "Cenaze Çelenkleri", slug: "cenaze-celenkleri", description: "Cenaze ve anma törenleri için çelenkler.", nameEn: "Funeral Wreaths", descriptionEn: "Wreaths for funerals and memorial ceremonies." },
];

export const occasionCategoryDefs: CategoryDef[] = [
  { name: "Sevgiliye", slug: "sevgiliye", description: "Sevdiğinize duygularınızı çiçeklerle anlatın.", nameEn: "For Your Love", descriptionEn: "Say it with flowers to the one you love." },
  { name: "Arkadaşa", slug: "arkadasa", description: "Arkadaşınızı mutlu edecek samimi çiçekler.", nameEn: "For a Friend", descriptionEn: "Warm flowers that will make a friend smile." },
  { name: "Doğum Günü", slug: "dogum-gunu", description: "Doğum günü için neşeli ve renkli çiçekler.", nameEn: "Birthday", descriptionEn: "Cheerful, colorful flowers for birthdays." },
  { name: "Geçmiş Olsun", slug: "gecmis-olsun", description: "Moral veren, iyileşmeyi hızlandıran çiçekler.", nameEn: "Get Well Soon", descriptionEn: "Uplifting flowers to wish someone a quick recovery." },
  { name: "Özür Dileme", slug: "ozur-dileme", description: "Özrünüzü çiçeklerin diliyle iletin.", nameEn: "Apology", descriptionEn: "Say sorry in the language of flowers." },
  { name: "Açılış", slug: "acilis", description: "Yeni açılan iş yerleri için şık çiçekler.", nameEn: "Opening", descriptionEn: "Elegant flowers for newly opened businesses." },
  { name: "Düğün & Nikah", slug: "dugun-nikah", description: "Düğün ve nikah için özel tasarımlar.", nameEn: "Wedding & Engagement", descriptionEn: "Special designs for weddings and engagements." },
  { name: "Bebek & Doğum", slug: "bebek-dogum", description: "Yeni bir hayata hoş geldin çiçekleri.", nameEn: "Baby & Newborn", descriptionEn: "Flowers to welcome a new life." },
  { name: "Yeni İş & Görev", slug: "yeni-is-gorev", description: "Yeni iş ve görev tebriği için çiçekler.", nameEn: "New Job & Role", descriptionEn: "Flowers to congratulate a new job or role." },
];

export const allCategoryDefs = [
  ...productCategoryDefs.map((def) => ({ ...def, group: "type" as const })),
  ...occasionCategoryDefs.map((def) => ({ ...def, group: "occasion" as const })),
];

// Gecici gorseller: gercek kategori gorselleri eklenene kadar mevcut yerel urun fotograflari doner.
const placeholderImages = [
  "/products/rose-classic.jpg",
  "/products/mixed-delicate.jpg",
  "/products/rose-pastel.jpg",
  "/products/white-daisies.jpg",
  "/products/lavender-bouquet.jpg",
  "/products/violet-cluster.jpg",
  "/products/rose-soft.jpg",
];

export function categoryIdForSlug(slug: string) {
  return `cat-${slug}`;
}

export function buildCategories(): Category[] {
  return allCategoryDefs.map((def, index) => ({
    id: categoryIdForSlug(def.slug),
    name: def.name,
    slug: def.slug,
    description: def.description,
    imageUrl: placeholderImages[index % placeholderImages.length],
    isActive: true,
    sortOrder: index + 1,
    group: def.group,
  }));
}

export const categoryTranslationsEn: Record<string, { name: string; description: string }> =
  Object.fromEntries(allCategoryDefs.map((def) => [def.slug, { name: def.nameEn, description: def.descriptionEn }]));

// Urun slug'i -> gonderim amaci kategorileri. Yeni urun eklerken buraya satir eklenir.
export const productOccasions: Record<string, string[]> = {
  "gul-buketi": ["sevgiliye", "dogum-gunu", "ozur-dileme"],
  "pembe-gul-buketi": ["sevgiliye", "dogum-gunu", "bebek-dogum"],
  "karanfil-buketi": ["arkadasa", "gecmis-olsun", "acilis"],
  "papatya-buketi": ["arkadasa", "gecmis-olsun", "ozur-dileme"],
  "sardunya-buketi": ["arkadasa", "yeni-is-gorev", "acilis"],
  "begonya-buketi": ["arkadasa", "yeni-is-gorev"],
  "lavanta-buketi": ["arkadasa", "gecmis-olsun", "ozur-dileme"],
  "petunya-buketi": ["arkadasa", "dogum-gunu", "bebek-dogum"],
  "kalanso-buketi": ["arkadasa", "acilis", "yeni-is-gorev"],
  "menekse-buketi": ["arkadasa", "gecmis-olsun"],
  "kutuda-pembe-guller": ["sevgiliye", "dogum-gunu"],
  "sepette-renkli-papatyalar": ["arkadasa", "dogum-gunu", "gecmis-olsun"],
  "vazoda-karisik-mevsim-cicekleri": ["arkadasa", "gecmis-olsun", "yeni-is-gorev", "acilis"],
  "solmayan-kirmizi-gul-kutusu": ["sevgiliye", "ozur-dileme"],
  "solmayan-pembe-gul-kutusu": ["sevgiliye", "dogum-gunu"],
  "saksida-sardunya": ["arkadasa", "yeni-is-gorev", "acilis"],
  "saksida-kalanso": ["yeni-is-gorev", "bebek-dogum"],
  "iki-dal-mor-orkide": ["yeni-is-gorev", "acilis", "dogum-gunu"],
  "tek-dal-beyaz-orkide": ["gecmis-olsun", "yeni-is-gorev"],
  "kelebekli-pembe-gul-buketi": ["sevgiliye", "dogum-gunu", "bebek-dogum"],
  "mini-teraryum": ["arkadasa", "yeni-is-gorev"],
  "ayicikli-buket": ["sevgiliye", "dogum-gunu", "bebek-dogum", "ozur-dileme"],
  "pembe-ayicikli-buket": ["sevgiliye", "dogum-gunu", "bebek-dogum"],
  "acilis-celengi": ["acilis", "dugun-nikah", "yeni-is-gorev"],
  "dugun-nikah-celengi": ["dugun-nikah"],
  "11-kirmizi-gul-buketi": ["sevgiliye", "ozur-dileme"],
  "25-kirmizi-gul-buketi": ["sevgiliye", "dugun-nikah"],
};
