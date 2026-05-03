import { CollectionsPage } from "@/components/collections-page";
import { getLocale } from "@/lib/i18n";

export default async function ArrangementsPage() {
  const locale = await getLocale();
  return <CollectionsPage locale={locale} />;
}
