import { StorefrontPage } from "@/components/botanical/catalog";
import { getLocale } from "@/lib/i18n";
export default async function ShopPage(){ return <StorefrontPage locale={await getLocale()}/>; }
