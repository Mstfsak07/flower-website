export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <p className="inline-block rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="max-w-2xl font-serif text-4xl leading-[1.15] tracking-tight text-[var(--color-ink)] sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">{description}</p>
    </div>
  );
}
