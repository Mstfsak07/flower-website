"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { getLocalizedProduct, products } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";

export const money = (value: number, locale: Locale = "tr") => new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);

export function BotanicalProductCard({ product: rawProduct, large = false, locale = "tr" }: { product: Product; large?: boolean; locale?: Locale }) {
  const { addToCart } = useStore();
  const product = getLocalizedProduct(rawProduct, locale);
  const image = product.images[0];
  return <article className="group min-w-0">
    <Link href={`/urun/${product.slug}`} className={`relative block overflow-hidden rounded-[24px] bg-[#eee7df] ${large ? "aspect-[1.08]" : "aspect-[.9]"}`}>
      {image ? <Image src={image.imageUrl} alt={image.altText} fill className="object-cover transition duration-500 group-hover:scale-[1.035]" sizes={large ? "(max-width:768px) 100vw, 33vw" : "(max-width:768px) 50vw, 30vw"}/> : null}
      {product.badges?.[0] ? <span className="absolute left-3 top-3 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#7d211d] backdrop-blur">{product.badges[0]}</span> : null}
    </Link>
    <div className="flex items-start justify-between gap-2 px-1 pt-4"><div className="min-w-0"><Link href={`/urun/${product.slug}`} className="font-noto-serif text-[16px] font-bold leading-snug text-[#342d29] hover:text-[#aa2e28]">{product.name}</Link><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#736b65]">{product.shortDescription}</p><p className="mt-2 text-base font-extrabold text-[#8f2721]">{money(product.basePrice, locale)} {product.compareAtPrice ? <del className="ml-1 text-xs font-medium text-[#99908a]">{money(product.compareAtPrice, locale)}</del> : null}</p></div><button onClick={() => addToCart({ productId: product.id, quantity: 1, unitPrice: product.basePrice })} className="mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-[#aa2e28] text-xl text-white shadow-md transition hover:scale-105" aria-label={`${product.name} ${locale === "tr" ? "sepete ekle" : "add to cart"}`}>+</button></div>
  </article>;
}

export function StorefrontPage({ locale }: { locale: Locale }) {
  const tr = locale === "tr";
  const [filter, setFilter] = useState("all");
  const filters = [["all",tr?"Tümü":"All"],["bouquets",tr?"Buketler":"Bouquets"],["arrangements",tr?"Aranjmanlar":"Arrangements"],["roses",tr?"Güller":"Roses"],["orchids",tr?"Orkideler":"Orchids"],["preserved",tr?"Solmayan Güller":"Preserved Roses"]];
  const visible = useMemo(() => filter === "all" ? products.slice(0,8) : products.filter(p => filter === "arrangements" ? p.categoryId === "cat-aranjmanlar" : filter === "orchids" ? p.categoryId === "cat-orkideler" : filter === "preserved" ? p.categoryId === "cat-solmayan-guller" : filter === "roses" ? p.categoryId === "cat-gul-buketleri" : p.categoryId === "cat-buketler"), [filter]);
  return <div className="bg-[#fcf9f4]"><section className="mx-auto max-w-[1240px] px-5 pb-10 pt-12 lg:px-8 lg:pt-16"><p className="text-xs font-extrabold uppercase tracking-[.24em] text-[#a52d26]">{tr?"Riva seçkisi":"The Riva edit"}</p><div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-noto-serif text-4xl font-bold text-[#352c28] md:text-6xl">{tr?<>Taze çiçekler,<br/><i className="font-normal text-[#a52d26]">iyi hisler.</i></>:<>Fresh flowers,<br/><i className="font-normal text-[#a52d26]">beautiful feelings.</i></>}</h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#6e6761]">{tr?"Antalya'nın en taze çiçekleri Kepez atölyemizde hazırlanır ve aynı gün kapınıza gelir.":"Antalya's freshest flowers are arranged in our Kepez atelier and delivered to your door the same day."}</p></div><div className="rounded-2xl bg-[#edf3eb] px-5 py-4 text-sm text-[#31513f]">✓ {tr?"Kepez'e ücretsiz teslimat":"Free delivery in Kepez"}</div></div><div className="mt-9 flex gap-2 overflow-x-auto pb-2">{filters.map(([key,label]) => <button key={key} onClick={()=>setFilter(key)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition ${filter===key ? "bg-[#aa2e28] text-white" : "border border-[#dfd4cb] bg-white text-[#625b55]"}`}>{label}</button>)}</div></section><section className="mx-auto max-w-[1240px] px-5 pb-10 lg:px-8"><div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">{visible.map(p=><BotanicalProductCard key={p.id} product={p} locale={locale}/>)}</div></section><section className="mx-auto my-16 max-w-[1180px] rounded-[30px] bg-[#2e5d47] px-7 py-10 text-white md:flex md:items-center md:justify-between md:px-12"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#cfe3d7]">{tr?"Aklınızdaki tasarım farklı mı?":"Have something else in mind?"}</p><h2 className="mt-2 font-noto-serif text-3xl font-bold">{tr?"Size özel bir buket hazırlayalım.":"Let us create a bespoke bouquet."}</h2></div><a href="https://wa.me/905316442880" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-[#24503b] md:mt-0">{tr?"WhatsApp'tan konuşalım":"Chat on WhatsApp"}</a></section></div>;
}

export function ArrangementsPage({ locale }: { locale: Locale }) {
  const tr = locale === "tr";
  const items = products.filter(p => p.categoryId === "cat-aranjmanlar").slice(0,6);
  return <div><section className="mx-auto max-w-[1240px] px-5 pb-12 pt-14 text-center lg:px-8"><p className="text-xs font-extrabold uppercase tracking-[.25em] text-[#a52d26]">{tr?"Riva imza koleksiyonu":"Riva signature collection"}</p><h1 className="mt-4 font-noto-serif text-4xl font-bold md:text-6xl">{tr?<>Her köşeye biraz <i className="font-normal text-[#a52d26]">doğa.</i></>:<>A touch of <i className="font-normal text-[#a52d26]">nature</i> in every corner.</>}</h1><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6e6761]">{tr?"El işçiliği seramikler, doğal kutular ve mevsimin en güzel çiçekleriyle hazırlanan atölye tasarımları.":"Atelier designs made with handcrafted ceramics, natural boxes and the finest seasonal flowers."}</p></section><section className="mx-auto grid max-w-[1240px] gap-12 px-5 md:grid-cols-2 lg:grid-cols-3 lg:px-8">{items.map(p=><BotanicalProductCard key={p.id} product={p} large locale={locale}/>)}</section><section className="mx-auto my-20 max-w-[1180px] overflow-hidden rounded-[32px] bg-[#f0dfd6] px-8 py-12 md:px-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8c332d]">{tr?"Kişiye özel":"Bespoke"}</p><h2 className="mt-3 max-w-xl font-noto-serif text-3xl font-bold md:text-5xl">{tr?"Hayalinizdeki aranjmanı birlikte tasarlayalım.":"Let's design the arrangement you imagine."}</h2><a href="https://wa.me/905316442880" className="mt-7 inline-flex rounded-full bg-[#aa2e28] px-6 py-3 text-sm font-bold text-white">{tr?"WhatsApp'tan yazın":"Message us on WhatsApp"} →</a></section></div>;
}
