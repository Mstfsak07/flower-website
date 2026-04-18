import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <div className="panel p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Demo Auth
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">Kayit Ol</h1>
        <div className="mt-6 grid gap-4">
          <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" placeholder="Ad Soyad" />
          <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" placeholder="E-posta" />
          <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" placeholder="Telefon" />
          <input className="rounded-2xl border border-[var(--color-line)] px-4 py-3" placeholder="Sifre" type="password" />
          <Link
            className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-center text-sm font-semibold text-white"
            href="/hesabim"
          >
            Demo Hesap Ac
          </Link>
        </div>
      </div>
    </section>
  );
}
