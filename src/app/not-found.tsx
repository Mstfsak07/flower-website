import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="panel p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          404
        </p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">Aradigin sayfa yok.</h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          Urun kaldirilmis olabilir ya da baglanti hatali olabilir.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
          href="/"
        >
          Ana sayfaya don
        </Link>
      </div>
    </div>
  );
}
