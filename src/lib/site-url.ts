import { env } from "@/lib/env";

const FALLBACK_SITE_URL = "https://rivacicekantalya.com";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getSiteUrlOrigin() {
  return trimTrailingSlash(env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL);
}

export function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, `${getSiteUrlOrigin()}/`).toString();
}
