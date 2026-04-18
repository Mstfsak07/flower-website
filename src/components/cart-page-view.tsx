"use client";

import Link from "next/link";
import { Gift, MapPin, ShieldCheck, Sparkles, TicketPercent, Truck } from "lucide-react";

import { useStore } from "@/components/providers/store-provider";
import { coupons, getCategoryById, getProductById } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export function CartPageView() {
  const { cart, hydrated, removeFromCart, updateQuantity } = useStore();
  const items = cart.map((item) => ({ item, product: getProductById(item.productId) })).filter(Boolean);
  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 1750 ? 0 : 90;
  const complimentaryNote = cart.some((item) => item.note?.trim());
  const suggestedCoupon = coupons.find((coupon) => subtotal >= coupon.minOrderAmount) ?? coupons[0];
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (!hydrated) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="panel p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Sepet yukleniyor
          </p>
          <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">Sepet durumu hazirlaniyor.</h1>
        </div>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="panel p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Sepet Bos
          </p>
          <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">Henuz urun eklenmedi.</h1>
          <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
            Katalogdan urun secip sepete ekledikten sonra checkout ekranina gecebilirsin.
          </p>
          <Link
            className="mt-6 inline-flex rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
            href="/kategori/mini-buketler"
          >
            Kataloga Don
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_24rem] lg:px-8">
      <div className="space-y-4">
        <div className="panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">Sepet</p>
            <h1 className="mt-3 font-serif text-4xl text-[var(--color-ink)]">Secimini son kez gozden gecir.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Buket detaylari, kart notu ve teslimat planin bu adimda netlesir. Ortalama hazirlama suremiz ayni gun
              siparislerde 2 saattir.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/70 bg-white/70 px-5 py-4 text-sm text-[var(--color-muted)] shadow-sm">
            <div className="font-semibold text-[var(--color-ink)]">{totalQuantity} urun sepetinde hazir</div>
            <div className="mt-1">Teslimat uygunlugu checkout adiminda teyit edilir.</div>
          </div>
        </div>
        {items.map(({ item, product }) =>
          product ? (
            <div key={item.id} className="panel flex flex-col gap-5 p-5 sm:flex-row">
              <div
                className="h-44 rounded-[1.5rem] bg-cover bg-center sm:w-52"
                style={{ backgroundImage: `url(${product.images[0]?.imageUrl})` }}
              />
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="font-serif text-3xl text-[var(--color-ink)]">{product.name}</h2>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{product.shortDescription}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-[var(--color-muted)]">
                  <span className="rounded-full bg-[var(--color-card)] px-3 py-1.5">
                    Kategori: {getCategoryById(product.categoryId)?.name ?? "Koleksiyon"}
                  </span>
                  <span className="rounded-full bg-[var(--color-card)] px-3 py-1.5">
                    Hazirlama: {product.minPreparationHours} saat
                  </span>
                  {item.note?.trim() ? (
                    <span className="rounded-full bg-[var(--color-card)] px-3 py-1.5">Kart notu eklendi</span>
                  ) : (
                    <span className="rounded-full bg-[var(--color-card)] px-3 py-1.5">Kart notu eklenebilir</span>
                  )}
                </div>
                {item.note?.trim() ? (
                  <div className="rounded-[1.25rem] bg-[var(--color-card)]/80 px-4 py-3 text-sm text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-ink)]">Kart notu:</span> {item.note}
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-[var(--color-line)] bg-white">
                    <button
                      className="px-4 py-2 text-lg"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="min-w-12 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      className="px-4 py-2 text-lg"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink)]"
                    onClick={() => removeFromCart(item.id)}
                    type="button"
                  >
                    Kaldir
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Ara toplam</div>
                <div className="text-xl font-semibold text-[var(--color-ink)]">
                  {formatPrice(item.unitPrice * item.quantity)}
                </div>
                <div className="text-sm text-[var(--color-muted)]">{formatPrice(item.unitPrice)} / adet</div>
              </div>
            </div>
          ) : null,
        )}
      </div>
      <aside className="panel h-fit space-y-5 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            Siparis Ozeti
          </p>
          <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">Sepetin Hazir</h2>
        </div>
        <div className="space-y-3 rounded-[1.5rem] bg-[var(--color-card)] p-5 text-sm">
          <div className="flex justify-between">
            <span>Ara Toplam</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Teslimat</span>
            <span>{deliveryFee === 0 ? "Ucretsiz" : formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-[var(--color-ink)]">
            <span>Toplam</span>
            <span>{formatPrice(subtotal + deliveryFee)}</span>
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-dashed border-[var(--color-line)] bg-white/70 p-5 text-sm text-[var(--color-muted)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--color-ink)]">
            <TicketPercent className="size-4 text-[var(--color-accent)]" />
            Kupon onerisi
          </div>
          <p className="mt-2 leading-6">
            Uygun siparislerde <span className="font-semibold text-[var(--color-ink)]">{suggestedCoupon.code}</span>{" "}
            kodu aktif. Kupon checkout ekraninda uygulanir.
          </p>
        </div>
        <div className="grid gap-3 text-sm">
          <div className="flex gap-3 rounded-[1.35rem] bg-white/70 p-4 text-[var(--color-muted)]">
            <Truck className="mt-0.5 size-4 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Ayni gun dagitim</div>
              <div className="mt-1 leading-6">16:00 oncesi siparislerde uygun bolgelere hizli teslimat sunulur.</div>
            </div>
          </div>
          <div className="flex gap-3 rounded-[1.35rem] bg-white/70 p-4 text-[var(--color-muted)]">
            <Gift className="mt-0.5 size-4 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Kart ve sunum kontrolu</div>
              <div className="mt-1 leading-6">
                {complimentaryNote
                  ? "Ekledigin kart notu baski oncesi kontrol edilecek."
                  : "Tum siparislerde zarif paketleme ve kart alani hazirdir."}
              </div>
            </div>
          </div>
          <div className="flex gap-3 rounded-[1.35rem] bg-white/70 p-4 text-[var(--color-muted)]">
            <MapPin className="mt-0.5 size-4 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-ink)]">Bolge teyidi</div>
              <div className="mt-1 leading-6">Caddebostan merkezli cicek gonderimleri checkout adiminda netlesir.</div>
            </div>
          </div>
        </div>
        <Link
          className="block rounded-full bg-[var(--color-ink)] px-5 py-3 text-center text-sm font-semibold text-white"
          href="/odeme"
        >
          Odeme Adimina Gec
        </Link>
        <div className="rounded-[1.5rem] bg-[var(--color-ink)] px-5 py-4 text-sm text-white">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-4" />
            Guvenli siparis akisi
          </div>
          <p className="mt-2 leading-6 text-white/75">
            Teslimat notlari, alici bilgileri ve odeme tercihi bir sonraki adimda birlikte tamamlanir.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
          href="/kategori/mini-buketler"
        >
          <Sparkles className="size-4" />
          Alisverise devam et
        </Link>
      </aside>
    </section>
  );
}
