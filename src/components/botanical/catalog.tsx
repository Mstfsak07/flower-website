"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { products } from "@/lib/data";
import type { Product } from "@/lib/types";

const money = (value: number) => new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(value);

export function BotanicalProductCard({ product, large = false }: { product: Product; large?: boolean }) {
  const { addToCart } = useStore();
  const image = product.images[0];
  return <article className="group min-w-0">
    <Link href={`/urun/${product.slug}`} className={`relative block overflow-hidden rounded-[24px] bg-[#eee7df] ${large ? "aspect-[1.08]" : "aspect-[.9]"}`}>
      {image && <Image src={image.imageUrl} alt={image.altText} fill className="object-cover transition duration-500 group-hover:scale-[1.035]" sizes={large ? "(max-width:768px) 100vw, 33vw" : "(max-width:768px) 50vw, 30vw"}/>} 
      {product.badges?.[0] && <span className="absolute left-3 top-3 rounded-full bg-[#fffaf4]/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#7d211d] backdrop-blur">{product.badges[0]}</span>}
    </Link>
    <div className="flex items-start justify-between gap-2 px-1 pt-4">
      <div className="min-w-0"><Link href={`/urun/${product.slug}`} className="font-noto-serif text-[16px] font-bold leading-snug text-[#342d29] hover:text-[#aa2e28]">{product.name}</Link><p className="mt-1 line-clamp-2 text-xs leading-5 text-[#736b65]">{product.shortDescription}</p><p className="mt-2 text-base font-extrabold text-[#8f2721]">{money(product.basePrice)} {product.compareAtPrice && <del className="ml-1 text-xs font-medium text-[#99908a]">{money(product.compareAtPrice)}</del>}</p></div>
      <button onClick={() => addToCart({ productId: product.id, quantity: 1, unitPrice: product.basePrice })} className="mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-[#aa2e28] text-xl text-white shadow-md transition hover:scale-105" aria-label={`${product.name} sepete ekle`}>+</button>
    </div>
  </article>;
}

export function StorefrontPage() {
  const [filter, setFilter] = useState("Tümü");
  const filters = ["Tümü", "Buketler", "Aranjmanlar", "Güller", "Orkideler", "Solmayan Güller"];
  const visible = useMemo(() => filter === "Tümü" ? products.slice(0,8) : products.filter(p => filter === "Aranjmanlar" ? p.categoryId === "cat-aranjmanlar" : filter === "Orkideler" ? p.categoryId === "cat-orkideler" : filter === "Solmayan Güller" ? p.categoryId === "cat-solmayan-guller" : filter === "Güller" ? p.categoryId === "cat-gul-buketleri" : p.categoryId === "cat-buketler"), [filter]);
  return <div className="bg-[#fcf9f4]">
    <section className="mx-auto max-w-[1240px] px-5 pb-10 pt-12 lg:px-8 lg:pt-16"><p className="text-xs font-extrabold uppercase tracking-[.24em] text-[#a52d26]">Riva seçkisi</p><div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-noto-serif text-4xl font-bold text-[#352c28] md:text-6xl">Taze çiçekler,<br/><i className="font-normal text-[#a52d26]">iyi hisler.</i></h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#6e6761]">Antalya&apos;nın en taze çiçekleri, Kepez&apos;deki atölyemizde özenle hazırlanır ve aynı gün kapınıza gelir.</p></div><div className="rounded-2xl bg-[#edf3eb] px-5 py-4 text-sm text-[#31513f]">✓ Kepez&apos;e aynı gün teslimat</div></div>
      <div className="mt-9 flex gap-2 overflow-x-auto pb-2">{filters.map(item => <button key={item} onClick={()=>setFilter(item)} className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition ${filter===item ? "bg-[#aa2e28] text-white" : "border border-[#dfd4cb] bg-white text-[#625b55]"}`}>{item}</button>)}</div>
    </section>
    <section className="mx-auto max-w-[1240px] px-5 pb-10 lg:px-8"><div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">{visible.map(p=><BotanicalProductCard key={p.id} product={p}/>)}</div></section>
    <section className="mx-auto my-16 max-w-[1180px] rounded-[30px] bg-[#2e5d47] px-7 py-10 text-white md:flex md:items-center md:justify-between md:px-12"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#cfe3d7]">Aklınızdaki tasarım farklı mı?</p><h2 className="mt-2 font-noto-serif text-3xl font-bold">Size özel bir buket hazırlayalım.</h2></div><a href="https://wa.me/905316442880" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-[#24503b] md:mt-0">WhatsApp&apos;tan konuşalım</a></section>
  </div>;
}

export function ArrangementsPage() {
  const items = products.filter(p => p.categoryId === "cat-aranjmanlar").slice(0,6);
  return <div><section className="mx-auto max-w-[1240px] px-5 pb-12 pt-14 text-center lg:px-8"><p className="text-xs font-extrabold uppercase tracking-[.25em] text-[#a52d26]">Riva imza koleksiyonu</p><h1 className="mt-4 font-noto-serif text-4xl font-bold md:text-6xl">Her köşeye biraz <i className="font-normal text-[#a52d26]">doğa.</i></h1><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6e6761]">El işçiliği seramikler, doğal kutular ve mevsimin en güzel çiçekleriyle hazırlanan atölye tasarımları.</p></section><section className="mx-auto grid max-w-[1240px] gap-12 px-5 md:grid-cols-2 lg:grid-cols-3 lg:px-8">{items.map(p=><BotanicalProductCard key={p.id} product={p} large/>)}</section><section className="mx-auto my-20 max-w-[1180px] overflow-hidden rounded-[32px] bg-[#f0dfd6] px-8 py-12 md:px-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8c332d]">Kişiye özel</p><h2 className="mt-3 max-w-xl font-noto-serif text-3xl font-bold md:text-5xl">Hayalinizdeki aranjmanı birlikte tasarlayalım.</h2><a href="https://wa.me/905316442880" className="mt-7 inline-flex rounded-full bg-[#aa2e28] px-6 py-3 text-sm font-bold text-white">WhatsApp&apos;tan yazın →</a></section></div>;
}

export { money };
