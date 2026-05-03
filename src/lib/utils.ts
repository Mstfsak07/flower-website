import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { tr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import type { Locale } from "@/lib/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return format(new Date(value), "d MMMM yyyy", { locale: tr });
}

export function formatLocalizedDate(value: string, locale: Locale) {
  return format(new Date(value), "d MMMM yyyy", { locale: locale === "en" ? enUS : tr });
}

export function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateOrderNumber() {
  return `CK-${Date.now().toString().slice(-8)}`;
}
