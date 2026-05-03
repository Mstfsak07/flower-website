import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CreditCard, PackageCheck, ShoppingBag, Truck } from "lucide-react";

import { OrderActionRequestPanel } from "@/components/order-action-request-panel";
import { readAuthSession } from "@/lib/auth-server";
import { getLocalizedProduct, getProductById } from "@/lib/data";
import { getLocale } from "@/lib/i18n";
import { getAccountOrdersRepo } from "@/lib/repositories/admin-repository";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { formatLocalizedDate, formatPrice } from "@/lib/utils";

const copy = {
  tr: {
    accountArea: "Account Area",
    activeProcess: "Active Process",
    continueShopping: "Continue Shopping",
    createdAt: "tarihinde oluşturuldu.",
    deliveryWindow: "Delivery Window",
    emptyCta: "Go to Shop",
    emptyLabel: "No Orders Yet",
    emptyText:
      "Farklı bir e-posta ile checkout yaptıysan bu alan boş görünebilir. Yeni sipariş verdiğinde kayıtlı hesabında burada listelenecek.",
    emptyTitle: "No orders are linked to your account.",
    grandTotal: "Grand Total",
    items: "Items",
    orderNo: "Order No",
    orderStatus: "Order Status",
    paidOrders: "Paid Orders",
    paymentStatus: "Payment Status",
    support: "Get Support",
    title: "Orders",
    totalOrders: "Total Orders",
    track: "Open Tracking",
    unit: "adet",
    description:
      "Hesabına bağlı siparişleri, teslimat durumunu ve ödeme bilgisini buradan takip edebilirsin.",
  },
  en: {
    accountArea: "Account Area",
    activeProcess: "Active Process",
    continueShopping: "Continue Shopping",
    createdAt: "created on.",
    deliveryWindow: "Delivery Window",
    emptyCta: "Go to Shop",
    emptyLabel: "No Orders Yet",
    emptyText:
      "If you checked out with another email address, this area may appear empty. New orders will be listed here under your registered account.",
    emptyTitle: "No orders are linked to your account.",
    grandTotal: "Grand Total",
    items: "Items",
    orderNo: "Order No",
    orderStatus: "Order Status",
    paidOrders: "Paid Orders",
    paymentStatus: "Payment Status",
    support: "Get Support",
    title: "My Orders",
    totalOrders: "Total Orders",
    track: "Open Tracking",
    unit: "pcs",
    description:
      "Track orders linked to your account, delivery status, and payment information here.",
  },
} as const;

export default async function AccountOrdersPage() {
  const locale = await getLocale();
  const t = copy[locale];
  const session = await readAuthSession();
  if (!session?.user?.email) {
    redirect("/giris?redirect=/hesabim/siparisler");
  }

  const orders = await getAccountOrdersRepo(session.user.email, session.user.id);
  const activeOrderCount = orders.filter((order) => !["DELIVERED", "CANCELLED", "REFUNDED"].includes(order.status)).length;
  const paidOrderCount = orders.filter((order) => order.paymentStatus === "PAID").length;

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-lg border border-[#4d4635]/25 bg-[#1c1b1b] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-10">
        <div className="absolute right-[-5rem] top-[-6rem] h-48 w-48 rounded-full bg-[#f2ca50]/10 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-8 h-36 w-36 rounded-full bg-[#7d5b2e]/15 blur-3xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d4af37]">{t.accountArea}</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl leading-tight text-[#f2ca50] md:text-6xl">{t.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#d0c5af] md:text-lg">
                {t.description}
              </p>
            </div>

            <Link
              className="inline-flex w-fit items-center justify-center rounded-full border border-[#f2ca50]/35 bg-[#f2ca50] px-5 py-3 text-sm font-semibold text-[#131313] transition-colors hover:bg-[#d4af37]"
              href="/magaza"
            >
              {t.continueShopping}
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <SummaryCard icon={ShoppingBag} label={t.totalOrders} value={orders.length.toString()} />
            <SummaryCard icon={Truck} label={t.activeProcess} value={activeOrderCount.toString()} />
            <SummaryCard icon={CreditCard} label={t.paidOrders} value={paidOrderCount.toString()} />
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {orders.length ? (
          orders.map((order) => {
            const localizedItems = order.items.map((item) => {
              const product = getProductById(item.productId);
              const localizedProduct = product ? getLocalizedProduct(product, locale) : null;
              return {
                ...item,
                productName: localizedProduct?.name ?? item.productName,
                variantName: locale === "en" ? translateOrderVariant(item.variantName) : item.variantName,
              };
            });

            return (
            <article
              key={order.id}
              className="overflow-hidden rounded-lg border border-[#4d4635]/25 bg-[#1c1b1b] shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
            >
              <div className="border-b border-[#4d4635]/20 p-6 md:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="inline-flex rounded-full border border-[#f2ca50]/25 bg-[#f2ca50]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f2ca50]">
                      {t.orderNo}: {order.orderNumber}
                    </div>
                    <h2 className="mt-4 font-serif text-3xl leading-tight text-[#e5e2e1] md:text-4xl">
                      {order.recipientName}
                    </h2>
                    <p className="mt-3 flex items-center gap-2 text-sm text-[#d0c5af]/85">
                      <CalendarDays className="h-4 w-4 text-[#d4af37]" aria-hidden="true" />
                      <span>{formatLocalizedDate(order.createdAt, locale)} {t.createdAt}</span>
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f] px-5 py-4 text-left lg:min-w-48 lg:text-right">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#d0c5af]/70">{t.grandTotal}</div>
                    <div className="mt-2 text-2xl font-semibold text-[#f2ca50]">
                      {formatPrice(order.grandTotal)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 md:p-8">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <InfoCard label={t.orderNo}>
                    <div className="font-mono text-sm font-semibold text-[#f2ca50]">{order.orderNumber}</div>
                  </InfoCard>
                  <InfoCard label={t.orderStatus}>
                    <StatusBadge locale={locale} status={order.status} type="order" />
                  </InfoCard>
                  <InfoCard label={t.paymentStatus}>
                    <StatusBadge locale={locale} status={order.paymentStatus} type="payment" />
                  </InfoCard>
                  <InfoCard label={t.deliveryWindow}>
                    <div className="flex items-center gap-2 font-semibold text-[#e5e2e1]">
                      <Truck className="h-4.5 w-4.5 text-[#d4af37]" aria-hidden="true" />
                      <span>
                        {order.deliveryDate} / {order.deliverySlot}
                      </span>
                    </div>
                  </InfoCard>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d4af37]">{t.items}</h3>
                  <div className="mt-3 space-y-3">
                    {localizedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-lg border border-[#4d4635]/25 bg-[#201f1f] px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f2ca50]/10 text-[#f2ca50]">
                              <PackageCheck className="h-4.5 w-4.5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <div className="break-words font-medium text-[#e5e2e1]">{item.productName}</div>
                              <div className="mt-1 text-[#d0c5af]/75">
                                {item.quantity} {t.unit}{item.variantName ? ` • ${item.variantName}` : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 pl-12 text-base font-semibold text-[#f2ca50] sm:pl-0">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <OrderActionRequestPanel
                  items={order.items.map((item) => ({
                    id: item.id,
                    productName: localizedItems.find((localizedItem) => localizedItem.id === item.id)?.productName ?? item.productName,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    variantName: localizedItems.find((localizedItem) => localizedItem.id === item.id)?.variantName,
                  }))}
                  locale={locale}
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  orderStatus={order.status}
                  paymentStatus={order.paymentStatus}
                />

                <div className="flex flex-wrap gap-3 border-t border-[#4d4635]/20 pt-6">
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-[#f2ca50] px-5 py-3 text-sm font-semibold text-[#131313] transition-colors hover:bg-[#d4af37]"
                    href="/siparis-takip"
                  >
                    {t.track}
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-full border border-[#4d4635]/35 px-5 py-3 text-sm font-semibold text-[#d0c5af] transition-colors hover:border-[#f2ca50]/40 hover:text-[#f2ca50]"
                    href="/iletisim"
                  >
                    {t.support}
                  </Link>
                </div>
              </div>
            </article>
          );
          })
        ) : (
          <section className="rounded-lg border border-[#4d4635]/25 bg-[#1c1b1b] p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2ca50]/10 text-[#f2ca50]">
              <ShoppingBag className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-[#d4af37]">
              {t.emptyLabel}
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl leading-tight text-[#f2ca50] md:text-5xl">
              {t.emptyTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#d0c5af]">
              {t.emptyText}
            </p>
            <Link
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#f2ca50] px-6 py-3 text-sm font-semibold text-[#131313] transition-colors hover:bg-[#d4af37]"
              href="/magaza"
            >
              {t.emptyCta}
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

type SummaryCardProps = {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
};

function SummaryCard({ icon: Icon, label, value }: SummaryCardProps) {
  return (
    <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f]/90 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.18em] text-[#d0c5af]/70">{label}</span>
        <Icon className="h-4.5 w-4.5 text-[#d4af37]" aria-hidden="true" />
      </div>
      <div className="mt-3 text-3xl font-semibold text-[#e5e2e1]">{value}</div>
    </div>
  );
}

function InfoCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f] p-4 text-sm">
      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-[#d0c5af]/70">{label}</div>
      {children}
    </div>
  );
}

function StatusBadge({
  locale = "tr",
  status,
  type,
}: {
  locale?: "tr" | "en";
  status: OrderStatus | PaymentStatus;
  type: "order" | "payment";
}) {
  const label =
    type === "order"
      ? getOrderStatusLabel(status as OrderStatus, locale)
      : getPaymentStatusLabel(status as PaymentStatus, locale);

  return (
    <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(status)}`}>
      {label}
    </span>
  );
}

function getOrderStatusLabel(status: Order["status"], locale: "tr" | "en") {
  const labels: Record<"tr" | "en", Record<Order["status"], string>> = {
    en: {
      CANCELLED: "Cancelled",
      DELIVERED: "Delivered",
      OUT_FOR_DELIVERY: "Out for Delivery",
      PAID: "Paid",
      PENDING: "Pending",
      PREPARING: "Preparing",
      REFUNDED: "Refunded",
    },
    tr: {
    CANCELLED: "İptal Edildi",
    DELIVERED: "Teslim Edildi",
    OUT_FOR_DELIVERY: "Dağıtımda",
    PAID: "Ödeme Alındı",
    PENDING: "Beklemede",
    PREPARING: "Hazırlanıyor",
    REFUNDED: "İade Edildi",
    },
  };

  return labels[locale][status] ?? status;
}

function getPaymentStatusLabel(status: Order["paymentStatus"], locale: "tr" | "en") {
  const labels: Record<"tr" | "en", Record<Order["paymentStatus"], string>> = {
    en: {
      FAILED: "Failed",
      PAID: "Paid",
      REFUNDED: "Refunded",
      UNPAID: "Payment Pending",
    },
    tr: {
    FAILED: "Başarısız",
    PAID: "Ödendi",
    REFUNDED: "İade Edildi",
    UNPAID: "Ödeme Bekliyor",
    },
  };

  return labels[locale][status] ?? status;
}

function translateOrderVariant(value?: string) {
  if (!value) return value;

  const translations: Record<string, string> = {
    Buyuk: "Large",
    Kucuk: "Small",
    Orta: "Medium",
  };

  return translations[value] ?? value;
}

function getStatusClass(status: OrderStatus | PaymentStatus) {
  if (status === "PAID" || status === "DELIVERED") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-200";
  }

  if (status === "PREPARING" || status === "OUT_FOR_DELIVERY" || status === "PENDING" || status === "UNPAID") {
    return "border-[#f2ca50]/25 bg-[#f2ca50]/10 text-[#f2ca50]";
  }

  if (status === "CANCELLED" || status === "FAILED") {
    return "border-red-300/25 bg-red-400/10 text-red-200";
  }

  return "border-sky-300/25 bg-sky-400/10 text-sky-200";
}
