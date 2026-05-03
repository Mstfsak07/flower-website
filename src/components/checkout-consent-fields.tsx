import Link from "next/link";
import type { InputHTMLAttributes } from "react";

import type { Locale } from "@/lib/locale";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

type CheckoutConsentFieldsProps = {
  distanceSalesInputProps: CheckboxProps;
  locale?: Locale;
  privacyInputProps: CheckboxProps;
  returnPolicyInputProps: CheckboxProps;
  variant?: "dark" | "light";
};

const copy = {
  tr: {
    legend: "Sipariş onay metinleri",
    distance: "Mesafeli Satış Sözleşmesini",
    distanceSuffix: "okudum ve kabul ediyorum.",
    privacy: "Gizlilik Politikasını",
    privacySuffix: "okudum.",
    returnPrefix: "Gerekirse",
    returnPolicy: "İade ve İptal Koşullarını",
    returnSuffix: "okudum.",
  },
  en: {
    legend: "Order consent texts",
    distance: "Distance Sales Agreement",
    distanceSuffix: "I have read and accept it.",
    privacy: "Privacy Policy",
    privacySuffix: "I have read it.",
    returnPrefix: "Where applicable,",
    returnPolicy: "Returns and Cancellations",
    returnSuffix: "I have read them.",
  },
} as const;

export function CheckoutConsentFields({
  distanceSalesInputProps,
  locale = "tr",
  privacyInputProps,
  returnPolicyInputProps,
  variant = "light",
}: CheckoutConsentFieldsProps) {
  const t = copy[locale];
  const isDark = variant === "dark";
  const labelClass = isDark
    ? "flex items-start gap-3 rounded-xl border border-[#4d46351a] bg-[#151515] px-4 py-4 text-sm leading-6 text-neutral-300"
    : "flex items-start gap-3 rounded-[1.25rem] border border-[var(--color-line)] bg-white px-4 py-4 text-sm leading-6 text-[var(--color-muted)]";
  const linkClass = isDark
    ? "font-semibold text-[#f2ca50] underline-offset-4 hover:underline"
    : "font-semibold text-[var(--color-accent)] underline-offset-4 hover:underline";

  return (
    <fieldset className={isDark ? "grid gap-3" : "grid gap-3"}>
      <legend className={isDark ? "sr-only" : "sr-only"}>{t.legend}</legend>
      <label className={labelClass}>
        <input className="mt-1 size-4 shrink-0" type="checkbox" {...distanceSalesInputProps} />
        <span>
          <Link className={linkClass} href="/mesafeli-satis-sozlesmesi" rel="noreferrer" target="_blank">
            {t.distance}
          </Link>{" "}
          {t.distanceSuffix}
        </span>
      </label>
      <label className={labelClass}>
        <input className="mt-1 size-4 shrink-0" type="checkbox" {...privacyInputProps} />
        <span>
          <Link className={linkClass} href="/gizlilik-politikasi" rel="noreferrer" target="_blank">
            {t.privacy}
          </Link>{" "}
          {t.privacySuffix}
        </span>
      </label>
      <label className={labelClass}>
        <input className="mt-1 size-4 shrink-0" type="checkbox" {...returnPolicyInputProps} />
        <span>
          {t.returnPrefix}{" "}
          <Link className={linkClass} href="/iade-ve-iptal-kosullari" rel="noreferrer" target="_blank">
            {t.returnPolicy}
          </Link>{" "}
          {t.returnSuffix}
        </span>
      </label>
    </fieldset>
  );
}
