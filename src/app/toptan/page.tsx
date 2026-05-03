import { Noto_Serif } from "next/font/google";

import { WholesaleFormView } from "@/components/wholesale-form-view";
import { getDictionary } from "@/lib/i18n";

const display = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export default async function WholesalePage() {
  const dict = await getDictionary();

  return (
    <div className="relative overflow-x-hidden bg-[#131313] pb-10 pt-3 text-[#e5e2e1]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(233,193,118,.08),transparent_26%),linear-gradient(180deg,#131313_0%,#0e0e0e_100%)]" />
      <section className="mx-auto max-w-[1180px] px-4">
        <div className="pt-24" />
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-6 pt-10">
        <div className="rounded-[2rem] border border-[#4e463933] bg-[#13131399] p-8 shadow-[0_20px_44px_-24px_rgba(0,0,0,.28)] backdrop-blur-xl sm:p-10">
          <p className="text-[0.78rem] uppercase tracking-[0.24em] text-[#e9c176]">{dict.wholesale.eyebrow}</p>
          <h1 className={`${display.className} mt-4 max-w-3xl text-5xl italic leading-[0.95] tracking-[-0.04em] text-[#e5e2e1] sm:text-6xl`}>
            {dict.wholesale.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#d1c5b4]">
            {dict.wholesale.description}
          </p>
        </div>
      </section>

      <div
        style={{
          ["--color-surface" as string]: "#131313",
          ["--color-card" as string]: "#201f1f",
          ["--color-card-strong" as string]: "#2a2a2a",
          ["--color-glass" as string]: "rgba(19,19,19,0.6)",
          ["--color-glass-strong" as string]: "rgba(32,31,31,0.85)",
          ["--color-line" as string]: "rgba(78,70,57,0.28)",
          ["--color-line-strong" as string]: "rgba(78,70,57,0.42)",
          ["--color-ink" as string]: "#e5e2e1",
          ["--color-muted" as string]: "#d1c5b4",
          ["--color-accent" as string]: "#e9c176",
          ["--color-accent-dark" as string]: "#c5a059",
          ["--color-shadow" as string]: "rgba(0,0,0,.4)",
          ["--depth-shadow" as string]: "0 24px 44px -24px rgba(0,0,0,.45)",
        }}
      >
        <WholesaleFormView />
      </div>
    </div>
  );
}
