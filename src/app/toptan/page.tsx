import { CorporatePage } from "@/components/botanical/content-pages";
import { getLocale } from "@/lib/i18n";
export default async function Corporate(){ return <CorporatePage locale={await getLocale()}/>; }
