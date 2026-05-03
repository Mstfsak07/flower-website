"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Star, X } from "lucide-react";

type Address = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
  postalCode?: string;
  isDefault: boolean;
};

const EMPTY_FORM = {
  title: "",
  fullName: "",
  phone: "",
  city: "",
  district: "",
  neighborhood: "",
  addressLine: "",
  postalCode: "",
  isDefault: false,
};

export function AddressManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          ...form,
          postalCode: form.postalCode || undefined,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.message ?? "Adres eklenemedi.");
      }

      const newAddress = body.data as Address;

      if (newAddress.isDefault) {
        setAddresses((prev) =>
          [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))],
        );
      } else {
        setAddresses((prev) => [newAddress, ...prev]);
      }

      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message ?? "Adres silinemedi.");
      }

      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: string) {
    setError(null);

    try {
      const response = await fetch(`/api/account/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ isDefault: true }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message ?? "Varsayılan adres değiştirilemedi.");
      }

      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  return (
    <>
      {error && (
        <div className="rounded-[1.6rem] border border-[#f2c8c7] bg-[#fff3f2] px-5 py-4 text-sm text-[#9f4451]">
          {error}
        </div>
      )}

      {showForm && (
        <div className="floating-surface rounded-[2.3rem] p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="editorial-label text-[var(--color-accent)]">New Delivery Point</p>
              <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">Add Address</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                Checkout sırasında otomatik dolacak teslimat bilgilerini burada oluşturabilirsin.
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
              }}
              className="rounded-full border border-[var(--color-line)] bg-white/70 p-2 text-[var(--color-muted)] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-title">
                Adres Başlığı
              </label>
              <input
                id="addr-title"
                type="text"
                placeholder="Ev, İş, vb."
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-fullname">
                Ad Soyad
              </label>
              <input
                id="addr-fullname"
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-phone">
                Telefon
              </label>
              <input
                id="addr-phone"
                type="tel"
                placeholder="05XX XXX XX XX"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-city">
                İl
              </label>
              <input
                id="addr-city"
                type="text"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-district">
                İlçe
              </label>
              <input
                id="addr-district"
                type="text"
                value={form.district}
                onChange={(e) => updateField("district", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-neighborhood">
                Mahalle
              </label>
              <input
                id="addr-neighborhood"
                type="text"
                value={form.neighborhood}
                onChange={(e) => updateField("neighborhood", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-line">
                Adres Satırı
              </label>
              <input
                id="addr-line"
                type="text"
                placeholder="Sokak, bina no, daire no"
                value={form.addressLine}
                onChange={(e) => updateField("addressLine", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--color-muted)]" htmlFor="addr-postal">
                Posta Kodu
              </label>
              <input
                id="addr-postal"
                type="text"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className="mt-1 w-full rounded-[1.15rem] border border-[var(--color-line)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 rounded-[1.15rem] border border-[var(--color-line)] bg-white/60 px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => updateField("isDefault", e.target.checked)}
                  className="rounded border-gray-300 text-[var(--color-ink)] focus:ring-[var(--color-ink)]"
                />
                <span className="text-[var(--color-ink)]">Varsayılan adres olarak ayarla</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={saving}
            className="mt-6 w-full rounded-full bg-[linear-gradient(135deg,var(--color-ink),#5c4047)] px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Adresi Kaydet"}
          </button>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-fit items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--color-ink),#5c4047)] px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </button>
      )}

      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="floating-surface rounded-[2.1rem] p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl text-[var(--color-ink)]">
                        {address.title}
                      </h3>
                      {address.isDefault && (
                          <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent)]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-muted)]">{address.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      title="Varsayılan yap"
                      className="rounded-full border border-[var(--color-line)] bg-white/70 p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    title="Sil"
                    className="rounded-full border border-[var(--color-line)] bg-white/70 p-2 text-[var(--color-muted)] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-[1.4rem] bg-[var(--color-card)]/80 p-4 text-sm text-[var(--color-ink)]">
                <p>{address.addressLine}</p>
                <p className="mt-1 text-[var(--color-muted)]">
                  {address.neighborhood}, {address.district} / {address.city}
                  {address.postalCode ? ` - ${address.postalCode}` : ""}
                </p>
                <p className="mt-1 text-[var(--color-muted)]">{address.phone}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="floating-surface flex flex-col items-center justify-center rounded-[2.2rem] py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              <MapPin className="h-8 w-8" />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-[var(--color-ink)]">
              No Saved Addresses
            </h2>
            <p className="mt-2 text-[var(--color-muted)]">
              Teslimat adreslerinizi buradan ekleyebilirsiniz.
            </p>
          </div>
        )
      )}
    </>
  );
}
