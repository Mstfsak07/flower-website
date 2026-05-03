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
    <div className="space-y-5">
      <p className="editorial-label inline-block rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 px-3 py-1 text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="max-w-3xl font-serif text-4xl leading-[1.02] tracking-[-0.03em] text-[var(--color-ink)] sm:text-5xl lg:text-[3.75rem]">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">{description}</p>
    </div>
  );
}
