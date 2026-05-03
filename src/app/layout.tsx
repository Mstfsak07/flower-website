import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";

import { LayoutChrome } from "@/components/layout-chrome";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Providers } from "@/components/providers/providers";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { siteSettings } from "@/lib/data";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getSiteUrlOrigin } from "@/lib/site-url";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: siteSettings.seoTitle,
  description: siteSettings.seoDescription,
  metadataBase: new URL(getSiteUrlOrigin()),
  openGraph: {
    title: siteSettings.seoTitle,
    description: siteSettings.seoDescription,
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${notoSerif.variable} ${plusJakarta.variable}`}
      style={{ backgroundColor: "#fcf9f4" }}
    >
      <body style={{
        margin: 0,
        backgroundColor: "#fcf9f4",
        color: "#1c1c19",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}>
        <Providers>
          <div style={{ minHeight: "100vh", backgroundColor: "#fcf9f4" }}>
            <a
              href="#main-content"
              style={{
                position: "fixed", left: "1rem", top: "1rem", zIndex: 200,
                transform: "translateY(-4rem)", transition: "transform 0.2s",
                borderRadius: "9999px", background: "#aa2e28", color: "#fff",
                padding: "0.5rem 1rem", fontSize: "0.85rem", fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {dictionary.common.skipToContent}
            </a>
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteSettings.storeName,
                address: siteSettings.address,
                url: getSiteUrlOrigin(),
              }}
            />
            <LayoutChrome currentLocale={locale} />
            <main id="main-content">{children}</main>
            <SiteFooter currentLocale={locale} />
            <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 70 }}>
              <LanguageSwitcher currentLocale={locale} label={dictionary.common.languageLabel} />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
