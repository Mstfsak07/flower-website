import { AdminShell } from "@/components/admin-shell";
import { coupons } from "@/lib/data";

export default function AdminCouponsPage() {
  return (
    <AdminShell
      currentPath="/admin/kuponlar"
      description="Yuzde veya sabit tutarli indirim kuponlari."
      title="Kuponlar"
    >
      <div className="grid gap-4">
        {coupons.map((coupon) => (
          <div className="panel flex flex-col justify-between gap-3 p-5 sm:flex-row" key={coupon.id}>
            <div>
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">{coupon.code}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Min. sepet: {coupon.minOrderAmount} TL - Kullanim: {coupon.usedCount}/
                {coupon.usageLimit ?? "sinirsiz"}
              </p>
            </div>
            <div className="rounded-full bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)]">
              {coupon.type} / {coupon.value}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
