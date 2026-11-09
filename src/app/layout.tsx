import type { Metadata } from "next";

import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/noto-serif/wght.css";
import "@fontsource-variable/noto-serif/wght-italic.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";

import { LayoutChrome } from "@/components/layout-chrome";
import { Providers } from "@/components/providers/providers";
import { JsonLd } from "@/components/json-ld";
import { siteSettings } from "@/lib/data";
import { plusJakartaSans } from "@/lib/fonts";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getSiteUrlOrigin } from "@/lib/site-url";
import "./globals.css";

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
      className={plusJakartaSans.className}
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
            <LayoutChrome area="footer" currentLocale={locale} />
            <LayoutChrome
              area="language"
              currentLocale={locale}
              languageLabel={dictionary.common.languageLabel}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
