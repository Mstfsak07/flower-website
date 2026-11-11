import { FaqPage } from "@/components/botanical/content-pages";
import { getLocale } from "@/lib/i18n";
export default async function Faq(){ return <FaqPage locale={await getLocale()}/>; }
