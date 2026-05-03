import "server-only";

import { z } from "zod";

import { env } from "@/lib/env";

const bouquetVisualInputSchema = z.object({
  locale: z.enum(["tr", "en"]),
  brief: z.string().trim().min(10).max(1200),
  title: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(20).max(600),
  mood: z.string().trim().min(3).max(120),
  palette: z.array(z.string().trim().min(2).max(40)).min(2).max(5),
  flowerNotes: z.array(z.string().trim().min(2).max(80)).min(3).max(6),
  wrappingStyle: z.string().trim().min(3).max(160),
});

function mapToneToHex(tone: string) {
  const value = tone.toLocaleLowerCase("tr-TR");

  if (value.includes("red") || value.includes("kirmizi") || value.includes("burgundy")) return "#8b1e3f";
  if (value.includes("ivory") || value.includes("cream") || value.includes("beyaz") || value.includes("kirli")) return "#f0e8da";
  if (value.includes("green") || value.includes("yesil") || value.includes("olive")) return "#68724d";
  if (value.includes("blush") || value.includes("pudra") || value.includes("pink")) return "#d7a5b5";
  if (value.includes("lilac") || value.includes("lila") || value.includes("purple") || value.includes("mor")) return "#9277b8";

  return "#d4af37";
}

function buildFallbackVisualDataUrl(input: z.infer<typeof bouquetVisualInputSchema>) {
  const colors = input.palette.map(mapToneToHex);
  const stops = colors.map((color, index) => `<stop offset="${index / Math.max(colors.length - 1, 1)}" stop-color="${color}" />`).join("");
  const petals = colors
    .map(
      (color, index) =>
        `<ellipse cx="${220 + index * 120}" cy="${290 - (index % 2) * 36}" rx="88" ry="132" fill="${color}" fill-opacity="0.84" transform="rotate(${index * 10 - 14} ${220 + index * 120} ${290 - (index % 2) * 36})" />`,
    )
    .join("");
  const leaves = `
    <ellipse cx="230" cy="640" rx="68" ry="24" fill="#4f6e4f" transform="rotate(-22 230 640)" />
    <ellipse cx="510" cy="650" rx="72" ry="24" fill="#5a7c58" transform="rotate(18 510 650)" />
  `;
  const summary = input.summary.length > 90 ? `${input.summary.slice(0, 87)}...` : input.summary;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          ${stops}
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="28%" r="56%">
          <stop offset="0%" stop-color="#fff5da" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#09100c" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1024" height="1024" fill="#08100b" />
      <rect width="1024" height="1024" fill="url(#bg)" opacity="0.18" />
      <circle cx="512" cy="220" r="280" fill="url(#glow)" />
      <rect x="118" y="112" width="788" height="800" rx="42" fill="rgba(12,18,14,0.72)" stroke="rgba(212,175,55,0.28)" />
      <g>${petals}</g>
      ${leaves}
      <path d="M510 420 C490 540 498 640 512 760" stroke="#9c8a57" stroke-width="14" fill="none" stroke-linecap="round" />
      <rect x="388" y="720" width="248" height="118" rx="28" fill="#d6c4a1" fill-opacity="0.18" stroke="#d6c4a1" stroke-opacity="0.2" />
      <text x="160" y="162" fill="#f3d98b" font-family="Georgia, serif" font-size="34" letter-spacing="4">IRIS ATALIER AI</text>
      <text x="160" y="820" fill="#ffffff" font-family="Georgia, serif" font-size="52">${input.title}</text>
      <text x="160" y="870" fill="#d7d0c4" font-family="Arial, sans-serif" font-size="28">${summary}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function buildImagePrompt(input: z.infer<typeof bouquetVisualInputSchema>) {
  if (input.locale === "en") {
    return [
      "Use case: product-mockup",
      "Asset type: premium florist concept preview for a web app result panel",
      `Primary request: create a luxurious bouquet concept image based on this customer brief: ${input.brief}`,
      "Scene/backdrop: dark editorial florist studio with subtle atmosphere and premium presentation",
      `Subject: bouquet concept titled "${input.title}" with mood "${input.mood}", flower notes ${input.flowerNotes.join(", ")}`,
      "Style/medium: photorealistic floral product photography",
      "Composition/framing: vertical close editorial composition, bouquet centered, elegant wrapping visible, no hands, no vase unless implied by the brief",
      "Lighting/mood: soft dramatic studio light, premium, cinematic, refined",
      `Color palette: ${input.palette.join(", ")}`,
      `Materials/textures: ${input.wrappingStyle}`,
      `Constraints: bouquet should reflect this summary: ${input.summary}`,
      "Avoid: text, watermark, frame, people, extra props, cluttered background, multiple bouquets",
    ].join("\n");
  }

  return [
    "Use case: product-mockup",
    "Asset type: web uygulamasi sonuc paneli icin premium florist konsept preview",
    `Primary request: su musteri tarifine gore luks bir buket konsept gorseli olustur: ${input.brief}`,
    "Scene/backdrop: koyu editoryal cicek atolyesi atmosferi, premium sunum",
    `Subject: "${input.title}" baslikli buket konsepti, hava "${input.mood}", cicek notlari ${input.flowerNotes.join(", ")}`,
    "Style/medium: fotogercekci floral urun fotografiçiligi",
    "Composition/framing: dikey editoral yakin plan, buket ortada, paketleme net gorunsun, el veya insan olmasin, brief gerektirmiyorsa vazo olmasin",
    "Lighting/mood: yumusak dramatik studyo isigi, rafine ve sinematik",
    `Color palette: ${input.palette.join(", ")}`,
    `Materials/textures: ${input.wrappingStyle}`,
    `Constraints: buket su ozetle uyumlu olsun: ${input.summary}`,
    "Avoid: yazi, watermark, cerceve, insan, fazla aksesuar, kalabalik arka plan, birden fazla buket",
  ].join("\n");
}

function extractGeminiInlineImage(payload: unknown) {
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
      if (
        part &&
        typeof part === "object" &&
        "inlineData" in part &&
        part.inlineData &&
        typeof part.inlineData === "object" &&
        "mimeType" in part.inlineData &&
        "data" in part.inlineData &&
        typeof part.inlineData.mimeType === "string" &&
        typeof part.inlineData.data === "string"
      ) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }

      if (
        part &&
        typeof part === "object" &&
        "inline_data" in part &&
        part.inline_data &&
        typeof part.inline_data === "object" &&
        "mime_type" in part.inline_data &&
        "data" in part.inline_data &&
        typeof part.inline_data.mime_type === "string" &&
        typeof part.inline_data.data === "string"
      ) {
        return `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
      }
    }
  }

  return null;
}

async function generateWithGemini(input: z.infer<typeof bouquetVisualInputSchema>) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_IMAGE_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildImagePrompt(input) }],
          },
        ],
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`GEMINI_IMAGE_REQUEST_FAILED:${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  const imageUrl = extractGeminiInlineImage(payload);

  if (!imageUrl) {
    throw new Error("GEMINI_IMAGE_EMPTY_RESPONSE");
  }

  return imageUrl;
}

async function generateWithOpenAI(input: z.infer<typeof bouquetVisualInputSchema>) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_IMAGE_MODEL,
      prompt: buildImagePrompt(input),
      size: "1024x1024",
      quality: "low",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OPENAI_IMAGE_REQUEST_FAILED:${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string }>;
  };
  const imageBase64 = payload.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error("OPENAI_IMAGE_EMPTY_RESPONSE");
  }

  return `data:image/png;base64,${imageBase64}`;
}

export async function generateBouquetVisual(rawInput: unknown) {
  const input = bouquetVisualInputSchema.parse(rawInput);

  if (env.OPENAI_API_KEY) {
    try {
      const imageUrl = await generateWithOpenAI(input);
      return { imageUrl, generatedWithAI: true, provider: "openai" as const };
    } catch (error) {
      if (!env.GEMINI_API_KEY) {
        const message = error instanceof Error ? error.message : "GEMINI_IMAGE_FAILED";
        return {
          imageUrl: buildFallbackVisualDataUrl(input),
          generatedWithAI: false,
          provider: "local" as const,
          warning: message,
        };
      }
    }
  }

  if (env.GEMINI_API_KEY) {
    try {
      const imageUrl = await generateWithGemini(input);
      return { imageUrl, generatedWithAI: true, provider: "gemini" as const };
    } catch (error) {
      const message = error instanceof Error ? error.message : "GEMINI_IMAGE_FAILED";
      return {
        imageUrl: buildFallbackVisualDataUrl(input),
        generatedWithAI: false,
        provider: "local" as const,
        warning: message,
      };
    }
  }

  return { imageUrl: buildFallbackVisualDataUrl(input), generatedWithAI: false, provider: "local" as const };
}
