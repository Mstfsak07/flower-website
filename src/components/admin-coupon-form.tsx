"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";

export function AdminCouponForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setError(null);

    const payload = {
      code: String(formData.get("code") ?? ""),
      endsAt: String(formData.get("endsAt") ?? ""),
      isActive: formData.get("isActive") === "on",
      maxDiscountAmount: optionalNumber(formData.get("maxDiscountAmount")),
      minOrderAmount: Number(formData.get("minOrderAmount") || 0),
      startsAt: String(formData.get("startsAt") ?? ""),
      type: String(formData.get("type") ?? "PERCENT"),
      usageLimit: optionalNumber(formData.get("usageLimit")),
      value: Number(formData.get("value") || 0),
    };

    const response = await fetch("/api/admin/coupons", {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => null);

    setSubmitting(false);

    if (!response?.ok) {
      setError("Kupon eklenemedi. Kod, tutar ve tarih alanlarını kontrol edin.");
      return;
    }

    form.reset();
    router.refresh();
  }

  return (
    <form className="panel grid gap-4 p-6" onSubmit={handleSubmit}>
      <h2 className="font-serif text-3xl text-[var(--color-ink)]">Kupon Ekle</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Kupon Kodu" name="code" placeholder="YENI10" required />
        <label className="grid gap-2 text-sm font-medium">
          Tip
          <select className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3" name="type">
            <option value="PERCENT">Yüzde</option>
            <option value="FIXED">Sabit Tutar</option>
          </select>
        </label>
        <Field label="İndirim Değeri" min="1" name="value" required type="number" />
        <Field label="Minimum Sepet" min="0" name="minOrderAmount" required type="number" />
        <Field label="Maksimum İndirim" min="1" name="maxDiscountAmount" type="number" />
        <Field label="Kullanım Limiti" min="1" name="usageLimit" type="number" />
        <Field label="Başlangıç" name="startsAt" required type="date" />
        <Field label="Bitiş" name="endsAt" required type="date" />
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-medium">
        <input className="size-4" defaultChecked name="isActive" type="checkbox" />
        Aktif
      </label>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <button
        className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        disabled={submitting}
        type="submit"
      >
        {submitting ? "Ekleniyor" : "Kuponu Ekle"}
      </button>
    </form>
  );
}

function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" {...inputProps} />
    </label>
  );
}

function optionalNumber(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw ? Number(raw) : undefined;
}
