import { CheckoutPage } from "@/components/botanical/commerce-pages";
import { getLocale } from "@/lib/i18n";
export default async function CartPage(){ return <CheckoutPage locale={await getLocale()}/>; }
