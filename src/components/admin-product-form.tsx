"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";

import type { Category } from "@/lib/types";

type AdminProductFormProps = {
  categories: Category[];
};

type CreateProductResponse = {
  ok?: boolean;
  product?: {
    id: string;
  };
  errors?: unknown;
  message?: string;
};

export function AdminProductForm({ categories }: AdminProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    setUploading(true);
    setError(null);

    const response = await fetch("/api/admin/media", {
      body: formData,
      method: "POST",
    }).catch(() => null);

    setUploading(false);

    if (!response?.ok) {
      const body = (await response?.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "Görsel yüklenemedi.");
      event.target.value = "";
      return;
    }

    const body = (await response.json()) as { file?: { url?: string } };
    const uploadedUrl = body.file?.url;
    if (uploadedUrl) {
      setImageUrl(uploadedUrl);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setError(null);
    setSubmitting(true);

    const payload = {
      basePrice: Number(formData.get("basePrice")),
      categoryId: String(formData.get("categoryId") ?? ""),
      compareAtPrice: toOptionalNumber(formData.get("compareAtPrice")),
      costPrice: toOptionalNumber(formData.get("costPrice")),
      description: String(formData.get("description") ?? ""),
      imageUrl: imageUrl.trim() || String(formData.get("imageUrl") ?? "").trim() || undefined,
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      minPreparationHours: Number(formData.get("minPreparationHours") || 2),
      name: String(formData.get("name") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      sku: String(formData.get("sku") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      stockQuantity: Number(formData.get("stockQuantity") || 0),
      stockTracking: formData.get("stockTracking") === "on",
    };

    const response = await fetch("/api/admin/products", {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).catch(() => null);

    setSubmitting(false);

    if (!response?.ok) {
      const body = (await response?.json().catch(() => null)) as CreateProductResponse | null;
      setError(body?.message ?? "Ürün kaydedilemedi. Zorunlu alanları kontrol edin.");
      return;
    }

    const body = (await response.json()) as CreateProductResponse;
    router.push(body.product?.id ? `/admin/urunler/${body.product.id}` : "/admin/urunler");
    router.refresh();
  }

  return (
    <form className="panel grid gap-5 p-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ürün Adı" name="name" required />
        <Field label="Slug" name="slug" placeholder="otomatik bırakılabilir" />
        <Field label="SKU" name="sku" required />
        <label className="grid gap-2 text-sm font-medium">
          Kategori
          <select
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3"
            name="categoryId"
            required
          >
            <option value="">Kategori seç</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 rounded-[1.5rem] border border-[var(--color-line)] bg-white/70 p-4">
        <div>
          <div className="text-sm font-semibold text-[var(--color-ink)]">Ürün Görseli</div>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            Dosya seçersen görsel otomatik yüklenir ve ürün kaydına eklenir. İstersen manuel URL/path de yazabilirsin.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="rounded-2xl border border-[var(--color-line)] px-4 py-3 text-sm"
            name="imageUrl"
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="/uploads/gorsel.jpg veya https://..."
            value={imageUrl}
          />
          <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white">
            {uploading ? "Yükleniyor" : "Dosya Seç"}
            <input
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={handleImageUpload}
              type="file"
            />
          </label>
        </div>
        {imageUrl ? (
          <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-center">
            <div
              className="h-32 rounded-2xl border border-[var(--color-line)] bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className="text-sm leading-7 text-[var(--color-muted)]">
              Kaydedilecek görsel yolu:{" "}
              <span className="font-semibold text-[var(--color-ink)]">{imageUrl}</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Satış Fiyatı" min="1" name="basePrice" required step="1" type="number" />
        <Field label="Karşılaştırma Fiyatı" min="1" name="compareAtPrice" step="1" type="number" />
        <Field label="Maliyet" min="0" name="costPrice" step="1" type="number" />
        <Field label="Stok" min="0" name="stockQuantity" step="1" type="number" />
      </div>

      <Field
        label="Minimum Hazırlama Süresi"
        min="0"
        name="minPreparationHours"
        required
        step="1"
        type="number"
        defaultValue="2"
      />

      <label className="grid gap-2 text-sm font-medium">
        Kısa Açıklama
        <textarea
          className="min-h-24 rounded-2xl border border-[var(--color-line)] px-4 py-3"
          name="shortDescription"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Detay Açıklama
        <textarea
          className="min-h-36 rounded-2xl border border-[var(--color-line)] px-4 py-3"
          name="description"
          required
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <Check label="Aktif yayınla" name="isActive" defaultChecked />
        <Check label="Vitrinde öne çıkar" name="isFeatured" />
        <Check label="Stok takibi aktif" name="stockTracking" defaultChecked />
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <button
        className="rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={submitting}
        type="submit"
      >
        {submitting ? "Kaydediliyor" : "Ürünü Kaydet"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        className="rounded-2xl border border-[var(--color-line)] px-4 py-3"
        name={name}
        {...props}
      />
    </label>
  );
}

function Check({
  label,
  name,
  defaultChecked,
}: {
  defaultChecked?: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-medium">
      <input className="size-4" defaultChecked={defaultChecked} name={name} type="checkbox" />
      {label}
    </label>
  );
}

function toOptionalNumber(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw ? Number(raw) : undefined;
}
