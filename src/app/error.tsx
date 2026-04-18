"use client";

export default function ErrorPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="panel p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          Bir sorun olustu
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">
          Sayfa yuklenirken beklenmeyen bir hata alindi.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          Yenileyip tekrar deneyebilirsin. Sorun surerse WhatsApp destek hattina ulas.
        </p>
      </div>
    </div>
  );
}
