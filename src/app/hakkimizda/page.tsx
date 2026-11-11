import { AboutPage } from "@/components/botanical/content-pages";
import { getLocale } from "@/lib/i18n";
export default async function About(){ return <AboutPage locale={await getLocale()}/>; }
