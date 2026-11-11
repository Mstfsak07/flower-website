import { ArrangementsPage } from "@/components/botanical/catalog";
import { getLocale } from "@/lib/i18n";
export default async function ArrangementsLandingPage(){ return <ArrangementsPage locale={await getLocale()}/>; }
