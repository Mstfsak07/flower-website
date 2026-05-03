"use client";

import { useState, type FormEvent } from "react";

export function AdminPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/account/password", {
      body: JSON.stringify({
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
        currentPassword: String(formData.get("currentPassword") ?? ""),
        nextPassword: String(formData.get("nextPassword") ?? ""),
      }),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    }).catch(() => null);

    setSubmitting(false);

    if (!response?.ok) {
      const body = (await response?.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "Şifre değiştirilemedi.");
      return;
    }

    form.reset();
    setMessage("Şifre güncellendi.");
  }

  return (
    <form className="panel grid max-w-2xl gap-4 p-6" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium">
        Mevcut Şifre
        <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" name="currentPassword" required type="password" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Yeni Şifre
        <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" name="nextPassword" required type="password" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Yeni Şifre Tekrar
        <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" name="confirmPassword" required type="password" />
      </label>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {message ? <p className="text-sm font-medium text-green-700">{message}</p> : null}
      <button
        className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        disabled={submitting}
        type="submit"
      >
        {submitting ? "Güncelleniyor" : "Şifreyi Değiştir"}
      </button>
    </form>
  );
}
