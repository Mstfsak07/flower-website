import { CheckoutPage } from "@/components/botanical/commerce-pages";
import { getLocale } from "@/lib/i18n";
export default async function PaymentPage(){ return <CheckoutPage payment locale={await getLocale()}/>; }
