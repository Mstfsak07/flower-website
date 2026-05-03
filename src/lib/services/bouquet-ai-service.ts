import "server-only";

import { z } from "zod";

import { getLocalizedProduct } from "@/lib/data";
import { env } from "@/lib/env";
import { listProducts } from "@/lib/services/catalog-service";

const optionalTextField = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.string().min(1).max(80).optional());

const bouquetBriefInputSchema = z.object({
  brief: z.string().trim().min(10).max(1200),
  occasion: optionalTextField,
  budget: optionalTextField,
  locale: z.enum(["tr", "en"]),
});

const bouquetBriefResultSchema = z.object({
  title: z.string().min(3).max(120),
  summary: z.string().min(20).max(600),
  mood: z.string().min(3).max(120),
  palette: z.array(z.string().min(2).max(40)).min(2).max(5),
  flowerNotes: z.array(z.string().min(2).max(80)).min(3).max(6),
  wrappingStyle: z.string().min(3).max(160),
  cardMessage: z.string().min(3).max(220),
  recommendedProductSlug: z.string().min(1),
  arrangementItems: z
    .array(
      z.object({
        flower: z.string().min(2).max(60),
        quantity: z.number().int().min(1).max(20),
        purpose: z.string().min(3).max(140),
      }),
    )
    .min(3)
    .max(6),
  effectNotes: z.array(z.string().min(8).max(180)).min(2).max(4),
  floristComment: z.string().min(20).max(400),
});

type BouquetBriefInput = z.infer<typeof bouquetBriefInputSchema>;
export type BouquetBriefResult = z.infer<typeof bouquetBriefResultSchema>;

const outputSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "summary",
    "mood",
    "palette",
    "flowerNotes",
    "wrappingStyle",
    "cardMessage",
    "recommendedProductSlug",
    "arrangementItems",
    "effectNotes",
    "floristComment",
  ],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    mood: { type: "string" },
    palette: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
    flowerNotes: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
    wrappingStyle: { type: "string" },
    cardMessage: { type: "string" },
    recommendedProductSlug: { type: "string" },
    arrangementItems: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["flower", "quantity", "purpose"],
        properties: {
          flower: { type: "string" },
          quantity: { type: "integer" },
          purpose: { type: "string" },
        },
      },
    },
    effectNotes: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
    floristComment: { type: "string" },
  },
} as const;

function normalize(value: string) {
  return value.toLocaleLowerCase("tr-TR");
}

function scoreText(haystack: string, keywords: string[]) {
  const normalizedHaystack = normalize(haystack);
  return keywords.reduce((score, keyword) => (normalizedHaystack.includes(normalize(keyword)) ? score + 1 : score), 0);
}

const turkishFlowerTermReplacements = [
  { pattern: /\broses\b/gi, replacement: "güller" },
  { pattern: /\brose\b/gi, replacement: "gül" },
  { pattern: /\bdaisies\b/gi, replacement: "papatyalar" },
  { pattern: /\bdaisy\b/gi, replacement: "papatya" },
  { pattern: /\bcarnations\b/gi, replacement: "karanfiller" },
  { pattern: /\bcarnation\b/gi, replacement: "karanfil" },
  { pattern: /\borchids\b/gi, replacement: "orkideler" },
  { pattern: /\borchid\b/gi, replacement: "orkide" },
  { pattern: /\btulips\b/gi, replacement: "laleler" },
  { pattern: /\btulip\b/gi, replacement: "lale" },
  { pattern: /\bgeraniums\b/gi, replacement: "sardunyalar" },
  { pattern: /\bgeranium\b/gi, replacement: "sardunya" },
  { pattern: /\bbegonias\b/gi, replacement: "begonyalar" },
  { pattern: /\bbegonia\b/gi, replacement: "begonya" },
  { pattern: /\blavenders\b/gi, replacement: "lavantalar" },
  { pattern: /\blavender\b/gi, replacement: "lavanta" },
  { pattern: /\bpetunias\b/gi, replacement: "petunyalar" },
  { pattern: /\bpetunia\b/gi, replacement: "petunya" },
  { pattern: /\bviolets\b/gi, replacement: "menekşeler" },
  { pattern: /\bviolet\b/gi, replacement: "menekşe" },
  { pattern: /\bkalanchoe\b/gi, replacement: "kalanşo" },
  { pattern: /\beucalyptus\b/gi, replacement: "okaliptüs" },
  { pattern: /\bbaby'?s breath\b/gi, replacement: "cipso" },
  { pattern: /\blilies\b/gi, replacement: "zambaklar" },
  { pattern: /\blily\b/gi, replacement: "zambak" },
  { pattern: /\bhydrangeas\b/gi, replacement: "ortancalar" },
  { pattern: /\bhydrangea\b/gi, replacement: "ortanca" },
  { pattern: /\bpeonies\b/gi, replacement: "şakayıklar" },
  { pattern: /\bpeony\b/gi, replacement: "şakayık" },
];

function localizeFlowerTerms(value: string, locale: BouquetBriefInput["locale"]) {
  if (locale !== "tr") {
    return value;
  }

  let localized = value;

  for (const entry of turkishFlowerTermReplacements) {
    localized = localized.replace(entry.pattern, entry.replacement);
  }

  return localized;
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }

  return value[0].toLocaleUpperCase("tr-TR") + value.slice(1);
}

function localizeBouquetResult(result: BouquetBriefResult, locale: BouquetBriefInput["locale"]): BouquetBriefResult {
  if (locale !== "tr") {
    return result;
  }

  return {
    ...result,
    title: localizeFlowerTerms(result.title, locale),
    summary: localizeFlowerTerms(result.summary, locale),
    mood: localizeFlowerTerms(result.mood, locale),
    palette: result.palette.map((item) => localizeFlowerTerms(item, locale)),
    flowerNotes: result.flowerNotes.map((item) => localizeFlowerTerms(item, locale)),
    wrappingStyle: localizeFlowerTerms(result.wrappingStyle, locale),
    cardMessage: localizeFlowerTerms(result.cardMessage, locale),
    arrangementItems: result.arrangementItems.map((item) => ({
      ...item,
      flower: capitalize(localizeFlowerTerms(item.flower, locale)),
      purpose: localizeFlowerTerms(item.purpose, locale),
    })),
    effectNotes: result.effectNotes.map((item) => localizeFlowerTerms(item, locale)),
    floristComment: localizeFlowerTerms(result.floristComment, locale),
  };
}

function buildArrangement(locale: BouquetBriefInput["locale"], brief: string) {
  const normalizedBrief = normalize(brief);

  if (locale === "en") {
    if (normalizedBrief.includes("romantic") || normalizedBrief.includes("red") || normalizedBrief.includes("anniversary")) {
      return {
        arrangementItems: [
          { flower: "Rose", quantity: 4, purpose: "Build the main romantic focal line." },
          { flower: "Daisy", quantity: 2, purpose: "Soften the bouquet and add sincerity." },
          { flower: "Eucalyptus", quantity: 3, purpose: "Create cooler movement and depth around the core blooms." },
        ],
        effectNotes: [
          "If you increase the rose count, the bouquet feels more premium and direct.",
          "Adding daisies makes the arrangement feel more open, warm, and approachable.",
          "Greens like eucalyptus stop the bouquet from looking flat and make the silhouette breathe.",
        ],
      };
    }

    return {
      arrangementItems: [
        { flower: "Daisy", quantity: 4, purpose: "Keep the bouquet bright and airy." },
        { flower: "Rose", quantity: 2, purpose: "Add a premium focal accent without making it heavy." },
        { flower: "Lavender", quantity: 3, purpose: "Introduce a calmer and more refined character." },
      ],
      effectNotes: [
        "More daisies create a softer and more natural mood.",
        "A smaller rose layer gives polish without turning the bouquet too formal.",
        "Lavender shifts the feeling toward calm elegance and a slightly more modern tone.",
      ],
    };
  }

  if (normalizedBrief.includes("romantik") || normalizedBrief.includes("kirmizi") || normalizedBrief.includes("yildonumu")) {
    return {
      arrangementItems: [
        { flower: "Gül", quantity: 4, purpose: "Ana romantik odagi kurar." },
        { flower: "Papatya", quantity: 2, purpose: "Buketi yumusatir ve daha icten bir his verir." },
        { flower: "Okaliptüs", quantity: 3, purpose: "Yesil hareket ve derinlik ekler." },
      ],
      effectNotes: [
        "Gül miktarini arttirmak aranjmani daha premium ve net romantik yapar.",
        "Papatya eklemek buketi daha sicak, daha samimi ve daha yumuşak hissettirir.",
        "Okaliptüs gibi yesillikler formu acar ve buketin nefes almasini saglar.",
      ],
    };
  }

  return {
    arrangementItems: [
      { flower: "Papatya", quantity: 4, purpose: "Bukete ferah ve acik bir siluet verir." },
      { flower: "Gül", quantity: 2, purpose: "Fazla agirlastirmadan premium vurgu ekler." },
      { flower: "Lavanta", quantity: 3, purpose: "Daha sakin ve rafine bir ton kurar." },
    ],
    effectNotes: [
      "Papatya arttikca aranjman daha hafif ve dogal hissettirir.",
      "Az miktarda gül, buketin deger algisini yukari ceker ama onu sertlestirmez.",
      "Lavanta eklendiginde duygu daha sakin, zarif ve modern bir yone kayar.",
    ],
  };
}

function buildFallbackResult(input: BouquetBriefInput): BouquetBriefResult {
  const products = listProducts();
  const combinedBrief = [input.brief, input.occasion, input.budget].filter(Boolean).join(" ");
  const normalizedBrief = normalize(combinedBrief);
  const toneKeywords =
    normalizedBrief.includes("romantik") || normalizedBrief.includes("romantic")
      ? ["gul", "rose", "kirmizi", "red", "anniversary", "yildonumu"]
      : normalizedBrief.includes("soft") || normalizedBrief.includes("pastel")
        ? ["papatya", "lavanta", "daisy", "lavender", "pastel", "zarif"]
        : normalizedBrief.includes("premium") || normalizedBrief.includes("luxury")
          ? ["premium", "gosterisli", "sik", "grand"]
          : ["buket", "fresh", "taze", "zarif"];

  const heroProduct =
    products
      .map((product) => {
        const localized = getLocalizedProduct(product, input.locale);
        const haystack = `${product.slug} ${product.name} ${localized.name} ${product.shortDescription} ${localized.shortDescription}`;
        let score = scoreText(haystack, toneKeywords);

        if (normalizedBrief.includes("minimal") || normalizedBrief.includes("sade")) {
          score += product.basePrice < 900 ? 1 : 0;
        }

        if (normalizedBrief.includes("premium") || normalizedBrief.includes("luxury") || normalizedBrief.includes("gosterisli")) {
          score += product.basePrice >= 900 ? 2 : 0;
        }

        return { product, score };
      })
      .sort((a, b) => b.score - a.score || a.product.basePrice - b.product.basePrice)[0]?.product ?? products[0];

  const arrangement = buildArrangement(input.locale, combinedBrief);

  if (input.locale === "en") {
    return {
      title: "Atelier Bouquet Direction",
      summary:
        "I matched your description to a store product and then built a stem-by-stem arrangement plan around it so the final bouquet feels intentional rather than generic.",
      mood: normalizedBrief.includes("romantic") ? "Romantic and polished" : "Refined and expressive",
      palette: normalizedBrief.includes("red") ? ["Deep red", "Soft ivory", "Olive green"] : ["Cream", "Powder blush", "Soft green"],
      flowerNotes: ["Focal blooms", "Soft balancing stems", "Fresh greenery movement"],
      wrappingStyle: "Matte wrap with a clean hand-tied finish.",
      cardMessage: "I wanted this bouquet to feel thoughtful and distinctly yours.",
      recommendedProductSlug: heroProduct.slug,
      arrangementItems: arrangement.arrangementItems,
      effectNotes: arrangement.effectNotes,
      floristComment:
        "Start from one strong store product, then build supporting stems around it in smaller counts. That keeps the bouquet premium without making it feel crowded.",
    };
  }

  return {
    title: "Magazaya Gore Ozel Buket Yonlendirmesi",
    summary:
      "Tarifini magazadaki uygun urunle eslestirip onun etrafina sap bazli bir aranjman plani kurdum; boylece sonuc hazir degil, ozenli hissettirir.",
    mood: normalizedBrief.includes("romantik") ? "Romantik ve rafine" : "Zarif ve karakterli",
    palette: normalizedBrief.includes("kirmizi") ? ["Derin kirmizi", "Kirli beyaz", "Zeytin yesili"] : ["Krem", "Pudra", "Yumusak yesil"],
    flowerNotes: ["Odak cicekler", "Dengeleyen yumusak saplar", "Taze yesil hareket"],
    wrappingStyle: "Mat dokulu kagit ve temiz elde baglanmis sunum.",
    cardMessage: "Bu buketin sana ozel ve dusunceli hissettirmesini istedim.",
    recommendedProductSlug: heroProduct.slug,
    arrangementItems: arrangement.arrangementItems,
    effectNotes: arrangement.effectNotes,
    floristComment:
      "Ben burada once magazadaki guclu bir urunu temel alir, sonra destekleyici saplari daha kucuk adetlerle etrafina kurardim. Bu denge buketi premium tutar ama kalabaliklastirmaz.",
  };
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("output_text" in payload && typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text;
  }

  if (!("output" in payload) || !Array.isArray(payload.output)) {
    return null;
  }

  for (const item of payload.output) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (content && typeof content === "object" && "text" in content && typeof content.text === "string" && content.text.trim()) {
        return content.text;
      }
    }
  }

  return null;
}

function extractGeminiText(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("candidates" in payload) || !Array.isArray(payload.candidates)) {
    return null;
  }

  for (const candidate of payload.candidates) {
    if (!candidate || typeof candidate !== "object" || !("content" in candidate)) {
      continue;
    }

    const content = candidate.content;
    if (!content || typeof content !== "object" || !("parts" in content) || !Array.isArray(content.parts)) {
      continue;
    }

    for (const part of content.parts) {
      if (part && typeof part === "object" && "text" in part && typeof part.text === "string" && part.text.trim()) {
        return part.text;
      }
    }
  }

  return null;
}

async function generateWithGemini(input: BouquetBriefInput): Promise<BouquetBriefResult> {
  const products = listProducts();
  const catalogSummary = products
    .map((product) => {
      const localized = getLocalizedProduct(product, input.locale);
      return `${product.slug}: ${localized.name} | ${localized.shortDescription} | ${product.basePrice} TRY`;
    })
    .join("\n");

  const instruction =
    input.locale === "en"
      ? [
          "You are a florist assistant for an online flower store.",
          "Return only JSON that matches the provided schema.",
          "Choose recommendedProductSlug only from the catalog slugs provided.",
          "Build arrangementItems as a practical florist recipe using stem counts such as 4 roses and 2 daisies.",
          "In effectNotes explain what each addition changes emotionally or visually.",
          `Customer brief: ${input.brief}`,
          `Occasion: ${input.occasion ?? "Not specified"}`,
          `Budget: ${input.budget ?? "Not specified"}`,
          `Catalog:\n${catalogSummary}`,
        ].join("\n\n")
      : [
          "Sen online bir cicek magazasi icin florist asistani gibi davran.",
          "Yalnizca verilen schema ile uyumlu JSON dondur.",
          "recommendedProductSlug sadece katalogta verilen slug'lardan secilsin.",
          "Tum cicek adlarini Turkce yaz. Locale Turkceyken English flower names kullanma.",
          "arrangementItems alanini 4 gul, 2 papatya gibi gercek sap adetleriyle florist recetesi gibi kur.",
          "effectNotes alaninda her eklemenin duygusal veya gorsel etkisini acikla.",
          `Musteri tarifi: ${input.brief}`,
          `Vesile: ${input.occasion ?? "Belirtilmedi"}`,
          `Butce: ${input.budget ?? "Belirtilmedi"}`,
          `Katalog:\n${catalogSummary}`,
        ].join("\n\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_TEXT_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instruction }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: outputSchema,
        },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`GEMINI_REQUEST_FAILED:${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const rawText = extractGeminiText(payload);

  if (!rawText) {
    throw new Error("GEMINI_EMPTY_RESPONSE");
  }

  const parsed = localizeBouquetResult(bouquetBriefResultSchema.parse(JSON.parse(rawText)), input.locale);
  const catalogSlugs = new Set(products.map((product) => product.slug));

  return {
    ...parsed,
    recommendedProductSlug: catalogSlugs.has(parsed.recommendedProductSlug) ? parsed.recommendedProductSlug : products[0]?.slug ?? "",
  };
}

async function generateWithOpenAI(input: BouquetBriefInput): Promise<BouquetBriefResult> {
  const products = listProducts();
  const catalogSummary = products
    .map((product) => {
      const localized = getLocalizedProduct(product, input.locale);
      return `${product.slug}: ${localized.name} | ${localized.shortDescription} | ${product.basePrice} TRY`;
    })
    .join("\n");

  const instruction =
    input.locale === "en"
      ? "You are a florist assistant. Return a JSON bouquet plan with one recommended store product, stem counts like 4 roses and 2 daisies, and notes explaining what each addition changes."
      : "Sen bir florist asistani gibi davran. Tum cicek adlarini Turkce yaz. Tek bir magazadaki urun oner, 4 gul 2 papatya gibi sap adetleriyle aranjman plani kur ve her eklemenin etkisini acikla.";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_TEXT_MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: instruction }],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                input.locale === "en"
                  ? `Customer brief:\n${input.brief}\n\nOccasion: ${input.occasion ?? "Not specified"}\nBudget: ${input.budget ?? "Not specified"}\n\nCatalog:\n${catalogSummary}`
                  : `Musteri tarifi:\n${input.brief}\n\nVesile: ${input.occasion ?? "Belirtilmedi"}\nButce: ${input.budget ?? "Belirtilmedi"}\n\nKatalog:\n${catalogSummary}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "bouquet_brief_response",
          strict: true,
          schema: outputSchema,
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OPENAI_REQUEST_FAILED:${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const rawText = extractResponseText(payload);

  if (!rawText) {
    throw new Error("OPENAI_EMPTY_RESPONSE");
  }

  const parsed = localizeBouquetResult(bouquetBriefResultSchema.parse(JSON.parse(rawText)), input.locale);
  const catalogSlugs = new Set(products.map((product) => product.slug));

  return {
    ...parsed,
    recommendedProductSlug: catalogSlugs.has(parsed.recommendedProductSlug) ? parsed.recommendedProductSlug : products[0]?.slug ?? "",
  };
}

export async function generateBouquetBrief(
  rawInput: unknown,
): Promise<BouquetBriefResult & { warning?: string; provider: "gemini" | "openai" | "local" }> {
  const input = bouquetBriefInputSchema.parse(rawInput);

  if (env.GEMINI_API_KEY) {
    try {
      const result = await generateWithGemini(input);
      if (result.recommendedProductSlug) {
        return { ...result, provider: "gemini" };
      }
    } catch (error) {
      if (!env.OPENAI_API_KEY) {
        const message = error instanceof Error ? error.message : "GEMINI_FAILED";
        return { ...localizeBouquetResult(buildFallbackResult(input), input.locale), provider: "local", warning: message };
      }
    }
  }

  if (!env.OPENAI_API_KEY) {
    return { ...localizeBouquetResult(buildFallbackResult(input), input.locale), provider: "local" };
  }

  try {
    const result = await generateWithOpenAI(input);
    if (result.recommendedProductSlug) {
      return { ...result, provider: "openai" };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "OPENAI_FAILED";
    return { ...localizeBouquetResult(buildFallbackResult(input), input.locale), provider: "local", warning: message };
  }

  return { ...localizeBouquetResult(buildFallbackResult(input), input.locale), provider: "local" };
}
