"use client";

import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { getLocalizedProduct } from "@/lib/data";
import type { Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";
import { BotanicalProductCard, money } from "./catalog";

export function BotanicalProductDetail({ product: rawProduct, similar, locale }: { product: Product; similar: Product[]; locale: Locale }) {
  const product = getLocalizedProduct(rawProduct, locale);
  const tr = locale === "tr";
  const { addToCart } = useStore();
  const [size, setSize] = useState("standard");
  const [ribbon, setRibbon] = useState(tr ? "Krem" : "Cream");
  const [wrap, setWrap] = useState(tr ? "Doğal Kraft" : "Natural Kraft");
  const [note, setNote] = useState("");
  const total = product.basePrice + (size === "showy" ? 250 : 0);
  const image = product.images[0];
  const order = () => addToCart({ productId: product.id, quantity: 1, unitPrice: total, note, selectedOptions: { Size: size, Ribbon: ribbon, Wrap: wrap } });
  const ribbons = tr ? ["Krem","Gül kurusu","Ada çayı yeşili","Bordo"] : ["Cream","Dusty rose","Sage green","Burgundy"];
  const wraps = tr ? ["Doğal Kraft","Krem Dokulu","Pudra Pembe","Mat Siyah"] : ["Natural Kraft","Textured Cream","Blush Pink","Matte Black"];
  return <div className="pb-28 lg:pb-0"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-10 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-16"><div>{image ? <div className="relative aspect-square overflow-hidden rounded-[30px] bg-[#eee7df]"><Image src={image.imageUrl} alt={image.altText} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 55vw"/></div> : null}<div className="mt-4 grid grid-cols-3 gap-3">{["detail-02.jpg","detail-03.jpg","detail-04.jpg"].map((img,i)=><div className="relative aspect-[1.2] overflow-hidden rounded-2xl bg-[#eee7df]" key={img}><Image src={`/stitch-pages/${img}`} alt={`${product.name} ${tr?"detay":"detail"} ${i+1}`} fill sizes="(max-width: 1024px) 33vw, 180px" className="object-cover"/></div>)}</div></div><div className="lg:sticky lg:top-28 lg:self-start"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#a52d26]">{tr?"Atölyeden taptaze":"Fresh from the atelier"}</p><h1 className="mt-3 font-noto-serif text-4xl font-bold leading-tight md:text-5xl">{product.name}</h1><p className="mt-4 text-sm leading-7 text-[#6d655f]">{product.description}</p><p className="mt-6 text-3xl font-extrabold text-[#8f2721]">{money(total,locale)}</p><div className="my-7 h-px bg-[#e3d8d0]"/><OptionButtons label={tr?"Boyut seçin":"Choose size"} value={size} onChange={setSize} options={[["standard",tr?"Standart":"Standard"],["showy",tr?"Gösterişli · +₺250":"Showy · +₺250"]]}/><OptionButtons label={tr?"Kurdele rengi":"Ribbon color"} value={ribbon} onChange={setRibbon} options={ribbons.map(item=>[item,item])}/><OptionButtons label={tr?"Buket kağıdı":"Bouquet wrap"} value={wrap} onChange={setWrap} options={wraps.map(item=>[item,item])}/><label className="mt-6 block text-sm font-bold">{tr?"Kart notu":"Gift note"}<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={tr?"Sevginizi birkaç kelimeyle anlatın…":"Share your message…"} className="mt-2 min-h-20 w-full rounded-2xl border border-[#ddd2ca] bg-white p-4 text-sm font-normal outline-none focus:border-[#aa2e28]"/></label><button onClick={order} className="mt-5 hidden w-full rounded-full bg-[#aa2e28] px-6 py-4 text-sm font-extrabold text-white shadow-lg lg:block">{tr?"Sepete ekle":"Add to cart"} · {money(total,locale)}</button><div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#59665d]"><span>✓ {tr?"Taze kesim":"Fresh cut"}</span><span>⌂ {tr?"Aynı gün teslimat":"Same-day delivery"}</span><span>♡ {tr?"Özenli paketleme":"Careful wrapping"}</span></div></div></div><section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a52d26]">{tr?"Bunları da sevebilirsiniz":"You may also love"}</p><h2 className="mt-2 font-noto-serif text-3xl font-bold">{tr?"Benzer tasarımlar":"Similar designs"}</h2><div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{similar.map(p=><BotanicalProductCard key={p.id} product={p} locale={locale}/>)}</div></section><div className="fixed inset-x-0 bottom-[82px] z-40 flex items-center gap-3 border-t border-[#e4d8d0] bg-[#fffdfa]/95 p-4 backdrop-blur lg:hidden"><div className="mr-auto"><small className="text-[#746d67]">{tr?"Toplam":"Total"}</small><b className="block text-lg text-[#8f2721]">{money(total,locale)}</b></div><button onClick={order} className="rounded-full bg-[#aa2e28] px-7 py-3 text-sm font-bold text-white">{tr?"Sepete ekle":"Add to cart"}</button></div></div>;
}

function OptionButtons({ label, value, onChange, options }: { label: string; value: string; onChange: (value:string)=>void; options: string[][] }) {
  return <div className="mt-5"><p className="text-sm font-bold">{label}</p><div className="mt-2 flex flex-wrap gap-2">{options.map(([key,text])=><button key={key} onClick={()=>onChange(key)} className={`rounded-full border px-4 py-2 text-xs font-bold ${value===key?"border-[#aa2e28] bg-[#faeeea] text-[#8f2721]":"border-[#ddd2ca] bg-white"}`}>{text}</button>)}</div></div>;
}
