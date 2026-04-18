"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";

export function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register({
        ...form,
        phone: form.phone.trim() ? form.phone : undefined,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Kayit basarisiz.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="panel p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
        Hesap Olustur
      </p>
      <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">Kayit Ol</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
        Musteri hesabi olusturdugunda oturum otomatik acilir. Isletme kaydi bu projede kapali;
        yonetim girisi ayrica admin hesabi ile yapilir.
      </p>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form className="mt-6 grid gap-4" noValidate onSubmit={handleSubmit}>
        <input
          autoComplete="name"
          className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Ad Soyad"
          value={form.name}
        />
        <input
          autoComplete="email"
          className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="E-posta"
          type="email"
          value={form.email}
        />
        <input
          autoComplete="tel"
          className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="Telefon"
          value={form.phone}
        />
        <input
          autoComplete="new-password"
          className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="Sifre"
          type="password"
          value={form.password}
        />
        <input
          autoComplete="new-password"
          className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder="Sifre Tekrar"
          type="password"
          value={form.confirmPassword}
        />
        <button
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-center text-sm font-semibold text-white disabled:opacity-70"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Hesap olusturuluyor..." : "Hesap Olustur"}
        </button>
      </form>

      <div className="mt-6 text-sm text-[var(--color-muted)]">
        Zaten hesabin var mi?{" "}
        <Link className="font-semibold text-[var(--color-accent)]" href="/giris">
          Giris Yap
        </Link>
      </div>
    </div>
  );
}
