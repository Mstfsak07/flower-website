"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

const products = [
  { name: "Noir Rose", price: "₺2.850", image: "/products/rose-classic.jpg", tag: "Çok Satan" },
  { name: "Velours", price: "₺3.450", image: "/products/rose-soft.jpg", tag: "Yeni" },
  { name: "Rouge Éclat", price: "₺2.650", image: "/products/rose-pastel.jpg", tag: "Çok Satan" },
  { name: "Lilas Nocturne", price: "₺2.950", image: "/products/violet-cluster.jpg", tag: "Yeni" },
  { name: "Jardin Secret", price: "₺3.200", image: "/products/mixed-delicate.jpg", tag: "Çok Satan" },
  { name: "Lavande", price: "₺2.400", image: "/products/lavender-bouquet.jpg", tag: "Yeni" },
  { name: "Étoile", price: "₺2.750", image: "/products/white-daisies.jpg", tag: "Çok Satan" },
  { name: "Blush Atelier", price: "₺3.650", image: "/pembe-gul.jpg", tag: "Yeni" },
];

const collections = [
  { number: "01", title: "Güller", image: "/products/rose-classic.jpg" },
  { number: "02", title: "Orkide", image: "/kalanso.jpg" },
  { number: "03", title: "Kutuda Çiçek", image: "/homepage-flower.png" },
];

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } };

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const transition = reduced ? { duration: 0 } : { duration: 0.8 };

  return (
    <div className="riva-home min-h-screen overflow-hidden bg-[var(--ink)] text-[var(--ivory)]">
      <header className="riva-nav fixed inset-x-4 top-4 z-50 mx-auto max-w-7xl border border-[var(--gold)]/30 bg-[var(--ink)]/75 px-5 py-4 backdrop-blur-xl md:inset-x-8 md:px-8">
        <div className="flex items-center justify-between gap-5">
          <Link href="#ana-sayfa" className="font-display text-2xl italic tracking-tight text-[var(--gold)]">Riva</Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {["Ana Sayfa", "Mağaza", "Koleksiyonlar", "Hakkımızda", "İletişim"].map((item, i) => <Link key={item} href={i === 1 ? "/magaza" : i === 4 ? "/iletisim" : `#${item.toLowerCase().replace("ı", "i")}`} className="riva-label text-[var(--ivory)]/70 transition hover:text-[var(--gold)]">{item}</Link>)}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sepet" aria-label="Sepet" className="relative text-[var(--gold)]"><ShoppingBag size={18}/><span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[9px] text-[var(--ink)]">0</span></Link>
            <span className="hidden text-[10px] tracking-[.25em] text-[var(--gold)] sm:block">TR / EN</span>
            <button aria-label="Menüyü aç" onClick={() => setMenuOpen(!menuOpen)} className="text-[var(--gold)] lg:hidden">{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
          </div>
        </div>
        {menuOpen && <nav className="mt-5 flex flex-col gap-4 border-t border-[var(--gold)]/20 pt-5 lg:hidden">{["Ana Sayfa", "Mağaza", "Koleksiyonlar", "Hakkımızda", "İletişim"].map((item) => <Link key={item} href="#" onClick={() => setMenuOpen(false)} className="riva-label text-[var(--ivory)]/80">{item}</Link>)}</nav>}
      </header>

      <main id="ana-sayfa">
        <section className="riva-hero relative flex min-h-[850px] items-center px-6 pb-24 pt-40 md:px-12 lg:px-20">
          <div className="hero-glow" aria-hidden="true" />
          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[.9fr_1.1fr]">
            <motion.div initial="hidden" animate="visible" variants={reveal} transition={transition}>
              <p className="riva-label mb-7 text-[var(--gold)]">Antalya&apos;nın butik çiçekçisi</p>
              <h1 className="max-w-2xl font-display text-6xl leading-[.93] tracking-[-.04em] text-[var(--ivory)] md:text-8xl">Çiçek, en <em className="text-[var(--rose)]">zarif</em> ifadedir.</h1>
              <p className="mt-8 max-w-md text-sm leading-7 text-[var(--ivory)]/60">Özel anlar için tasarlanan, Antalya&apos;da aynı gün teslim edilen zamansız aranjmanlar.</p>
              <div className="mt-10 flex flex-wrap gap-3"><Link href="/magaza" className="riva-button bg-[var(--gold)] text-[var(--ink)]">Koleksiyonu Keşfet <ArrowUpRight size={15}/></Link><a href="https://wa.me/905551234567" className="riva-button border border-[var(--gold)]/60 text-[var(--gold)]">WhatsApp ile Sipariş</a></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...transition, delay: .15 }} className="relative mx-auto aspect-[.82] w-full max-w-[520px]">
              <div className="hero-photo absolute inset-0 overflow-hidden"><Image src="/homepage-hero-20260421.png" alt="Koyu kırmızı güllerden oluşan Riva buketi" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /></div>
              <div className="absolute -bottom-5 -left-5 border border-[var(--gold)]/30 bg-[var(--ink)]/90 px-5 py-4 backdrop-blur-md"><p className="riva-label mb-1 text-[var(--rose)]">Signature edit</p><p className="font-display text-xl italic text-[var(--ivory)]">Noir Rose <span className="ml-3 text-sm not-italic text-[var(--gold)]">₺2.850</span></p></div>
            </motion.div>
          </div>
        </section>

        <div className="overflow-hidden border-y border-[var(--gold)]/15 bg-[var(--wine)] py-5"><div className="marquee flex min-w-max gap-10 whitespace-nowrap font-display text-2xl italic text-[var(--gold)]/80">{["Doğum Günü", "Sevgililer Günü", "Anneler Günü", "Yıldönümü", "Geçmiş Olsun", "Doğum Günü", "Sevgililer Günü"].map((x, i) => <span key={i}>{x} <b className="ml-8 text-xs not-italic">◆</b></span>)}</div></div>

        <section id="mağaza" className="bg-[var(--wine)] px-6 py-28 md:px-12 lg:px-20"><SectionIntro eyebrow="Riva seçkisi" title="Seçkin Buketler"/><div className="mx-auto mt-14 grid max-w-7xl gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{products.map((product, i) => <motion.article key={product.name} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .15 }} variants={reveal} transition={{ ...transition, delay: i % 4 * .06 }} className="group"><div className="product-image relative aspect-[.78] overflow-hidden border border-[var(--gold)]/15"><Image src={product.image} alt={`${product.name} buketi`} fill loading="lazy" className="object-cover transition duration-1000 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 25vw"/><span className="absolute left-3 top-3 riva-label bg-[var(--ink)]/70 px-2 py-1 text-[var(--gold)]">{product.tag}</span><button className="absolute inset-x-3 bottom-3 translate-y-16 bg-[var(--gold)] py-3 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--ink)] transition duration-500 group-hover:translate-y-0">Sepete Ekle</button></div><div className="flex items-end justify-between pt-4"><h3 className="font-display text-2xl text-[var(--ivory)]">{product.name}</h3><p className="text-sm text-[var(--gold)]">{product.price}</p></div></motion.article>)}</div></section>

        <section id="koleksiyonlar" className="bg-[var(--ink)] px-6 py-28 md:px-12 lg:px-20"><SectionIntro eyebrow="Mevsimsel imzalar" title="Koleksiyonlar"/><div className="mx-auto mt-14 grid max-w-7xl gap-6 md:grid-cols-3">{collections.map((collection) => <div key={collection.number} className="collection-card group relative"><div className="arch-frame relative aspect-[.72] overflow-hidden"><Image src={collection.image} alt={`${collection.title} koleksiyonu`} fill loading="lazy" className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw"/><div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-transparent"/></div><div className="absolute inset-x-6 bottom-7 flex items-end justify-between"><div><span className="riva-label text-[var(--gold)]">Koleksiyon</span><h3 className="mt-2 font-display text-4xl text-[var(--ivory)]">{collection.title}</h3></div><span className="font-display text-5xl text-[var(--gold)]/70">{collection.number}</span></div></div>)}</div></section>

        <section className="bg-[var(--charcoal)] px-6 py-28 md:px-12 lg:px-20"><div className="mx-auto max-w-7xl"><SectionIntro eyebrow="Riva hakkında" title="Neden Riva?"/><div className="mt-16 grid divide-y divide-[var(--gold)]/20 border-y border-[var(--gold)]/20 md:grid-cols-3 md:divide-x md:divide-y-0">{[["12", "Yıllık deneyim"], ["4.800", "Mutlu teslimat"], ["24", "Saatlik özen"]].map(([num, label]) => <div key={label} className="px-5 py-10 text-center md:py-14"><p className="font-display text-6xl text-[var(--gold)]">{num}<span className="text-3xl">+</span></p><p className="riva-label mt-3 text-[var(--ivory)]/50">{label}</p></div>)}</div></div></section>

        <section className="bg-[var(--ink)] px-6 py-28 md:px-12 lg:px-20"><SectionIntro eyebrow="Riva ritüeli" title="Nasıl Çalışır?"/><div className="mx-auto mt-16 grid max-w-6xl gap-12 md:grid-cols-3">{[["01", "Seç", "Koleksiyonumuzdan size en yakın duyguyu bulun."], ["02", "Kişiselleştir", "Notunuzu ve teslimat detaylarınızı bize bırakın."], ["03", "Aynı Gün Teslim", "Antalya&apos;da çiçeğiniz aynı gün zarafetle ulaşsın."]].map(([n, t, d]) => <div key={n} className="relative border-t border-[var(--gold)]/40 pt-6"><span className="font-display text-5xl text-[var(--rose)]/70">{n}</span><h3 className="mt-5 font-display text-3xl text-[var(--ivory)]">{t}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[var(--ivory)]/50">{d}</p></div>)}</div></section>

        <section className="bg-[var(--wine)] px-6 py-28 md:px-12 lg:px-20"><div className="mx-auto max-w-3xl text-center"><span className="font-display text-7xl text-[var(--gold)]/70">“</span><p className="-mt-5 font-display text-3xl leading-tight text-[var(--ivory)] md:text-5xl">Riva&apos;nın buketi, sadece çiçek değil; hissettiğiniz duygunun en zarif haliydi.</p><p className="riva-label mt-8 text-[var(--rose)]">— Derya, Antalya</p></div></section>

        <section className="riva-closing relative bg-[var(--ink)] px-6 py-32 text-center md:px-12"><div className="closing-glow"/><div className="relative"><p className="riva-label text-[var(--gold)]">Bir duygu bırakın</p><h2 className="mx-auto mt-6 max-w-3xl font-display text-5xl leading-tight text-[var(--ivory)] md:text-7xl">En güzel sözler, bazen <em className="text-[var(--rose)]">çiçeklerle</em> söylenir.</h2><a href="https://wa.me/905551234567" className="riva-button mt-10 inline-flex bg-[var(--gold)] text-[var(--ink)]">WhatsApp&apos;tan Sipariş Ver <MessageCircle size={16}/></a></div></section>
      </main>

      <footer className="border-t border-[var(--gold)]/20 bg-[var(--charcoal)] px-6 py-14 md:px-12 lg:px-20"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><p className="font-display text-3xl italic text-[var(--gold)]">Riva</p><p className="mt-4 max-w-xs text-sm leading-6 text-[var(--ivory)]/50">Antalya&apos;nın özel anlar için çalışan butik çiçek atölyesi.</p><div className="mt-6 flex gap-4 text-[var(--gold)]"><Instagram size={17}/><MessageCircle size={17}/></div></div><FooterCol title="İletişim" items={["+90 555 123 45 67", "info@rivacicekcilik.com", "Konyaaltı, Antalya"]}/><FooterCol title="Ziyaret" items={["Pzt — Cmt 09:00 — 20:00", "Pazar 10:00 — 18:00", "Aynı gün teslimat"]}/><FooterCol title="Yasal" items={["Gizlilik Politikası", "Mesafeli Satış Sözleşmesi", "İade ve İptal Koşulları"]}/></div><div className="mx-auto mt-12 max-w-7xl border-t border-[var(--gold)]/15 pt-6 text-[10px] uppercase tracking-[.18em] text-[var(--ivory)]/35">© 2026 Riva Çiçekçilik · Tüm hakları saklıdır.</div></footer>
      <a href="https://wa.me/905551234567" aria-label="WhatsApp ile iletişim" className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--ink)] shadow-[0_0_30px_rgba(217,192,138,.22)] transition hover:scale-105"><MessageCircle size={22}/></a>
    </div>
  );
}

function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="mx-auto max-w-7xl"><p className="riva-label text-[var(--rose)]">{eyebrow}</p><h2 className="mt-4 font-display text-5xl text-[var(--ivory)] md:text-7xl">{title}</h2><div className="mt-6 h-px w-16 bg-[var(--gold)]/60"/></div>; }
function FooterCol({ title, items }: { title: string; items: string[] }) { return <div><p className="riva-label mb-5 text-[var(--gold)]">{title}</p><ul className="space-y-3 text-sm text-[var(--ivory)]/55">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>; }
