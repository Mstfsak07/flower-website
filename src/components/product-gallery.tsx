"use client";

import { useMemo, useState } from "react";

type ProductImage = {
  id: string;
  altText?: string | null;
  imageUrl: string;
};

type ProductGalleryProps = {
  name: string;
  categoryName?: string;
  images: ProductImage[];
  badges?: string[];
  description: string;
  preparationHours: number;
  variantCount: number;
  deliveryZoneCount: number;
};

export function ProductGallery({
  name,
  categoryName,
  images,
  badges,
  description,
  preparationHours,
  variantCount,
  deliveryZoneCount,
}: ProductGalleryProps) {
  const [activeImageId, setActiveImageId] = useState(images[0]?.id);

  const activeImage = useMemo(
    () => images.find((image) => image.id === activeImageId) ?? images[0],
    [activeImageId, images],
  );

  const galleryStats = [
    { value: `${preparationHours} saat`, label: "Minimum hazirlama suresi" },
    { value: `${variantCount} boyut`, label: "Secilebilir varyant" },
    { value: `${deliveryZoneCount} bolge`, label: "Aktif teslimat kapsami" },
  ];

  const trustItems = [
    "Canli gorunume yakin floral sunum hedefi",
    "Atolye cikisli ayni gun hazirlama disiplini",
    "Kart notu ve zaman penceresiyle teslimat plani",
  ];

  if (!activeImage) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-white/80 shadow-xl shadow-[var(--color-ink)]/5">
        <div className="relative h-[28rem] bg-[rgba(255,255,255,0.48)] sm:h-[34rem] lg:h-[40rem]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${activeImage.imageUrl})` }}
            aria-label={activeImage.altText ?? name}
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(255,255,255,0.72)] via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(18,20,28,0.5)] via-[rgba(18,20,28,0.12)] to-transparent p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {(badges ?? []).slice(0, 3).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/30 bg-white/18 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur"
                >
                  {badge}
                </span>
              ))}
              {categoryName ? (
                <span className="rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
                  {categoryName}
                </span>
              ) : null}
            </div>
            <div className="mt-4 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Floral atelier secimi</p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-white sm:text-[2.2rem]">{name}</h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/80 sm:text-[15px]">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid gap-3 sm:grid-cols-4">
          {images.map((image, index) => {
            const isActive = image.id === activeImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageId(image.id)}
                className={[
                  "relative overflow-hidden rounded-[1.6rem] border text-left transition duration-300",
                  "h-24 sm:h-28",
                  isActive
                    ? "border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/15"
                    : "border-white/70 hover:border-[var(--color-accent)]/50",
                ].join(" ")}
                aria-pressed={isActive}
                aria-label={`${name} gorsel ${index + 1}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${image.imageUrl})` }}
                />
                <div
                  className={[
                    "absolute inset-0 transition",
                    isActive ? "bg-[rgba(18,20,28,0.12)]" : "bg-[rgba(18,20,28,0.28)] hover:bg-[rgba(18,20,28,0.16)]",
                  ].join(" ")}
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]">
                  {index + 1}
                </div>
              </button>
            );
          })}
        </div>

        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-accent)]">Guvenli secim</p>
          <div className="mt-4 grid gap-3">
            {galleryStats.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] bg-white/75 p-4">
                <div className="text-2xl font-semibold text-[var(--color-ink)]">{item.value}</div>
                <div className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 rounded-[1.5rem] border border-white/70 bg-[rgba(255,255,255,0.6)] p-4">
            {trustItems.map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-6 text-[var(--color-muted)]">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
