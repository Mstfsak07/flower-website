import { CartPageView } from "@/components/cart-page-view";
import { getLocale } from "@/lib/i18n";

export default async function CartPage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fcf6ef_0%,#f6eee6_45%,#f2e7dc_100%)] text-[#2f2623]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(255,146,72,0.16),transparent_22%),radial-gradient(circle_at_85%_20%,rgba(107,92,165,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(68,128,100,0.10),transparent_26%)]" />
      <main className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">
          <CartPageView locale={locale} />
        </div>
      </main>
    </div>
  );
}
