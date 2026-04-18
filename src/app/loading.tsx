export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="panel animate-pulse p-10">
        <div className="h-6 w-32 rounded-full bg-[var(--color-card)]" />
        <div className="mt-6 h-14 w-3/4 rounded-2xl bg-[var(--color-card)]" />
        <div className="mt-4 h-24 w-full rounded-3xl bg-[var(--color-card)]" />
      </div>
    </div>
  );
}
