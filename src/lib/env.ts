import { z } from "zod";

function isBlank(value?: string) {
  return !value || value.trim().length === 0;
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().optional(),
    ADMIN_SECRET: z.string().optional(),
    AUTH_SESSION_SECRET: z.string().optional(),
    ADMIN_PASSWORD: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    GEMINI_TEXT_MODEL: z.string().default("gemini-2.5-flash"),
    GEMINI_IMAGE_MODEL: z.string().default("gemini-3.1-flash-image-preview"),
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_TEXT_MODEL: z.string().default("gpt-5-mini"),
    OPENAI_IMAGE_MODEL: z.string().default("gpt-image-1"),
    NEXT_PUBLIC_SITE_URL: z.string().optional(),
    NEXT_PUBLIC_PAYMENT_PROVIDER: z.enum(["MOCK", "IYZICO", "PAYTR"]).default("MOCK"),
    MAIL_PROVIDER: z.enum(["mock", "SMTP", "RESEND"]).default("mock"),
    MAIL_FROM: z.string().default("Cicekci <no-reply@example.com>"),
    RESEND_API_KEY: z.string().optional(),
    ADMIN_EMAIL: z.string().optional(),
    IYZICO_WEBHOOK_SECRET: z.string().optional(),
    PAYTR_CALLBACK_TOKEN: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    const isProductionBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
    const isVitest = process.env.VITEST === "true";

    // Build artifacts should be creatable without runtime secrets; enforce at runtime.
    if (isProductionBuildPhase || isVitest) {
      return;
    }

    if (env.NODE_ENV !== "production") {
      return;
    }

    const siteUrl = env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl || isBlank(siteUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["NEXT_PUBLIC_SITE_URL"],
        message: "NEXT_PUBLIC_SITE_URL is required in production",
      });
    } else {
      try {
        const parsed = new URL(siteUrl);
        if (parsed.protocol !== "https:") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["NEXT_PUBLIC_SITE_URL"],
            message: "NEXT_PUBLIC_SITE_URL must use https in production",
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["NEXT_PUBLIC_SITE_URL"],
          message: "NEXT_PUBLIC_SITE_URL must be a valid URL",
        });
      }
    }

    if (isBlank(env.DATABASE_URL)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DATABASE_URL"],
        message: "DATABASE_URL is required in production",
      });
    }

    if (isBlank(env.AUTH_SESSION_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["AUTH_SESSION_SECRET"],
        message: "AUTH_SESSION_SECRET is required in production",
      });
    }

    if (isBlank(env.ADMIN_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ADMIN_SECRET"],
        message: "ADMIN_SECRET is required in production",
      });
    }

    if (env.MAIL_PROVIDER === "RESEND" && isBlank(env.RESEND_API_KEY)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["RESEND_API_KEY"],
        message: "RESEND_API_KEY is required when MAIL_PROVIDER=RESEND",
      });
    }

    if (env.NEXT_PUBLIC_PAYMENT_PROVIDER === "IYZICO" && isBlank(env.IYZICO_WEBHOOK_SECRET)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["IYZICO_WEBHOOK_SECRET"],
        message: "IYZICO_WEBHOOK_SECRET is required when NEXT_PUBLIC_PAYMENT_PROVIDER=IYZICO",
      });
    }

    if (env.NEXT_PUBLIC_PAYMENT_PROVIDER === "PAYTR" && isBlank(env.PAYTR_CALLBACK_TOKEN)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["PAYTR_CALLBACK_TOKEN"],
        message: "PAYTR_CALLBACK_TOKEN is required when NEXT_PUBLIC_PAYMENT_PROVIDER=PAYTR",
      });
    }
  });

const parsedEnv = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_TEXT_MODEL: process.env.GEMINI_TEXT_MODEL,
  GEMINI_IMAGE_MODEL: process.env.GEMINI_IMAGE_MODEL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_TEXT_MODEL: process.env.OPENAI_TEXT_MODEL,
  OPENAI_IMAGE_MODEL: process.env.OPENAI_IMAGE_MODEL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_PAYMENT_PROVIDER: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER,
  MAIL_PROVIDER: process.env.MAIL_PROVIDER,
  MAIL_FROM: process.env.MAIL_FROM,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  IYZICO_WEBHOOK_SECRET: process.env.IYZICO_WEBHOOK_SECRET,
  PAYTR_CALLBACK_TOKEN: process.env.PAYTR_CALLBACK_TOKEN,
});

export const env = {
  ...parsedEnv,
  isProduction: parsedEnv.NODE_ENV === "production",
  isDemoMode: !parsedEnv.DATABASE_URL,
  hasAdminSecret: Boolean(parsedEnv.ADMIN_SECRET),
};
