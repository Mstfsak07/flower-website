"use client";

import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import type { Product } from "@/lib/types";
import { BotanicalProductCard, money } from "./catalog";

export function BotanicalProductDetail({ product, similar }: { product: Product; similar: Product[] }) {
  const { addToCart } = useStore();
  const [size, setSize] = useState("Standart");
  const [note, setNote] = useState("");
  const image = product.images[0];
  const order = () => addToCart({ productId: product.id, quantity: 1, unitPrice: product.basePrice + (size === "Gösterişli" ? 250 : 0), note, selectedOptions: { Boyut: size } });
  return <div className="pb-28 lg:pb-0"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-10 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-16">
    <div>{image && <div className="relative aspect-square overflow-hidden rounded-[30px] bg-[#eee7df]"><Image src={image.imageUrl} alt={image.altText} fill className="object-cover" priority sizes="(max-width:1024px) 100vw, 55vw"/></div>}<div className="mt-4 grid grid-cols-3 gap-3">{["detail-02.jpg","detail-03.jpg","detail-04.jpg"].map((img,i)=><div className="relative aspect-[1.2] overflow-hidden rounded-2xl bg-[#eee7df]" key={img}><Image src={`/stitch-pages/${img}`} alt={`${product.name} detay ${i+1}`} fill className="object-cover"/></div>)}</div></div>
    <div className="lg:sticky lg:top-28 lg:self-start"><p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#a52d26]">Atölyeden taptaze</p><h1 className="mt-3 font-noto-serif text-4xl font-bold leading-tight md:text-5xl">{product.name}</h1><p className="mt-4 text-sm leading-7 text-[#6d655f]">{product.description}</p><p className="mt-6 text-3xl font-extrabold text-[#8f2721]">{money(product.basePrice)}</p>
      <div className="my-7 h-px bg-[#e3d8d0]"/><label className="text-sm font-bold">Boyut seçin</label><div className="mt-3 grid grid-cols-2 gap-3">{["Standart","Gösterişli"].map(item=><button key={item} onClick={()=>setSize(item)} className={`rounded-2xl border p-4 text-left text-sm font-bold ${size===item ? "border-[#aa2e28] bg-[#faeeea] text-[#8f2721]" : "border-[#ddd2ca] bg-white"}`}>{item}<small className="mt-1 block font-normal text-[#756e68]">{item === "Gösterişli" ? "+₺250 · Daha dolgun" : "Görseldeki boyut"}</small></button>)}</div>
      <label className="mt-6 block text-sm font-bold">Kart notu</label><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Sevginizi birkaç kelimeyle anlatın…" className="mt-2 min-h-24 w-full rounded-2xl border border-[#ddd2ca] bg-white p-4 text-sm outline-none focus:border-[#aa2e28]"/>
      <button onClick={order} className="mt-5 hidden w-full rounded-full bg-[#aa2e28] px-6 py-4 text-sm font-extrabold text-white shadow-lg lg:block">Sepete ekle · {money(product.basePrice + (size === "Gösterişli" ? 250 : 0))}</button>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-[#59665d]"><span>✓ Taze kesim</span><span>⌂ Aynı gün teslimat</span><span>♡ Özenli paketleme</span></div>
    </div>
  </div><section className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#a52d26]">Bunları da sevebilirsiniz</p><h2 className="mt-2 font-noto-serif text-3xl font-bold">Benzer tasarımlar</h2><div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{similar.map(p=><BotanicalProductCard key={p.id} product={p}/>)}</div></section>
  <div className="fixed inset-x-0 bottom-[82px] z-40 flex items-center gap-3 border-t border-[#e4d8d0] bg-[#fffdfa]/95 p-4 backdrop-blur lg:hidden"><div className="mr-auto"><small className="text-[#746d67]">Toplam</small><b className="block text-lg text-[#8f2721]">{money(product.basePrice + (size === "Gösterişli" ? 250 : 0))}</b></div><button onClick={order} className="rounded-full bg-[#aa2e28] px-7 py-3 text-sm font-bold text-white">Sepete ekle</button></div></div>;
}
