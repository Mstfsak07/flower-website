"use client";

import { AdminShell } from "@/components/admin-shell";
import { useStore } from "@/components/providers/store-provider";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminInquiriesPage() {
  const { inquiries } = useStore();

  return (
    <AdminShell
      currentPath="/admin/toptan-talepler"
      description="Kurumsal ve etkinlik taleplerini butce, tarih ve adet bazinda gor."
      title="Toptan Talepler"
    >
      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <div className="panel p-5" key={inquiry.id}>
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="font-serif text-2xl text-[var(--color-ink)]">{inquiry.fullName}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {inquiry.companyName ?? "Bireysel kurumsal talep"} - {formatDate(inquiry.createdAt)}
                </p>
              </div>
              <div className="rounded-full bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)]">
                {inquiry.status}
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              <div>Etkinlik: {inquiry.eventType}</div>
              <div>Adet: {inquiry.quantity}</div>
              <div>Butce: {formatPrice(inquiry.budget)}</div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{inquiry.details}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
