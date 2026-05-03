import { notFound, redirect } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";
import { getAdminOrderByIdRepo } from "@/lib/repositories/admin-repository";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const adminUser = await readCurrentAdminUser();
  if (!adminUser) {
    redirect("/giris?redirect=/admin/siparisler");
  }

  const { id } = await params;
  const order = await getAdminOrderByIdRepo(id);
  if (!order) {
    notFound();
  }

  const address = JSON.parse(order.addressSnapshotJson) as {
    addressLine?: string;
    city?: string;
    district?: string;
    neighborhood?: string;
  };

  return (
    <AdminShell
      currentPath="/admin/siparisler"
      description="Adres snapshot, odeme, urun detaylari ve operasyon bakisini gosterir."
      initialUser={adminUser}
      title={order.orderNumber}
    >
      <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <div className="floating-surface rounded-[2rem] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] bg-[var(--color-card)]/85 p-5">
              <div className="text-sm text-[var(--color-muted)]">Musteri</div>
              <div className="mt-2 font-semibold text-[var(--color-ink)]">{order.customerName}</div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">{order.customerEmail}</div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">{order.customerPhone}</div>
            </div>
            <div className="rounded-[1.4rem] bg-[var(--color-card)]/85 p-5">
              <div className="text-sm text-[var(--color-muted)]">Toplam</div>
              <div className="mt-2 font-semibold text-[var(--color-ink)]">{formatPrice(order.grandTotal)}</div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">
                {order.paymentMethod} · {order.paymentStatus}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/70 p-4 text-sm">
              <div className="text-[var(--color-muted)]">Siparis Durumu</div>
              <div className="mt-2 font-semibold text-[var(--color-ink)]">{order.status}</div>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/70 p-4 text-sm">
              <div className="text-[var(--color-muted)]">Teslimat Tarihi</div>
              <div className="mt-2 font-semibold text-[var(--color-ink)]">
                {order.deliveryDate} · {order.deliverySlot}
              </div>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--color-line)] bg-white/70 p-4 text-sm">
              <div className="text-[var(--color-muted)]">Olusturulma</div>
              <div className="mt-2 font-semibold text-[var(--color-ink)]">{formatDate(order.createdAt)}</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-[1.35rem] border border-[var(--color-line)] bg-white/70 p-4"
              >
                <div>
                  <div className="font-medium text-[var(--color-ink)]">{item.productName}</div>
                  <div className="mt-1 text-sm text-[var(--color-muted)]">
                    {item.quantity} adet{item.variantName ? ` · ${item.variantName}` : ""}
                  </div>
                  {item.note ? <div className="mt-1 text-sm text-[var(--color-muted)]">Not: {item.note}</div> : null}
                </div>
                <div className="font-semibold text-[var(--color-ink)]">{formatPrice(item.totalPrice)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="floating-surface rounded-[2rem] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Teslimat snapshot
            </div>
            <div className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              <div className="font-medium text-[var(--color-ink)]">{order.recipientName}</div>
              <div>{order.recipientPhone}</div>
              <div className="mt-3">
                {address.addressLine}
                <br />
                {address.neighborhood}, {address.district} / {address.city}
              </div>
            </div>
          </div>

          <div className="floating-surface rounded-[2rem] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Operasyon notlari
            </div>
            <div className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
              <div className="rounded-[1.2rem] bg-white/70 p-4">
                {order.status === "PENDING" && "Odeme teyidi ve atelier planlamasi bekleniyor."}
                {order.status === "PAID" && "Odeme alinmis, urun hazirlama slotuna aktarilmali."}
                {order.status === "PREPARING" && "Atelier hazirlama asamasinda; teslimat cut-off tekrar teyit edilmeli."}
                {order.status === "OUT_FOR_DELIVERY" && "Kurye cikisi yapilmis; alici telefon teyidi kritik."}
                {order.status === "DELIVERED" && "Teslim tamamlandi; memnuniyet geri bildirimi alinabilir."}
                {order.status === "CANCELLED" && "Iptal nedeni ve iade kosulu kayda alinmali."}
                {order.status === "REFUNDED" && "Iade sureci tamamlandi; odeme kaydi kontrol edilmeli."}
              </div>
              <div className="rounded-[1.2rem] bg-white/70 p-4">
                Kupon: {order.couponCode ?? "yok"} · Teslimat ucreti: {formatPrice(order.deliveryFee)}
              </div>
              {order.cardMessage ? (
                <div className="rounded-[1.2rem] bg-white/70 p-4">
                  Kart notu: {order.cardMessage}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
