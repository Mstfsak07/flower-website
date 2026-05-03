"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, Sparkles, WandSparkles } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { getLocalizedProduct } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";

type BouquetBriefResult = {
  title: string;
  summary: string;
  mood: string;
  palette: string[];
  flowerNotes: string[];
  wrappingStyle: string;
  cardMessage: string;
  recommendedProductSlug: string;
  arrangementItems: Array<{
    flower: string;
    quantity: number;
    purpose: string;
  }>;
  effectNotes: string[];
  floristComment: string;
  warning?: string;
  provider?: "gemini" | "openai" | "local";
};

type CopySet = {
  eyebrow: string;
  title: string;
  description: string;
  textareaLabel: string;
  textareaPlaceholder: string;
  occasionLabel: string;
  occasionPlaceholder: string;
  budgetLabel: string;
  budgetPlaceholder: string;
  submit: string;
  loading: string;
  fallbackNote: string;
  ideaTitle: string;
  mood: string;
  palette: string;
  flowerNotes: string;
  wrappingStyle: string;
  cardMessage: string;
  recommended: string;
  recipe: string;
  effectNotes: string;
  floristComment: string;
  invalidKey: string;
  emptyTitle: string;
  emptyText: string;
  examples: string[];
  apiError: string;
};

const copy: Record<Locale, CopySet> = {
  tr: {
    eyebrow: "Ne Istedigini Anlat",
    title: "Tarifinden Ozel Buket Onerisi Uretelim",
    description:
      "Renkleri, duyguyu, vesileyi veya aklindaki genel havayi yaz. Sistem bunu magazadaki bir urunle eslestirip sap bazli aranjman onerisi kursun.",
    textareaLabel: "Tarifin",
    textareaPlaceholder: "Ornek: Romantik ama fazla agir olmayan, kirmizi tonlarda, premium hisli bir buket istiyorum.",
    occasionLabel: "Vesile",
    occasionPlaceholder: "Dogum gunu, yildonumu, tesekkur...",
    budgetLabel: "Butce",
    budgetPlaceholder: "Ornek: 1500 TL civari",
    submit: "Oneri Hazirla",
    loading: "Yorumlaniyor",
    fallbackNote: "Metin Gemini ile yorumlanir. Sonucta tek urun onerisi ve sap bazli aranjman recetesi gelir.",
    ideaTitle: "Onerilen Konsept",
    mood: "Hava",
    palette: "Renk Paleti",
    flowerNotes: "Cicek Notlari",
    wrappingStyle: "Sunum",
    cardMessage: "Kart Mesaji",
    recommended: "Onerilen Urun",
    recipe: "Aranjman Recetesi",
    effectNotes: "Bunu Eklersek Ne Katar?",
    floristComment: "Florist Notu",
    invalidKey: "Gemini API anahtari gecersiz gorunuyor; sistem yerel fallback kullaniyor.",
    emptyTitle: "Tarifini gir, sonuc burada gelsin",
    emptyText: "AI yorumundan sonra magazadan tek urun onerisi, sap adetleri ve buketin verecegi his burada gosterilecek.",
    examples: [
      "Kirmizi tonlarda romantik bir yildonumu buketi",
      "Beyaz ve yesil agirlikli sade ama premium ofis hediyesi",
      "Mor-lila tonlarda zarif ve modern dogum gunu aranjmani",
    ],
    apiError: "Oneri hazirlanamadi. Tarifini biraz daha netlestirip tekrar dene.",
  },
  en: {
    eyebrow: "Describe What You Want",
    title: "Build A Store-Based Bouquet Plan From Your Brief",
    description:
      "Write the colors, mood, occasion, or overall feeling you want. The system will match one store product and then build a stem-by-stem arrangement plan around it.",
    textareaLabel: "Your brief",
    textareaPlaceholder: "Example: I want something romantic in red tones, premium but not too heavy.",
    occasionLabel: "Occasion",
    occasionPlaceholder: "Birthday, anniversary, thank you...",
    budgetLabel: "Budget",
    budgetPlaceholder: "Example: Around 1500 TRY",
    submit: "Generate Suggestion",
    loading: "Interpreting brief",
    fallbackNote: "Text is interpreted with Gemini. The result includes one product suggestion and a stem-based arrangement recipe.",
    ideaTitle: "Suggested Concept",
    mood: "Mood",
    palette: "Color Palette",
    flowerNotes: "Flower Notes",
    wrappingStyle: "Presentation",
    cardMessage: "Card Message",
    recommended: "Recommended Product",
    recipe: "Arrangement Recipe",
    effectNotes: "What Each Addition Changes",
    floristComment: "Florist Note",
    invalidKey: "The Gemini API key appears invalid, so the system is using a local fallback.",
    emptyTitle: "Enter your brief to see the result here",
    emptyText: "After the AI interpretation, you will see one store product, a practical arrangement recipe, and notes about the feeling each addition creates.",
    examples: [
      "A romantic anniversary bouquet in deep red tones",
      "A clean but premium office gift with white and green notes",
      "An elegant modern birthday arrangement in lilac and violet tones",
    ],
    apiError: "The suggestion could not be prepared. Try a slightly clearer brief.",
  },
};

export function BouquetAiPlayground({ locale, products }: { locale: Locale; products: Product[] }) {
  const t = copy[locale];
  const [brief, setBrief] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<BouquetBriefResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const recommendedProduct = result ? products.find((product) => product.slug === result.recommendedProductSlug) ?? null : null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setWarning(null);

    startTransition(async () => {
      const response = await fetch("/api/ai/bouquet-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brief,
          occasion,
          budget,
          locale,
        }),
      });

      if (!response.ok) {
        setResult(null);
        setError(t.apiError);
        return;
      }

      const payload = (await response.json()) as BouquetBriefResult;
      setResult(payload);
      if (payload.warning?.includes("API_KEY_INVALID")) {
        setWarning(t.invalidKey);
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
      <section className="rounded-[2rem] border border-white/10 bg-[rgba(11,17,12,0.78)] p-6 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f3d98b]">
          <Sparkles className="size-3.5" />
          {t.eyebrow}
        </div>
        <h1 className="mt-5 max-w-xl font-serif text-4xl tracking-tight text-white md:text-6xl">{t.title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 md:text-base">{t.description}</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/88">{t.textareaLabel}</span>
            <textarea
              className="min-h-44 w-full rounded-[1.7rem] border border-white/10 bg-black/30 px-5 py-4 text-sm text-white outline-none transition focus:border-[#d4af37]/60"
              onChange={(event) => setBrief(event.target.value)}
              placeholder={t.textareaPlaceholder}
              required
              value={brief}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/88">{t.occasionLabel}</span>
              <input
                className="w-full rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]/60"
                onChange={(event) => setOccasion(event.target.value)}
                placeholder={t.occasionPlaceholder}
                value={occasion}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/88">{t.budgetLabel}</span>
              <input
                className="w-full rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]/60"
                onChange={(event) => setBudget(event.target.value)}
                placeholder={t.budgetPlaceholder}
                value={budget}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            {t.examples.map((example) => (
              <button
                key={example}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/76 transition hover:border-[#d4af37]/30 hover:text-white"
                onClick={() => setBrief(example)}
                type="button"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-6 text-white/45">{t.fallbackNote}</p>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending || brief.trim().length < 10}
              type="submit"
            >
              {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <WandSparkles className="size-4" />}
              {isPending ? t.loading : t.submit}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,29,24,0.9),rgba(8,12,10,0.96))] p-6 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.9)] md:p-8">
        {error ? <div className="rounded-[1.6rem] border border-red-400/25 bg-red-500/10 p-5 text-sm text-red-100">{error}</div> : null}
        {warning ? <div className="rounded-[1.6rem] border border-amber-400/25 bg-amber-500/10 p-5 text-sm text-amber-100">{warning}</div> : null}

        {!result ? (
          <div className="flex h-full min-h-[32rem] flex-col justify-between gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#f3d98b]">{t.ideaTitle}</div>
              <h2 className="mt-4 font-serif text-3xl text-white">{t.emptyTitle}</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">{t.emptyText}</p>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-4 text-xs uppercase tracking-[0.2em] text-white/45">{t.recommended}</div>
              <div className="grid gap-3">
                {products.slice(0, 3).map((product) => {
                  const localizedProduct = getLocalizedProduct(product, locale);
                  return (
                    <Link
                      key={product.id}
                      className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/8 bg-black/15 px-4 py-3 text-sm text-white/80 transition hover:border-[#d4af37]/30 hover:bg-black/25"
                      href={`/urun/${product.slug}`}
                    >
                      <div>
                        <div className="font-medium text-white">{localizedProduct.name}</div>
                        <div className="mt-1 text-xs text-white/45">{localizedProduct.shortDescription}</div>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-[#f3d98b]" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[#f3d98b]">{t.ideaTitle}</div>
              <h2 className="mt-4 font-serif text-3xl text-white md:text-4xl">{result.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">{result.summary}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.mood}</div>
                <div className="mt-3 text-lg text-white">{result.mood}</div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.wrappingStyle}</div>
                <div className="mt-3 text-sm leading-7 text-white/76">{result.wrappingStyle}</div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.palette}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.palette.map((tone) => (
                    <span
                      key={tone}
                      className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-medium text-[#f8e3a6]"
                    >
                      {tone}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.flowerNotes}</div>
                <ul className="mt-4 space-y-2 text-sm text-white/76">
                  {result.flowerNotes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.recipe}</div>
                <div className="mt-4 space-y-3">
                  {result.arrangementItems.map((item) => (
                    <div key={`${item.flower}-${item.quantity}`} className="rounded-[1rem] border border-white/8 bg-black/15 px-4 py-3">
                      <div className="text-sm font-semibold text-white">
                        {item.quantity} x {item.flower}
                      </div>
                      <div className="mt-1 text-sm leading-6 text-white/65">{item.purpose}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.effectNotes}</div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/76">
                  {result.effectNotes.map((note) => (
                    <li key={note}>• {note}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.cardMessage}</div>
                <p className="mt-4 text-lg leading-8 text-white">{result.cardMessage}</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">{t.floristComment}</div>
                <p className="mt-4 text-sm leading-7 text-white/76">{result.floristComment}</p>
              </div>
            </div>

            <div>
              <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[#f3d98b]">{t.recommended}</div>
              {recommendedProduct ? <ProductCard locale={locale} product={recommendedProduct} /> : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
