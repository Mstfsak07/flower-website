import { SiteFooter as BaseSiteFooter } from "@/components/site-footer";
import type { Locale } from "@/lib/locale";

type SiteFooterProps = {
  locale: Locale;
};

export function SiteFooter({ locale }: SiteFooterProps) {
  return <BaseSiteFooter currentLocale={locale} />;
}
