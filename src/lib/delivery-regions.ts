import type { Locale } from "@/lib/locale";
import type { DeliveryZone } from "@/lib/types";
import { formatPrice, slugify } from "@/lib/utils";

/**
 * Antalya teslimat bolgeleri - TEK KAYNAK.
 *
 * Buradaki ucret degisince her yer otomatik guncellenir:
 *  - urun sayfasindaki "Gonderim Adresi" secimi
 *  - sepet ve odeme ozeti
 *  - sunucudaki siparis dogrulamasi (findDeliveryZone -> deliveryZones)
 *  - prisma seed (deliveryZones uzerinden)
 *
 * fee: 0 = ucretsiz, diger degerler urun toplamina eklenen teslimat ucretidir (TL).
 * Yeni ilce eklemek icin listeye bir satir eklemek yeterli.
 */
export const DELIVERY_CITY = "Antalya";

type DeliveryRegionDef = {
  district: string;
  fee: number;
  minDeliveryHours: number;
};

const deliveryRegionDefs: DeliveryRegionDef[] = [
  { district: "Kepez", fee: 0, minDeliveryHours: 2 },
  { district: "Muratpaşa", fee: 200, minDeliveryHours: 2 },
  { district: "Konyaaltı", fee: 400, minDeliveryHours: 3 },
  { district: "Aksu", fee: 300, minDeliveryHours: 3 },
  { district: "Döşemealtı", fee: 350, minDeliveryHours: 3 },
];

export const antalyaDeliveryZones: DeliveryZone[] = deliveryRegionDefs.map((region) => ({
  id: `zone-antalya-${slugify(region.district)}`,
  name: `${DELIVERY_CITY} / ${region.district}`,
  city: DELIVERY_CITY,
  district: region.district,
  fee: region.fee,
  minDeliveryHours: region.minDeliveryHours,
  sameDayAvailable: true,
  cutoffHour: 15,
  isActive: true,
}));

export const antalyaDeliveryZoneIds = antalyaDeliveryZones.map((zone) => zone.id);

/** Urun sayfasinda secilip sepet/odeme adimina tasinan gonderim bilgisi. */
export type DeliverySelection = {
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

export function findDeliveryRegion(district?: string | null) {
  if (!district) {
    return undefined;
  }

  const target = normalize(district);
  return antalyaDeliveryZones.find((zone) => normalize(zone.district) === target);
}

/** Ilce icin teslimat ucreti. Teslimat yapilmayan/secilmemis ilce icin null doner. */
export function getDeliveryFee(district?: string | null): number | null {
  return findDeliveryRegion(district)?.fee ?? null;
}

/** "Ücretsiz" veya "+₺200" */
export function formatDeliveryFee(fee: number, locale: Locale = "tr") {
  if (fee === 0) {
    return locale === "en" ? "Free" : "Ücretsiz";
  }

  return `+${formatPrice(fee)}`;
}
