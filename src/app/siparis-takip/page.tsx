import { OrderTrackView } from "@/components/order-track-view";
import { getLocale } from "@/lib/i18n";

export default async function TrackOrderPage() {
  const locale = await getLocale();
  return <OrderTrackView locale={locale} />;
}
