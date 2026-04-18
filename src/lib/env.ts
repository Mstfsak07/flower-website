import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional(),
  ADMIN_SECRET: z.string().optional(),
  NEXT_PUBLIC_PAYMENT_PROVIDER: z.enum(["MOCK", "IYZICO", "PAYTR"]).default("MOCK"),
  MAIL_PROVIDER: z.enum(["mock", "SMTP", "RESEND"]).default("mock"),
  MAIL_FROM: z.string().default("Cicekci <no-reply@example.com>"),
  ADMIN_EMAIL: z.string().optional(),
});

const parsedEnv = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  NEXT_PUBLIC_PAYMENT_PROVIDER: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER,
  MAIL_PROVIDER: process.env.MAIL_PROVIDER,
  MAIL_FROM: process.env.MAIL_FROM,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
});

export const env = {
  ...parsedEnv,
  isProduction: parsedEnv.NODE_ENV === "production",
  isDemoMode: !parsedEnv.DATABASE_URL,
  hasAdminSecret: Boolean(parsedEnv.ADMIN_SECRET),
};
