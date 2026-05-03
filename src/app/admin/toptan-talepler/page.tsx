import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";
import { getAdminWholesaleInquiriesRepo } from "@/lib/repositories/admin-repository";
import { formatDate, formatPrice } from "@/lib/utils";

const statusLabels = {
  LOST: "Kaybedildi",
  NEW: "Yeni",
  QUOTED: "Teklif Verildi",
  REVIEWING: "Degerlendiriliyor",
  WON: "Kazanildi",
} as const;

export default async function AdminInquiriesPage() {
  const adminUser = await readCurrentAdminUser();
  if (!adminUser) {
    redirect("/giris?redirect=/admin/toptan-talepler");
  }

  const inquiries = await getAdminWholesaleInquiriesRepo();

  return (
    <AdminShell
      currentPath="/admin/toptan-talepler"
      description="Kurumsal ve etkinlik taleplerini butce, tarih, pipeline ve operasyon acisiyla yonet."
      initialUser={adminUser}
      title="Toptan Talepler"
    >
      <div className="grid gap-4 xl:grid-cols-4">
        {[
          ["Toplam Talep", String(inquiries.length)],
          ["Yeni", String(inquiries.filter((item) => item.status === "NEW").length)],
          ["Teklifte", String(inquiries.filter((item) => item.status === "QUOTED").length)],
          ["Kazanilan Hacim", formatPrice(inquiries.filter((item) => item.status === "WON").reduce((sum, item) => sum + item.budget, 0))],
        ].map(([label, value]) => (
          <div key={label} className="floating-surface rounded-[1.8rem] p-5">
            <div className="text-sm text-[var(--color-muted)]">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <div className="floating-surface rounded-[2rem] p-6" key={inquiry.id}>
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  Lead intake
                </div>
                <h2 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">{inquiry.fullName}</h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {inquiry.companyName ?? "Kurumsal / etkinlik talebi"} · {formatDate(inquiry.createdAt)}
                </p>
              </div>
              <div className="rounded-full bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)]">
                {statusLabels[inquiry.status]}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-[1.25rem] bg-white/70 p-4 text-sm">
                <div className="text-[var(--color-muted)]">Etkinlik</div>
                <div className="mt-2 font-semibold text-[var(--color-ink)]">{inquiry.eventType}</div>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4 text-sm">
                <div className="text-[var(--color-muted)]">Tarih</div>
                <div className="mt-2 font-semibold text-[var(--color-ink)]">{inquiry.eventDate}</div>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4 text-sm">
                <div className="text-[var(--color-muted)]">Adet</div>
                <div className="mt-2 font-semibold text-[var(--color-ink)]">{inquiry.quantity}</div>
              </div>
              <div className="rounded-[1.25rem] bg-white/70 p-4 text-sm">
                <div className="text-[var(--color-muted)]">Butce</div>
                <div className="mt-2 font-semibold text-[var(--color-ink)]">{formatPrice(inquiry.budget)}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
              <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/65 p-5 text-sm leading-7 text-[var(--color-muted)]">
                {inquiry.details}
              </div>
              <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/65 p-5 text-sm">
                <div className="text-[var(--color-muted)]">Kontak</div>
                <div className="mt-2 font-medium text-[var(--color-ink)]">{inquiry.email}</div>
                <div className="mt-1 text-[var(--color-muted)]">{inquiry.phone}</div>
                <div className="mt-4 text-[var(--color-muted)]">Bolge</div>
                <div className="mt-2 font-medium text-[var(--color-ink)]">
                  {inquiry.city} / {inquiry.district}
                </div>
                <div className="mt-4 text-[var(--color-muted)]">Operasyon notu</div>
                <div className="mt-2 text-[var(--color-ink)]">
                  {inquiry.status === "NEW"
                    ? "Ilk geri donus ve butce dogrulama bekliyor."
                    : inquiry.status === "REVIEWING"
                      ? "Mekansal kurgu ve urun kompozisyonu netlestiriliyor."
                      : inquiry.status === "QUOTED"
                        ? "Teklif gonderildi, donus bekleniyor."
                        : inquiry.status === "WON"
                          ? "Teklif siparise donusturuldu."
                          : "Lead kapatildi veya baska yone gitti."}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
