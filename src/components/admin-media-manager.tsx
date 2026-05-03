"use client";

import { useEffect, useState } from "react";

type MediaItem = {
  name: string;
  url: string;
};

export function AdminMediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/media", { credentials: "same-origin" });
      const body = (await response.json()) as MediaItem[] | { message?: string };

      if (!response.ok || !Array.isArray(body)) {
        throw new Error(!Array.isArray(body) ? (body.message ?? "Medya listesi alinamadi.") : "Medya listesi alinamadi.");
      }

      setItems(body);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadItems();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.set("file", file);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/media", {
        body: formData,
        credentials: "same-origin",
        method: "POST",
      });
      const body = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(body.message ?? "Yukleme basarisiz.");
      }

      await loadItems();
      event.target.value = "";
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Bir hata olustu.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="floating-surface rounded-[2rem] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Media pipeline
            </div>
            <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">Medya Kutuphanesi</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              JPG, PNG ve WEBP dosyalarini 4 MB siniri ile lokal upload klasorune alir.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white">
            {uploading ? "Yukleniyor..." : "Gorsel Yukle"}
            <input
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={handleUpload}
              type="file"
            />
          </label>
        </div>
      </div>

      {error ? (
        <div className="rounded-[1.4rem] bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.name} className="floating-surface rounded-[1.8rem] p-4">
            <div
              className="h-56 rounded-[1.4rem] bg-cover bg-center"
              style={{ backgroundImage: `url(${item.url})` }}
            />
            <div className="mt-4 text-sm font-medium text-[var(--color-ink)]">{item.name}</div>
            <div className="mt-2 text-xs text-[var(--color-muted)]">{item.url}</div>
          </div>
        ))}
        {!loading && items.length === 0 ? (
          <div className="floating-surface rounded-[1.8rem] p-6 text-sm text-[var(--color-muted)]">
            Henuz yuklenmis medya yok.
          </div>
        ) : null}
      </div>
    </div>
  );
}
