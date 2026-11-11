import { LoginPage } from "@/components/botanical/commerce-pages";
import { getLocale } from "@/lib/i18n";
export default async function AuthPage(){ return <LoginPage locale={await getLocale()}/>; }
