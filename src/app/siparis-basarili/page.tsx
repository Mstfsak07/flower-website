import { Suspense } from "react";

import { OrderSuccessView } from "@/components/order-success-view";
import { getLocale } from "@/lib/i18n";

export default async function OrderSuccessPage() {
  const locale = await getLocale();

  return (
    <Suspense fallback={null}>
      <OrderSuccessView locale={locale} />
    </Suspense>
  );
}
