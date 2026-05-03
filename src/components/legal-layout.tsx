import Link from "next/link";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/locale";
import { getBrandName, localizedLegalLinks } from "@/lib/site-config";

type LegalLayoutProps = {
  children: ReactNode;
  description: string;
  eyebrow?: string;
  locale?: Locale;
  note?: string;
  title: string;
};

export function LegalLayout({
  children,
  description,
  eyebrow = "Yasal Bilgilendirme",
  locale = "tr",
  note,
  title,
}: LegalLayoutProps) {
  const legalLinks = localizedLegalLinks[locale];
  const asideTitle = locale === "en" ? "Corporate pages" : "Kurumsal sayfalar";
  const navLabel = locale === "en" ? "Legal and corporate pages" : "Yasal ve kurumsal sayfalar";

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fcf9f4_0%,#f6eee6_55%,#f2e7dc_100%)] px-4 pb-20 pt-32 text-[#2f2623] sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(255,146,72,0.16),transparent_24%),radial-gradient(circle_at_85%_12%,rgba(68,128,100,0.12),transparent_22%)]"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="rounded-[2rem] border border-[#ead8d2] bg-white/90 p-6 shadow-[0_26px_70px_-46px_rgba(47,38,35,0.35)] backdrop-blur sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#aa2e28]">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#2f2623] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#6d5b57]">
            {description}
          </p>

          <div className="mt-10 space-y-10 text-[15px] leading-8 text-[#3c302d]">
            {children}
          </div>

          {note ? (
            <p className="mt-10 rounded-2xl border border-[#ead8d2] bg-[#fff8f3] px-5 py-4 text-sm leading-7 text-[#6d5b57]">
              {note}
            </p>
          ) : null}
        </article>

        <aside className="h-fit rounded-[2rem] border border-[#ead8d2] bg-[#fff8f3]/90 p-6 shadow-[0_20px_60px_-48px_rgba(47,38,35,0.35)] lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#aa2e28]">
            {getBrandName()}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-[#2f2623]">{asideTitle}</h2>
          <nav aria-label={navLabel} className="mt-6">
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="block rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[#6d5b57] transition hover:border-[#e3c5bf] hover:bg-white hover:text-[#aa2e28]"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </section>
  );
}

type LegalSectionProps = {
  children: ReactNode;
  title: string;
};

export function LegalSection({ children, title }: LegalSectionProps) {
  return (
    <section className="border-t border-[#ead8d2] pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-2xl text-[#aa2e28] sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

type BulletListProps = {
  items: string[];
};

export function BulletList({ items }: BulletListProps) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
