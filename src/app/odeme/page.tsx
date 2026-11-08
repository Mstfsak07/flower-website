import Link from "next/link";

import { PaymentCheckoutView } from "@/components/payment-checkout-view";
import { manrope as sans, notoSerif as serif } from "@/lib/fonts";
import { getLocale } from "@/lib/i18n";
import { getBrandName } from "@/lib/site-config";

export default async function CheckoutPage() {
  const locale = await getLocale();
  const brandName = getBrandName();
  const footer =
    locale === "en"
      ? {
          privacy: "Privacy Policy",
          sales: "Distance Sales Agreement",
          returns: "Returns and Cancellations",
          rights: "All rights reserved.",
        }
      : {
          privacy: "Gizlilik Politikası",
          sales: "Mesafeli Satış Sözleşmesi",
          returns: "İade ve İptal",
          rights: "Tüm hakları saklıdır.",
        };
  return (
    <>
      <style>{`
        .ghost-border {
          border: 1px solid rgba(77, 70, 53, 0.2);
        }
        .ghost-border:focus-within,
        .ghost-border:focus {
          border-color: #f2ca50;
        }
      `}</style>
      <div className={`${sans.className} min-h-screen bg-[#131313] text-[#e5e2e1]`}>
        <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12">
          <PaymentCheckoutView locale={locale} serifClassName={serif.className} />
        </main>

        <footer className="border-t border-[#4d46351a] bg-[#0f0f0f] px-8 py-12">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-8 md:flex-row">
            <div className={`${serif.className} italic text-neutral-300`}>{brandName}</div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link className="text-[10px] uppercase tracking-widest text-neutral-600 transition-colors hover:text-[#e9c349]" href="/gizlilik-politikasi">
                {footer.privacy}
              </Link>
              <Link className="text-[10px] uppercase tracking-widest text-neutral-600 transition-colors hover:text-[#e9c349]" href="/mesafeli-satis-sozlesmesi">
                {footer.sales}
              </Link>
              <Link className="text-[10px] uppercase tracking-widest text-neutral-600 transition-colors hover:text-[#e9c349]" href="/iade-ve-iptal-kosullari">
                {footer.returns}
              </Link>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500">
              © {new Date().getFullYear()} {brandName}. {footer.rights}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
