"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/components/providers/store-provider";
import type { Locale } from "@/lib/locale";

const nav = [
  ["/magaza", "Mağaza"], ["/aranjmanlar", "Aranjmanlar"], ["/hakkimizda", "Hakkımızda"],
  ["/toptan", "Düğün & Etkinlik"], ["/iletisim", "İletişim"],
] as const;

export function BotanicalHeader({}: { currentLocale: Locale }) {
  const pathname = usePathname();
  const { cart } = useStore();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <>
    <header className="sticky top-0 z-50 border-b border-[#eaded7] bg-[#fcf9f4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Riva Çiçekçilik ana sayfa">
          <span className="grid size-10 place-items-center rounded-full bg-[#aa2e28] text-xl text-white">✿</span>
          <span><b className="block font-noto-serif text-xl leading-none text-[#7d211d]">Riva Çiçekçilik</b><small className="mt-1 block text-[9px] font-bold uppercase tracking-[.24em] text-[#6f6a64]">Sade · Yerel · Taze</small></span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Ana menü">
          {nav.map(([href,label]) => <Link key={href} href={href} className={`text-sm font-semibold transition hover:text-[#aa2e28] ${pathname.startsWith(href) ? "text-[#aa2e28]" : "text-[#393633]"}`}>{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/arama" className="grid size-10 place-items-center rounded-full hover:bg-[#f0eae4]" aria-label="Ara">⌕</Link>
          <Link href="/giris" className="hidden size-10 place-items-center rounded-full hover:bg-[#f0eae4] sm:grid" aria-label="Hesabım">♙</Link>
          <Link href="/sepet" className="relative grid size-10 place-items-center rounded-full bg-[#aa2e28] text-white" aria-label={`Sepet, ${count} ürün`}>♧{count > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#274f3b] text-[10px] font-bold">{count}</span>}</Link>
        </div>
      </div>
    </header>
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-[#eaded7] bg-[#fffdfa]/95 p-2 shadow-[0_12px_45px_rgba(70,40,30,.18)] backdrop-blur lg:hidden" aria-label="Mobil menü">
      {[["/","⌂","Ana Sayfa"],["/magaza","✿","Mağaza"],["/sepet","♧","Sepet"],["/giris","♙","Hesabım"]].map(([href,icon,label]) => <Link key={href} href={href} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-bold ${pathname === href ? "bg-[#f6e9e5] text-[#aa2e28]" : "text-[#625d57]"}`}><span className="text-lg leading-none">{icon}</span>{label}</Link>)}
    </nav>
  </>;
}

export function BotanicalFooter({}: { currentLocale: Locale }) {
  return <footer className="mt-20 border-t border-[#e8ddd5] bg-[#f4eee7] pb-24 pt-14 lg:pb-8">
    <div className="mx-auto grid max-w-[1240px] gap-10 px-6 md:grid-cols-4 lg:px-8">
      <div className="md:col-span-2"><p className="font-noto-serif text-2xl font-bold text-[#7d211d]">Riva Çiçekçilik</p><p className="mt-4 max-w-md text-sm leading-7 text-[#625d57]">Antalya Kepez&apos;de, mevsimin en taze çiçeklerini yerel atölyemizde özenle hazırlıyoruz.</p><a href="https://wa.me/905316442880" className="mt-5 inline-flex rounded-full bg-[#2b674d] px-5 py-3 text-sm font-bold text-white">WhatsApp&apos;tan Sipariş</a></div>
      <div><b className="font-noto-serif">Keşfet</b><div className="mt-4 grid gap-3 text-sm text-[#625d57]">{nav.slice(0,4).map(([h,l])=><Link key={h} href={h}>{l}</Link>)}</div></div>
      <div><b className="font-noto-serif">Atölye</b><p className="mt-4 text-sm leading-7 text-[#625d57]">Kepez, Antalya<br/>Her gün 08:00–20:00<br/>+90 531 644 28 80</p></div>
    </div><p className="mx-auto mt-12 max-w-[1240px] border-t border-[#dfd3ca] px-6 pt-6 text-xs text-[#756f69]">© 2026 Riva Çiçekçilik · Sevgiyle Antalya&apos;da hazırlandı.</p>
  </footer>;
}
