import { AdminCouponForm } from "@/components/admin-coupon-form";
import { AdminShell } from "@/components/admin-shell";
import { getAdminCouponsRepo } from "@/lib/repositories/admin-repository";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCouponsRepo();

  return (
    <AdminShell
      currentPath="/admin/kuponlar"
      description="İndirim kuponu ekleyin ve mevcut kuponları takip edin."
      title="Kuponlar"
    >
      <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
        <AdminCouponForm />

        <div className="grid gap-4">
          {coupons.map((coupon) => (
            <div className="panel flex flex-col justify-between gap-3 p-5 sm:flex-row" key={coupon.id}>
              <div>
                <h2 className="font-serif text-2xl text-[var(--color-ink)]">{coupon.code}</h2>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Min. sepet: {formatPrice(coupon.minOrderAmount)} - Kullanım: {coupon.usedCount}/
                  {coupon.usageLimit ?? "sınırsız"}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {formatDate(coupon.startsAt)} - {formatDate(coupon.endsAt)}
                </p>
              </div>
              <div className="h-fit rounded-full bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)]">
                {coupon.type === "PERCENT" ? `%${coupon.value}` : formatPrice(coupon.value)}
              </div>
            </div>
          ))}
          {coupons.length === 0 ? (
            <div className="panel p-6 text-sm text-[var(--color-muted)]">Henüz kupon yok.</div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
