"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useStore } from "@/components/providers/store-provider";
import type { Locale } from "@/lib/locale";

const navigation = {
  tr: [["/magaza", "Mağaza"], ["/aranjmanlar", "Aranjmanlar"], ["/hakkimizda", "Hakkımızda"], ["/toptan", "Düğün & Etkinlik"], ["/iletisim", "İletişim"]],
  en: [["/magaza", "Shop"], ["/aranjmanlar", "Arrangements"], ["/hakkimizda", "About"], ["/toptan", "Weddings & Events"], ["/iletisim", "Contact"]],
} as const;

export function BotanicalHeader({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const { cart } = useStore();
  const { user, loading } = useAuth();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const nav = navigation[currentLocale];
  const t = currentLocale === "tr" ? { home:"ana sayfa", menu:"Ana menü", search:"Ara", login:"Giriş / Kayıt", account:"Hesabım", cart:"Sepet", mobile:"Mobil menü", fresh:"Sade · Yerel · Taze" } : { home:"home", menu:"Main menu", search:"Search", login:"Sign in / Register", account:"Account", cart:"Cart", mobile:"Mobile menu", fresh:"Simple · Local · Fresh" };
  return <>
    <header className="sticky top-0 z-50 border-b border-[#eaded7] bg-[#fcf9f4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between gap-5 px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`Riva Çiçekçilik ${t.home}`}><span className="grid size-10 place-items-center rounded-full bg-[#aa2e28] text-xl text-white">✿</span><span><b className="block font-noto-serif text-xl leading-none text-[#7d211d]">Riva Çiçekçilik</b><small className="mt-1 block text-[9px] font-bold uppercase tracking-[.24em] text-[#6f6a64]">{t.fresh}</small></span></Link>
        <nav className="hidden items-center gap-7 xl:flex" aria-label={t.menu}>{nav.map(([href,label]) => <Link key={href} href={href} className={`text-[15px] font-bold transition hover:text-[#aa2e28] ${pathname.startsWith(href) ? "text-[#aa2e28]" : "text-[#393633]"}`}>{label}</Link>)}</nav>
        <div className="flex items-center gap-2">
          <Link href="/arama" className="hidden size-10 place-items-center rounded-full hover:bg-[#f0eae4] sm:grid" aria-label={t.search}>⌕</Link>
          <Link href={user ? "/hesabim" : "/giris"} className="hidden whitespace-nowrap rounded-full border border-[#d9c7bd] bg-white px-4 py-2.5 text-xs font-extrabold text-[#7d211d] transition hover:border-[#aa2e28] md:inline-flex">{loading ? "…" : user ? t.account : t.login}</Link>
          <Link href="/sepet" className="relative inline-flex items-center gap-2 rounded-full bg-[#aa2e28] px-4 py-2.5 text-xs font-extrabold text-white" aria-label={`${t.cart}, ${count}`}><span className="text-base">♧</span><span>{t.cart}</span>{count > 0 ? <span className="grid size-5 place-items-center rounded-full bg-[#274f3b] text-[10px]">{count}</span> : null}</Link>
        </div>
      </div>
    </header>
    <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-[#eaded7] bg-[#fffdfa]/95 p-2 shadow-[0_12px_45px_rgba(70,40,30,.18)] backdrop-blur lg:hidden" aria-label={t.mobile}>{[["/","⌂",currentLocale==="tr"?"Ana Sayfa":"Home"],["/magaza","✿",currentLocale==="tr"?"Mağaza":"Shop"],["/sepet","♧",t.cart],["/giris","♙",user?t.account:(currentLocale==="tr"?"Giriş":"Sign in")]].map(([href,icon,label]) => <Link key={href} href={href} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-bold ${pathname === href ? "bg-[#f6e9e5] text-[#aa2e28]" : "text-[#625d57]"}`}><span className="text-lg leading-none">{icon}</span>{label}</Link>)}</nav>
  </>;
}

export function BotanicalFooter({ currentLocale }: { currentLocale: Locale }) {
  const nav = navigation[currentLocale];
  const tr = currentLocale === "tr";
  return <footer className="mt-20 border-t border-[#e8ddd5] bg-[#f4eee7] pb-24 pt-14 lg:pb-8"><div className="mx-auto grid max-w-[1240px] gap-10 px-6 md:grid-cols-4 lg:px-8"><div className="md:col-span-2"><p className="font-noto-serif text-2xl font-bold text-[#7d211d]">Riva Çiçekçilik</p><p className="mt-4 max-w-md text-sm leading-7 text-[#625d57]">{tr ? "Antalya Kepez'de, mevsimin en taze çiçeklerini yerel atölyemizde özenle hazırlıyoruz." : "We carefully prepare the freshest seasonal flowers in our local Kepez, Antalya atelier."}</p><a href="https://wa.me/905316442880" className="mt-5 inline-flex rounded-full bg-[#2b674d] px-5 py-3 text-sm font-bold text-white">{tr ? "WhatsApp'tan Sipariş" : "Order on WhatsApp"}</a></div><div><b className="font-noto-serif">{tr ? "Keşfet" : "Explore"}</b><div className="mt-4 grid gap-3 text-sm text-[#625d57]">{nav.slice(0,4).map(([h,l])=><Link key={h} href={h}>{l}</Link>)}</div></div><div><b className="font-noto-serif">{tr ? "Atölye" : "Atelier"}</b><p className="mt-4 text-sm leading-7 text-[#625d57]">Kepez, Antalya<br/>{tr ? "Her gün" : "Daily"} 08:00–20:00<br/>+90 531 644 28 80</p></div></div><p className="mx-auto mt-12 max-w-[1240px] border-t border-[#dfd3ca] px-6 pt-6 text-xs text-[#756f69]">© 2026 Riva Çiçekçilik · {tr ? "Sevgiyle Antalya'da hazırlandı." : "Made with care in Antalya."}</p></footer>;
}
