import Link from "next/link";
import { AtSign, MapPin, PhoneCall, Sparkles } from "lucide-react";

import { categories, siteSettings } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)]/50 bg-[var(--color-surface)] pt-12 pb-8">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_.8fr_.8fr] lg:px-8 pb-12 border-b border-[var(--color-line)]/50">
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-2xl tracking-tight text-[var(--color-ink)]">{siteSettings.storeName}</h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
              <Sparkles className="size-3" />
              Zarif ve Ozenli Cicek Tasarimi
            </div>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
            Sevdiklerinize duygularinizi en saf haliyle iletmek uzere hazirlanmis, her detayi ozenle dusunulmus premium cicek aranjmanlari ve kurumsal cozumler.
          </p>
          <div className="space-y-3 text-sm text-[var(--color-ink)]">
            <p className="flex items-center gap-2.5">
              <PhoneCall className="size-4 text-[var(--color-accent)]" />
              {siteSettings.phone}
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin className="size-4 text-[var(--color-accent)]" />
              {siteSettings.address}
            </p>
            <a
              className="inline-flex items-center gap-2.5 transition-colors hover:text-[var(--color-accent)]"
              href={siteSettings.instagram}
              rel="noreferrer"
              target="_blank"
            >
              <AtSign className="size-4 text-[var(--color-accent)]" />
              Instagram&apos;da Takip Edin
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Koleksiyonlar
          </h4>
          <div className="space-y-3 text-sm font-medium">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                className="block text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                href={`/kategori/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Bilgilendirme
          </h4>
          <div className="space-y-3 text-sm font-medium">
            {[
              ["/hakkimizda", "Hakkimizda"],
              ["/iletisim", "Iletisim"],
              ["/sss", "Sik Sorulan Sorular"],
              ["/teslimat-ve-iade", "Teslimat ve Iade Sartlari"],
              ["/gizlilik-politikasi", "Gizlilik Politikasi"],
            ].map(([href, label]) => (
              <Link
                key={href}
                className="block text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                href={href}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <p className="text-xs text-[var(--color-muted)] text-center sm:text-left">
          &copy; {new Date().getFullYear()} {siteSettings.storeName}. Tum haklari saklidir.
        </p>
      </div>
    </footer>
  );
}
