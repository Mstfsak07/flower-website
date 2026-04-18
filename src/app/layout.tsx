import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { Providers } from "@/components/providers/providers";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteSettings } from "@/lib/data";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteSettings.seoTitle,
  description: siteSettings.seoDescription,
  metadataBase: new URL("https://lunacicek.example"),
  openGraph: {
    title: siteSettings.seoTitle,
    description: siteSettings.seoDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="tr"
      className={`${display.variable} ${sans.variable}`}
    >
      <body>
        <Providers>
          <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)]">
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteSettings.storeName,
                telephone: siteSettings.phone,
                address: siteSettings.address,
                url: "https://lunacicek.example",
              }}
            />
            <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(circle_at_top_left,rgba(214,128,141,.24),transparent_40%),radial-gradient(circle_at_top_right,rgba(128,154,126,.2),transparent_35%),linear-gradient(180deg,#fff9f6,transparent)]" />
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
