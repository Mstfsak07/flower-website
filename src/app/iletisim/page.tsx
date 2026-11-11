import { ContactPage } from "@/components/botanical/content-pages";
import { getLocale } from "@/lib/i18n";
export default async function Contact(){ return <ContactPage locale={await getLocale()}/>; }
