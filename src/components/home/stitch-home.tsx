"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  Flower2,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { type FormEvent } from "react";
import { toast } from "sonner";

import { useStore } from "@/components/providers/store-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { notoSerif as serif, plusJakartaSans as sans } from "@/lib/fonts";
import type { Locale } from "@/lib/locale";

const whatsappBase = "https://wa.me/905316442880";

const categories = [
  { name: "Aranjmanlar", nameEn: "Arrangements", slug: "aranjmanlar", image: "/stitch-home/category-arrangements.jpg" },
  { name: "Buketler", nameEn: "Bouquets", slug: "buketler", image: "/stitch-home/category-bouquets.jpg" },
  { name: "Solmayan Güller", nameEn: "Preserved Roses", slug: "solmayan-guller", image: "/stitch-home/category-preserved-rose.jpg" },
  { name: "Saksı Çiçekleri", nameEn: "Potted Plants", slug: "saksi-cicekleri", image: "/stitch-home/category-potted-plants.jpg" },
  { name: "Orkideler", nameEn: "Orchids", slug: "orkideler", image: "/stitch-home/category-orchids.jpg" },
  { name: "Kelebek Buketleri", nameEn: "Butterfly Bouquets", slug: "kelebek-buketleri", image: "/stitch-home/category-butterfly-bouquets.jpg" },
] as const;

const products = [
  { id: "p1", name: "Kaleci Romansı", nameEn: "Goalkeeper's Romance", detail: "15'li Kırmızı Gül", detailEn: "15 Red Roses", slug: "kaleci-romansi-kirmizi-gul", price: 580, image: "/stitch-pages/store-01.jpg", badge: "Çok Satan", badgeEn: "Best Seller" },
  { id: "p2", name: "Lara Pembesi", nameEn: "Lara Blush", detail: "Şakayık Aranjmanı", detailEn: "Peony Arrangement", slug: "lara-pembesi-sakayik-aranjmani", price: 740, image: "/stitch-pages/store-02.jpg", badge: "Pastel", badgeEn: "Pastel" },
  { id: "p4", name: "Akdeniz Güneşi", nameEn: "Mediterranean Sun", detail: "Papatya Demeti", detailEn: "Daisy Bouquet", slug: "akdeniz-gunesi-papatya-demeti", price: 350, image: "/stitch-pages/store-04.jpg", badge: "Taze", badgeEn: "Fresh" },
  { id: "p9", name: "Riva Royal Velvet", nameEn: "Riva Royal Velvet", detail: "Kadife Kutuda Güller", detailEn: "Roses in a Velvet Box", slug: "riva-royal-velvet-kutusu", price: 950, image: "/stitch-pages/arrangements-01.jpg", badge: "Özel Kutu", badgeEn: "Gift Box" },
] as const;

function HomeHeader({ count, locale }: { count: number; locale: Locale }) {
  const { user } = useAuth();
  const tr = locale === "tr";
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e8dfd5] bg-[#fcf9f4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-5 px-4 md:px-8">
          <Link className="flex min-w-0 items-center gap-2.5" href="/">
            <Flower2 className="size-6 shrink-0 text-[#881414]" strokeWidth={1.8} />
            <span className="min-w-0">
              <span className={`${serif.className} block truncate text-[21px] font-semibold leading-none text-[#881414]`}>Riva Çiçekçilik</span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6e6259]">Floral Atelier · Kepez</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-[15px] font-bold text-[#59413e] xl:flex">
            <Link className="transition hover:text-[#881414]" href="/magaza">{tr ? "Mağaza" : "Shop"}</Link>
            <Link className="transition hover:text-[#881414]" href="/aranjmanlar">{tr ? "Aranjmanlar" : "Arrangements"}</Link>
            <Link className="transition hover:text-[#881414]" href="/hakkimizda">{tr ? "Hakkımızda" : "About"}</Link>
            <Link className="transition hover:text-[#881414]" href="/iletisim">{tr ? "İletişim" : "Contact"}</Link>
          </nav>
          <div className="flex items-center gap-1.5">
            <Link aria-label="Ara" className="grid size-10 place-items-center rounded-full text-[#59413e] transition hover:bg-[#f5efeb] hover:text-[#881414]" href="/arama"><Search className="size-[18px]" /></Link>
            <Link className="hidden rounded-full border border-[#d9c7bd] bg-white px-4 py-2.5 text-xs font-extrabold text-[#7d211d] md:inline-flex" href={user ? "/hesabim" : "/giris"}>{user ? (tr ? "Hesabım" : "Account") : (tr ? "Giriş / Kayıt" : "Sign in / Register")}</Link>
            <Link aria-label={`${tr ? "Sepet" : "Cart"}, ${count}`} className="inline-flex items-center gap-2 rounded-full bg-[#881414] px-4 py-2.5 text-xs font-bold text-white" href="/sepet"><ShoppingBag className="size-[17px]" /><span>{tr ? "Sepet" : "Cart"}</span>{count > 0 ? <span className="grid size-[18px] place-items-center rounded-full bg-[#2d4233] text-[10px]">{count}</span> : null}</Link>
          </div>
        </div>
      </header>
      <div className="border-b border-[#e8dfd5] bg-[#f5efeb] px-4 py-2 text-center text-[11px] font-semibold text-[#2d4233] md:text-xs">
        <span className="inline-flex items-center gap-2"><Truck className="size-3.5" /> {tr ? "Antalya içi aynı gün kurye · Kepez ücretsiz" : "Same-day delivery in Antalya · Free in Kepez"}</span>
      </div>
    </>
  );
}

function ProductCard({ product, onAdd, locale }: { product: (typeof products)[number]; onAdd: () => void; locale: Locale }) {
  const tr = locale === "tr";
  return (
    <article className="group overflow-hidden rounded-xl border border-[#e8dfd5] bg-white shadow-[0_8px_24px_-12px_rgba(70,50,40,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-16px_rgba(70,50,40,0.24)]">
      <Link className="relative block aspect-[4/5] overflow-hidden bg-[#f5efeb]" href={`/urun/${product.slug}`}>
        <Image alt={tr ? product.name : product.nameEn} className="object-cover transition duration-500 group-hover:scale-[1.04]" fill loading={product.id === "p1" ? "eager" : "lazy"} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" src={product.image} />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-[#e2eae3]/95 px-2.5 py-1 text-[10px] font-bold text-[#2d4233] shadow-sm">{tr ? product.badge : product.badgeEn}</span>
      </Link>
      <div className="p-3.5 sm:p-4">
        <Link href={`/urun/${product.slug}`}>
          <h3 className={`${serif.className} text-[16px] font-medium leading-tight text-[#221a1a] sm:text-xl`}>{tr ? product.name : product.nameEn}</h3>
          <p className="mt-1 text-[10px] text-[#6e6259] sm:text-xs">{tr ? product.detail : product.detailEn}</p>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[15px] font-bold text-[#8b1e19] sm:text-lg">₺{product.price}</span>
          <button aria-label={`${product.name} ürününü sepete ekle`} className="grid size-8 place-items-center rounded-lg bg-[#881414] text-white transition hover:bg-[#aa2e28] active:scale-95" onClick={onAdd} type="button"><ShoppingBag className="size-4" /></button>
        </div>
      </div>
    </article>
  );
}

export function StitchHome({ locale }: { locale: Locale }) {
  const { addToCart, cart, hydrated } = useStore();
  const tr = locale === "tr";
  const count = hydrated ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!new FormData(form).get("email")?.toString().trim()) return;
    toast.success("Bülten kaydınız alındı.");
    form.reset();
  }

  return (
    <div className={`${sans.className} min-h-screen bg-[#fcf9f4] pb-20 text-[#221a1a] md:pb-0`}>
      <HomeHeader count={count} locale={locale} />

      <section className="mx-auto max-w-[1240px] px-4 pb-10 pt-6 md:px-8 md:pb-16 md:pt-12">
        <div className="grid overflow-hidden rounded-2xl border border-[#e8dfd5] bg-white shadow-[0_18px_60px_-34px_rgba(70,50,40,0.24)] lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10 flex flex-col justify-center p-5 sm:p-8 lg:p-14">
            <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#d4dfd5] bg-[#e2eae3] px-3 py-1.5 text-[11px] font-semibold text-[#2d4233]"><Leaf className="size-3.5" /> Kepez Floral Atelier</span>
            <h1 className={`${serif.className} max-w-2xl text-[36px] font-semibold leading-[1.08] tracking-[-0.025em] text-[#881414] sm:text-5xl lg:text-[58px]`}>{tr ? <>Sevginizi <em className="font-medium">taze çiçeklerle</em> anlatın.</> : <>Say it with <em className="font-medium">fresh flowers.</em></>}</h1>
            <p className="mt-4 max-w-xl text-[14px] leading-6 text-[#6e6259] sm:text-base sm:leading-7">{tr ? "Antalya'ya aynı gün teslimat. Kepez atölyemizde taze kesim çiçeklerle siparişinize özel hazırlanır." : "Same-day delivery across Antalya. Each order is arranged with fresh-cut flowers in our Kepez atelier."}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25d366] px-6 text-[13px] font-bold text-white shadow-[0_6px_20px_rgba(37,211,102,.25)] transition hover:-translate-y-0.5 hover:bg-[#20bd5a]" href={`${whatsappBase}?text=Merhaba%20Riva%20Çiçekçilik,%20sipariş%20vermek%20istiyorum.`} rel="noreferrer" target="_blank"><MessageCircle className="size-[18px]" /> {tr ? "WhatsApp ile Hızlı Sipariş" : "Quick Order on WhatsApp"}</a>
              <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e8dfd5] bg-[#f5efeb] px-6 text-[13px] font-semibold text-[#221a1a] transition hover:bg-white" href="#koleksiyon"><Flower2 className="size-[18px] text-[#8b1e19]" /> {tr ? "Çiçekleri Keşfet" : "Explore Flowers"}</a>
            </div>
            <div className="mt-7 grid grid-cols-3 border-t border-[#e8dfd5] pt-5 text-center text-[10px] font-semibold text-[#2d4233] sm:text-xs">
              <span className="flex flex-col items-center gap-1.5"><Leaf className="size-4" />{tr ? "Taze Kesim" : "Fresh Cut"}</span>
              <span className="flex flex-col items-center gap-1.5 border-x border-[#e8dfd5]"><Clock3 className="size-4" />{tr ? "Aynı Gün" : "Same Day"}</span>
              <span className="flex flex-col items-center gap-1.5"><HeartHandshake className="size-4" />{tr ? "Zarif Not" : "Gift Note"}</span>
            </div>
          </div>
          <div className="relative hidden min-h-[560px] bg-[#f5efeb] lg:block">
            <Image alt="Riva Çiçekçilik imza gül buketi" className="object-cover" fill loading="eager" sizes="45vw" src="/stitch-pages/store-07.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex items-center gap-4 rounded-xl border border-white/60 bg-[#fcf9f4]/90 p-4 shadow-xl backdrop-blur-md">
              <Image alt="Kaleci Romansı kırmızı gül buketi" className="size-20 rounded-lg object-cover" height={80} src="/stitch-pages/store-01.jpg" width={80} />
              <div className="min-w-0 flex-1"><span className="rounded bg-[#c81827] px-2 py-1 text-[10px] font-bold text-white">{tr ? "Çok Satan" : "Best Seller"}</span><p className={`${serif.className} mt-2 text-xl text-[#881414]`}>{tr ? "Günün Buketi" : "Bouquet of the Day"}</p><p className="font-bold text-[#8b1e19]">₺580</p></div>
              <Link aria-label={tr ? "Günün buketini incele" : "View bouquet of the day"} className="grid size-10 place-items-center rounded-full border border-[#e8dfd5] bg-white text-[#8b1e19]" href="/urun/kaleci-romansi-kirmizi-gul"><ArrowRight className="size-4" /></Link>
            </div>
          </div>
          <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl border border-[#e8dfd5] bg-[#f5efeb] p-3 lg:hidden">
            <Image alt="Kaleci Romansı kırmızı gül buketi" className="size-16 rounded-lg object-cover" height={64} src="/stitch-pages/store-01.jpg" width={64} />
            <div className="min-w-0 flex-1"><p className="text-[10px] text-[#6e6259]"><span className="mr-1 rounded bg-[#c81827] px-1.5 py-0.5 font-bold text-white">{tr ? "Çok Satan" : "Best Seller"}</span> {tr ? "Günün Buketi" : "Bouquet of the Day"}</p><p className={`${serif.className} mt-1 text-base text-[#881414]`}>{tr ? "Kaleci Romansı" : "Goalkeeper's Romance"}</p><p className="text-sm font-bold text-[#8b1e19]">₺580</p></div>
            <Link aria-label={tr ? "Gül buketini incele" : "View rose bouquet"} className="grid size-9 place-items-center rounded-full border border-[#e8dfd5] bg-white text-[#8b1e19]" href="/urun/kaleci-romansi-kirmizi-gul"><ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="category-title" className="mx-auto max-w-[1240px] px-4 pb-10 md:px-8 md:pb-16">
        <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#6e6259]">{tr ? "Kategoriler" : "Categories"}</p><h2 className={`${serif.className} mt-1 text-2xl text-[#881414] md:text-3xl`} id="category-title">{tr ? "Her ana özel çiçekler" : "Flowers for every moment"}</h2></div><Link className="inline-flex items-center gap-1 text-xs font-semibold text-[#881414]" href="/magaza">{tr ? "Tümünü Gör" : "View All"} <ChevronRight className="size-3.5" /></Link></div>
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-6 md:px-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <Link className="group flex w-[84px] shrink-0 snap-start flex-col items-center text-center md:w-auto" href={`/kategori/${category.slug}`} key={category.slug}>
              <span className="relative block aspect-square w-full overflow-hidden rounded-full border-2 border-[#e8dfd5] bg-white p-1 transition group-hover:border-[#aa2e28]"><span className="relative block size-full overflow-hidden rounded-full"><Image alt={category.name} className="object-cover transition duration-300 group-hover:scale-105" fill sizes="120px" src={category.image} /></span></span>
              <span className="mt-2 text-[10px] font-semibold leading-4 text-[#59413e] sm:text-xs">{tr ? category.name : category.nameEn}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e8dfd5] bg-[#fff8f7] py-10 md:py-20" id="koleksiyon">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-10"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8b1e19]">{tr ? "Öne Çıkan Ürünler" : "Featured Products"}</p><h2 className={`${serif.className} mt-1 text-[28px] leading-tight text-[#881414] md:text-4xl`}>{tr ? "Seçkin Aranjmanlar" : "Curated Arrangements"}</h2></div><span className="text-[10px] font-medium text-[#6e6259] md:text-xs">4 {tr ? "tasarım" : "designs"}</span></div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} locale={locale} onAdd={() => addToCart({ productId: product.id, quantity: 1, unitPrice: product.price })} product={product} />)}</div>
          <div className="mt-7 text-center"><Link className="inline-flex items-center gap-2 border-b border-[#8b1e19] pb-1 text-xs font-semibold text-[#8b1e19]" href="/magaza">{tr ? "Tüm Çiçek ve Aranjmanları İncele" : "Explore All Flowers & Arrangements"} <ArrowRight className="size-3.5" /></Link></div>
        </div>
      </section>

      <section className="border-b border-[#e8dfd5] bg-[#f5efeb] py-12 md:py-20">
        <div className="mx-auto grid max-w-[1040px] items-center gap-8 px-4 text-center md:grid-cols-[.9fr_1.1fr] md:px-8 md:text-left">
          <div className="relative hidden h-[360px] overflow-hidden rounded-[6rem_6rem_1rem_1rem] md:block"><Image alt="Riva Çiçekçilik butik çiçek tasarımı" className="object-cover" fill sizes="45vw" src="/stitch-home/category-arrangements.jpg" /></div>
          <div><Sparkles className="mx-auto size-6 text-[#8b1e19] md:mx-0" /><p className="mt-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#6e6259]">{tr ? "Felsefemiz" : "Our Philosophy"}</p><h2 className={`${serif.className} mt-2 text-[28px] leading-tight text-[#881414] md:text-4xl`}>{tr ? <>Doğadan ilham alarak,<br />zarafet için tasarlandı.</> : <>Inspired by nature,<br/>designed for grace.</>}</h2><p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-[#6e6259] md:mx-0 md:text-[15px] md:leading-7">{tr ? "Riva Çiçekçilik, yüksek tasarım anlayışını sürdürülebilir dokunuşlarla her aranjmanda bir araya getirir. Kepez atölyemizde her çiçek bilinçli ve özenli bir seçimdir." : "Riva brings elevated floral design and thoughtful, sustainable details together. Every stem in our Kepez atelier is a deliberate choice."}</p><Link className="mt-5 inline-flex items-center gap-1.5 border-b border-[#8b1e19] pb-1 text-xs font-semibold text-[#8b1e19]" href="/hakkimizda">Kepez Floral Atelier · Antalya <ArrowRight className="size-3.5" /></Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-10 md:px-8 md:py-20" id="iletisim">
        <div className="grid gap-6 rounded-2xl border border-[#e8dfd5] bg-white p-5 shadow-[0_12px_40px_-28px_rgba(70,50,40,.28)] md:grid-cols-[.8fr_1.2fr] md:p-8">
          <div className="flex flex-col justify-center"><Store className="size-6 text-[#8b1e19]" /><h2 className={`${serif.className} mt-3 text-2xl text-[#881414] md:text-3xl`}>Riva Çiçekçilik Atelier</h2><p className="mt-1 text-xs text-[#6e6259]">Kepez, Antalya · {tr ? "Destek & Sipariş" : "Support & Orders"}</p><p className="mt-5 text-sm leading-6 text-[#59413e]">{tr ? "Sorularınız ve özel tasarım talepleriniz için doğrudan atölyemize ulaşın." : "Contact our atelier directly for questions and bespoke floral requests."}</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a className="flex items-center gap-3 rounded-xl border border-[#e8dfd5] bg-[#fcf9f4] p-4 transition hover:border-[#aa2e28]" href="tel:+905316442880"><span className="grid size-10 place-items-center rounded-full bg-[#fff0f0] text-[#8b1e19]"><Phone className="size-4" /></span><span><small className="block text-[9px] font-bold uppercase tracking-wider text-[#6e6259]">Hemen Arayın</small><strong className="mt-1 block text-xs">+90 531 644 28 80</strong></span></a>
            <a className="flex items-center gap-3 rounded-xl border border-[#bde7ca] bg-[#e9fbef] p-4 transition hover:border-[#25d366]" href={`${whatsappBase}?text=Merhaba%20Riva%20Çiçekçilik`} rel="noreferrer" target="_blank"><span className="grid size-10 place-items-center rounded-full bg-[#25d366] text-white"><MessageCircle className="size-4" /></span><span><small className="block text-[9px] font-bold uppercase tracking-wider text-[#39744a]">WhatsApp Çiçek Hattı</small><strong className="mt-1 block text-xs">Canlı Çiçek Danışmanı</strong></span></a>
            <div className="rounded-xl border border-[#e8dfd5] bg-[#fcf9f4] p-4 sm:col-span-2"><p className="flex items-start gap-2 text-xs text-[#59413e]"><MapPin className="mt-0.5 size-4 shrink-0 text-[#8b1e19]" />Adres: Sütçüler Cd. No: 19, Kepez/Antalya</p><p className="mt-3 flex items-center gap-2 text-xs text-[#59413e]"><Clock3 className="size-4 shrink-0 text-[#8b1e19]" />Destek saatleri: Her gün 08:00 – 20:00</p></div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-[#6e6259] sm:col-span-2"><span>Antalya &amp; çevresi hızlı kurye</span><Link className="font-semibold text-[#221a1a]" href="/siparis-takip">Açık Sipariş Altyapısı</Link></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-10 md:px-8 md:pb-20"><div className="rounded-2xl bg-[#971515] p-6 text-white md:flex md:items-center md:justify-between md:gap-10 md:p-10"><div><Mail className="size-5" /><h2 className={`${serif.className} mt-3 text-2xl md:text-3xl`}>{tr ? "Bültene Katıl" : "Join Our Newsletter"}</h2><p className="mt-2 max-w-lg text-xs leading-5 text-white/85 md:text-sm">{tr ? "Yeni koleksiyonları, mevsim buketlerini ve özel gün indirimlerini ilk sen gör." : "Be first to see new collections, seasonal bouquets and special offers."}</p></div><form className="mt-5 flex w-full max-w-lg flex-col gap-2 sm:flex-row md:mt-0" onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">{tr ? "E-posta adresi" : "Email address"}</label><input className="min-h-11 flex-1 rounded-lg border border-white/20 bg-white px-4 text-sm text-[#221a1a] outline-none placeholder:text-[#8c716d] focus:ring-2 focus:ring-white/50" id="newsletter-email" name="email" placeholder={tr ? "E-posta adresinizi giriniz..." : "Enter your email..."} required type="email" /><button className="min-h-11 rounded-lg bg-[#2d4233] px-7 text-xs font-bold transition hover:bg-[#3b5944]" type="submit">{tr ? "Katıl" : "Join"}</button></form></div></section>

      <footer className="border-t border-[#e8dfd5] px-4 py-8 text-center text-[#6e6259]"><div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs"><Link href="/hakkimizda">Hakkımızda</Link><Link href="/iletisim">İletişim</Link><Link href="/gizlilik-politikasi">Gizlilik</Link><Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış</Link></div><p className="mt-4 text-[10px]">© {new Date().getFullYear()} Riva Çiçekçilik. Tüm Hakları Saklıdır.</p></footer>

      <nav aria-label="Mobil hızlı menü" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-[#e8dfd5] bg-[#fcf9f4]/96 px-2 pb-[max(.4rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_-18px_rgba(70,50,40,.3)] backdrop-blur-xl md:hidden">
        <a className="flex flex-col items-center gap-1 text-[9px] font-semibold text-[#881414]" href="#koleksiyon"><Flower2 className="size-[18px]" />Koleksiyon</a><Link className="flex flex-col items-center gap-1 text-[9px] text-[#59413e]" href="/arama"><Search className="size-[18px]" />Arama</Link><a className="flex flex-col items-center gap-1 text-[9px] text-[#25a956]" href={`${whatsappBase}?text=Merhaba%20Riva%20Çiçekçilik`}><MessageCircle className="size-[18px]" />WhatsApp</a><a className="flex flex-col items-center gap-1 text-[9px] text-[#59413e]" href="#iletisim"><Store className="size-[18px]" />Atölye</a>
      </nav>
    </div>
  );
}
