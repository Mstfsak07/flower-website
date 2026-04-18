"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { sanitizeRedirectPath } from "@/lib/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({
        email,
        password,
        redirectTo: sanitizeRedirectPath(searchParams.get("redirect"), "/hesabim"),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Giris basarisiz.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="panel p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
        Guvenli Giris
      </p>
      <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">Giris Yap</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
        Musteri hesabin icin kayit olduktan sonra oturum acabilir veya yonetim paneli icin admin
        hesabi ile giris yapabilirsin.
      </p>

      <div className="mt-5 rounded-[1.5rem] bg-[var(--color-card)] p-4 text-sm text-[var(--color-muted)]">
        <div className="font-semibold text-[var(--color-ink)]">Demo admin girisi</div>
        <div className="mt-1">E-posta: admin@lunacicek.test</div>
        <div>Sifre: Admin123!</div>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form className="mt-6 grid gap-4" noValidate onSubmit={handleSubmit}>
        <input
          autoComplete="email"
          className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-posta"
          type="email"
          value={email}
        />
        <input
          autoComplete="current-password"
          className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Sifre"
          type="password"
          value={password}
        />
        <button
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-center text-sm font-semibold text-white disabled:opacity-70"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Giris yapiliyor..." : "Giris Yap"}
        </button>
      </form>

      <div className="mt-6 text-sm text-[var(--color-muted)]">
        Hesabin yok mu?{" "}
        <Link className="font-semibold text-[var(--color-accent)]" href="/kayit-ol">
          Kayit Ol
        </Link>
      </div>
    </div>
  );
}
