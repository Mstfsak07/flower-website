"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import type { Locale } from "@/lib/locale";
import type { OrderStatus, PaymentStatus, ReturnRequestType } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export type OrderActionRequestItem = {
  id: string;
  productName: string;
  variantName?: string;
  quantity: number;
  totalPrice: number;
};

type OrderActionRequestPanelProps = {
  locale?: Locale;
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderActionRequestItem[];
};

const cancelReasons = [
  "Yanlış ürün seçtim",
  "Teslimat tarihini değiştirmek istiyorum",
  "Siparişten vazgeçtim",
  "Diğer",
];

const refundReasons = [
  "Ürün hasarlı geldi",
  "Yanlış ürün teslim edildi",
  "Teslimat gerçekleşmedi",
  "Ürün beklendiği gibi değil",
  "Diğer",
];

const cancelConditions = [
  "Sipariş hazırlık, kişiye özel üretim veya kurye/kargo sürecine alınmadan önce iptal talebi değerlendirilebilir.",
  "Hazırlığı başlamış, kişiye özel hazırlanmış veya hızlı bozulan ürünlerde iptal talebi operasyon durumuna göre onaylanır.",
  "Ödeme alınmış siparişlerde iptal onaylandıktan sonra ödeme iadesi banka/ödeme kuruluşu sürelerine göre yansır.",
];

const refundConditions = [
  "Teslim edilen ürün için iade talebi; hasar, yanlış ürün veya teslimat problemi gibi gerekçelerle değerlendirilir.",
  "Çiçek gibi hızlı bozulabilen veya kişiye özel hazırlanan ürünlerde iade hakkı sınırlı olabilir; mümkünse aynı gün fotoğrafla başvuru yapılmalıdır.",
  "İade onaylandığında ödeme iadesi kullanılan ödeme yöntemine ve banka süreçlerine göre tamamlanır.",
];

const copy = {
  tr: {
    cancelBody: "Hazırlık veya teslimat süreci başlamadan önce değerlendirilir.",
    cancelRequest: "İptal Talebi",
    cancelTerms: "İptal koşulları",
    closedNotice: "Bazı seçenekler sipariş durumu veya ödeme durumuna göre kapalı olabilir.",
    errorFallback: "Talep oluşturulamadı. Lütfen daha sonra tekrar deneyin.",
    heading: "Siparişten ürün seçerek talep oluştur",
    link: "Tüm iade ve iptal koşullarını oku",
    networkError: "Talep gönderilirken bağlantı hatası oluştu.",
    note: "Ek açıklama",
    notePlaceholder: "Örn. teslimat saati, ürün durumu veya destek ekibine iletmek istediğiniz not",
    orderNumber: "Sipariş No",
    reason: "Talep nedeni",
    reasonPlaceholder: "Neden seçin",
    refundBody: "Ödemesi alınmış veya teslimat problemi olan siparişler için kullanılır.",
    refundRequest: "İade Talebi",
    refundTerms: "İade koşulları",
    selectItems: "İşlem yapılacak ürünleri seç",
    submit: "Talep Oluştur",
    submitting: "Talep gönderiliyor...",
    success: (type: ReturnRequestType, number: string) =>
      `${type === "CANCEL" ? "İptal" : "İade"} talebiniz alındı. Talep no: ${number}`,
    summary:
      "Talep türünü seçtikten sonra işlem yapılacak ürünü veya ürünleri işaretle. Koşullar seçtiğin işleme göre aşağıda görünür.",
    title: "İptal / İade Talebi",
    unit: "adet",
  },
  en: {
    cancelBody: "Reviewed before preparation or delivery has started.",
    cancelRequest: "Cancellation Request",
    cancelTerms: "Cancellation terms",
    closedNotice: "Some options may be disabled depending on order or payment status.",
    errorFallback: "Request could not be created. Please try again later.",
    heading: "Create a request by selecting products from this order",
    link: "Read all return and cancellation terms",
    networkError: "A connection error occurred while sending the request.",
    note: "Additional note",
    notePlaceholder: "E.g. delivery time, product condition, or a note for the support team",
    orderNumber: "Order No",
    reason: "Request reason",
    reasonPlaceholder: "Select a reason",
    refundBody: "Use this for paid orders or delivery-related problems.",
    refundRequest: "Return Request",
    refundTerms: "Return terms",
    selectItems: "Select products for this request",
    submit: "Create Request",
    submitting: "Sending request...",
    success: (type: ReturnRequestType, number: string) =>
      `${type === "CANCEL" ? "Cancellation" : "Return"} request received. Request no: ${number}`,
    summary:
      "Choose the request type, then select the product or products to process. Terms are shown below based on your selection.",
    title: "Cancellation / Return Request",
    unit: "pcs",
  },
} as const;

const localizedReasons = {
  tr: { CANCEL: cancelReasons, REFUND: refundReasons },
  en: {
    CANCEL: ["I selected the wrong product", "I want to change the delivery date", "I changed my mind", "Other"],
    REFUND: ["Product arrived damaged", "Wrong product delivered", "Delivery did not happen", "Product was not as expected", "Other"],
  },
} as const;

const localizedConditions = {
  tr: { CANCEL: cancelConditions, REFUND: refundConditions },
  en: {
    CANCEL: [
      "Cancellation requests may be reviewed before the order is taken into preparation, custom production, courier, or shipping process.",
      "For orders already prepared, personalized, or perishable, approval depends on operational status.",
      "For paid orders, refund reflection depends on bank/payment provider timelines after cancellation approval.",
    ],
    REFUND: [
      "Return requests for delivered products are reviewed for damage, wrong product, or delivery issues.",
      "For flowers and other perishable or personalized products, return rights may be limited; same-day photo evidence is recommended.",
      "If approved, the refund is completed according to the original payment method and bank process.",
    ],
  },
} as const;

export function OrderActionRequestPanel({
  locale = "tr",
  orderId,
  orderNumber,
  orderStatus,
  paymentStatus,
  items,
}: OrderActionRequestPanelProps) {
  const t = copy[locale];
  const [requestType, setRequestType] = useState<ReturnRequestType | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canCancel = !["DELIVERED", "CANCELLED", "REFUNDED"].includes(orderStatus);
  const canRefund = paymentStatus === "PAID" && !["CANCELLED", "REFUNDED"].includes(orderStatus);
  const reasonOptions = requestType ? localizedReasons[locale][requestType] : localizedReasons[locale].CANCEL;
  const conditions = requestType ? localizedConditions[locale][requestType] : localizedConditions[locale].CANCEL;
  const isSubmitDisabled = !requestType || selectedItemIds.length === 0 || !reason || isSubmitting;

  function selectType(nextType: ReturnRequestType) {
    setRequestType(nextType);
    setSelectedItemIds([]);
    setReason("");
    setNote("");
    setMessage(null);
    setError(null);
  }

  function toggleItem(itemId: string) {
    setSelectedItemIds((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    );
    setMessage(null);
    setError(null);
  }

  async function submitRequest() {
    if (isSubmitDisabled || !requestType) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/account/return-requests", {
        body: JSON.stringify({
          itemIds: selectedItemIds,
          note,
          orderId,
          reason,
          requestType,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const payload = (await response.json()) as {
        message?: string;
        request?: { requestNumber?: string };
      };

      if (!response.ok) {
        setError(payload.message ?? t.errorFallback);
        return;
      }

      setMessage(t.success(requestType, payload.request?.requestNumber ?? orderNumber));
      setSelectedItemIds([]);
      setReason("");
      setNote("");
    } catch {
      setError(t.networkError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-[#4d4635]/25 bg-[#161515] p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">{t.title}</p>
          <h3 className="mt-2 font-serif text-2xl text-[#f2ca50]">{t.heading}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d0c5af]/85">
            {t.summary}
          </p>
        </div>
        <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f] px-4 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#d0c5af]/65">{t.orderNumber}</div>
          <div className="mt-1 font-mono text-sm font-semibold text-[#f2ca50]">{orderNumber}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          aria-pressed={requestType === "CANCEL"}
          className={`rounded-lg border px-4 py-4 text-left transition-colors ${
            requestType === "CANCEL"
              ? "border-[#f2ca50]/45 bg-[#f2ca50]/10 text-[#f2ca50]"
              : "border-[#4d4635]/25 bg-[#201f1f] text-[#e5e2e1] hover:border-[#f2ca50]/35"
          } disabled:cursor-not-allowed disabled:opacity-45`}
          disabled={!canCancel}
          onClick={() => selectType("CANCEL")}
          type="button"
        >
          <span className="flex items-center gap-3 font-semibold">
            <XCircle className="h-5 w-5" aria-hidden="true" />
            {t.cancelRequest}
          </span>
          <span className="mt-2 block text-sm leading-6 text-[#d0c5af]/80">
            {t.cancelBody}
          </span>
        </button>

        <button
          aria-pressed={requestType === "REFUND"}
          className={`rounded-lg border px-4 py-4 text-left transition-colors ${
            requestType === "REFUND"
              ? "border-[#f2ca50]/45 bg-[#f2ca50]/10 text-[#f2ca50]"
              : "border-[#4d4635]/25 bg-[#201f1f] text-[#e5e2e1] hover:border-[#f2ca50]/35"
          } disabled:cursor-not-allowed disabled:opacity-45`}
          disabled={!canRefund}
          onClick={() => selectType("REFUND")}
          type="button"
        >
          <span className="flex items-center gap-3 font-semibold">
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            {t.refundRequest}
          </span>
          <span className="mt-2 block text-sm leading-6 text-[#d0c5af]/80">
            {t.refundBody}
          </span>
        </button>
      </div>

      {!canCancel || !canRefund ? (
        <p className="mt-3 flex gap-2 rounded-lg border border-[#4d4635]/25 bg-[#201f1f] p-3 text-sm leading-6 text-[#d0c5af]/85">
          <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#d4af37]" aria-hidden="true" />
          {t.closedNotice}
        </p>
      ) : null}

      {requestType ? (
        <div className="mt-5 space-y-5">
          <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f] p-4">
            <h4 className="text-sm font-semibold text-[#e5e2e1]">
              {requestType === "CANCEL" ? t.cancelTerms : t.refundTerms}
            </h4>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[#d0c5af]/85">
              {conditions.map((condition) => (
                <li className="flex gap-2" key={condition}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f2ca50]" />
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
            <Link
              className="mt-3 inline-flex text-sm font-semibold text-[#f2ca50] hover:text-[#d4af37]"
              href="/iade-ve-iptal-kosullari"
            >
              {t.link}
            </Link>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-[#e5e2e1]">{t.selectItems}</legend>
            {items.map((item) => (
              <label
                className="flex cursor-pointer flex-col gap-3 rounded-lg border border-[#4d4635]/25 bg-[#201f1f] p-4 transition-colors hover:border-[#f2ca50]/35 sm:flex-row sm:items-center sm:justify-between"
                key={item.id}
              >
                <span className="flex min-w-0 items-start gap-3">
                  <input
                    checked={selectedItemIds.includes(item.id)}
                    className="mt-1 h-4 w-4 accent-[#f2ca50]"
                    onChange={() => toggleItem(item.id)}
                    type="checkbox"
                  />
                  <span className="min-w-0">
                    <span className="block break-words font-medium text-[#e5e2e1]">{item.productName}</span>
                    <span className="mt-1 block text-sm text-[#d0c5af]/75">
                      {item.quantity} {t.unit}{item.variantName ? ` • ${item.variantName}` : ""}
                    </span>
                  </span>
                </span>
                <span className="pl-7 font-semibold text-[#f2ca50] sm:pl-0">{formatPrice(item.totalPrice)}</span>
              </label>
            ))}
          </fieldset>

          <label className="block">
            <span className="text-sm font-semibold text-[#e5e2e1]">{t.reason}</span>
            <select
              className="mt-2 w-full rounded-lg border border-[#4d4635]/35 bg-[#201f1f] px-4 py-3 text-sm text-[#e5e2e1] outline-none transition-colors focus:border-[#f2ca50]/60"
              onChange={(event) => setReason(event.target.value)}
              value={reason}
            >
              <option value="">{t.reasonPlaceholder}</option>
              {reasonOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#e5e2e1]">{t.note}</span>
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-[#4d4635]/35 bg-[#201f1f] px-4 py-3 text-sm leading-6 text-[#e5e2e1] outline-none transition-colors placeholder:text-[#d0c5af]/45 focus:border-[#f2ca50]/60"
              maxLength={1000}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t.notePlaceholder}
              value={note}
            />
          </label>

          {message ? (
            <p className="flex gap-2 rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-200">
              <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {message}
            </p>
          ) : null}

          {error ? (
            <p className="flex gap-2 rounded-lg border border-red-300/25 bg-red-400/10 p-3 text-sm leading-6 text-red-200">
              <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          ) : null}

          <button
            className="inline-flex w-full items-center justify-center rounded-full bg-[#f2ca50] px-5 py-3 text-sm font-semibold text-[#131313] transition-colors hover:bg-[#d4af37] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            disabled={isSubmitDisabled}
            onClick={submitRequest}
            type="button"
          >
            {isSubmitting ? t.submitting : t.submit}
          </button>
        </div>
      ) : null}
    </section>
  );
}
