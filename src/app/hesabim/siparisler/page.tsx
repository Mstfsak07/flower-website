import { OrdersPage } from "@/components/botanical/commerce-pages";
import { getLocale } from "@/lib/i18n";
export default async function AccountOrdersPage(){ return <OrdersPage locale={await getLocale()}/>; }
