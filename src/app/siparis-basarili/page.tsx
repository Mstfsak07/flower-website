import { SuccessPage } from "@/components/botanical/commerce-pages";
import { getLocale } from "@/lib/i18n";
export default async function OrderSuccessPage(){ return <SuccessPage locale={await getLocale()}/>; }
