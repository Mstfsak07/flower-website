export function ContentPageView({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: string;
}) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-[0_24px_70px_-45px_rgba(71,46,56,.35)] sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Bilgilendirme
        </p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-muted)]">{description}</p>
        <div className="mt-8 space-y-4 text-[15px] leading-8 text-[var(--color-ink)]">
          {content.split(". ").map((paragraph) => (
            <p key={paragraph}>{paragraph.trim().endsWith(".") ? paragraph.trim() : `${paragraph.trim()}.`}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
