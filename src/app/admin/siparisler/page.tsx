import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";
import { getAdminOrdersRepo } from "@/lib/repositories/admin-repository";
import { formatDate, formatPrice } from "@/lib/utils";

type AdminOrdersPageProps = {
  searchParams?: Promise<{
    payment?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const adminUser = await readCurrentAdminUser();
  const filters = (await searchParams) ?? {};

  const q = filters.q?.trim().toLowerCase() ?? "";
  const status = filters.status?.trim().toUpperCase() ?? "";
  const payment = filters.payment?.trim().toUpperCase() ?? "";

  const allOrders = await getAdminOrdersRepo();
  const orders = allOrders.filter((order) => {
    const matchesQuery =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q);
    const matchesStatus = !status || order.status === status;
    const matchesPayment = !payment || order.paymentStatus === payment;

    return matchesQuery && matchesStatus && matchesPayment;
  });
  const statusCounts = {
    active: allOrders.filter((order) =>
      ["PENDING", "PAID", "PREPARING", "OUT_FOR_DELIVERY"].includes(order.status),
    ).length,
    delivered: allOrders.filter((order) => order.status === "DELIVERED").length,
    issue: allOrders.filter((order) => ["CANCELLED", "REFUNDED"].includes(order.status)).length,
  };

  return (
    <AdminShell
      currentPath="/admin/siparisler"
      description="Yeni, hazirlaniyor ve teslimat surecindeki siparisleri tek ekranda gor."
      initialUser={adminUser}
      title="Siparisler"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Aktif operasyon
          </div>
          <div className="mt-3 font-serif text-3xl text-[var(--color-ink)]">{statusCounts.active}</div>
          <div className="mt-2 text-sm text-[var(--color-muted)]">Hazirlanan ve dagitimda olan siparisler.</div>
        </div>
        <div className="panel p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Tamamlanan
          </div>
          <div className="mt-3 font-serif text-3xl text-[var(--color-ink)]">{statusCounts.delivered}</div>
          <div className="mt-2 text-sm text-[var(--color-muted)]">Teslim edilmis siparisler.</div>
        </div>
        <div className="panel p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Riskli akış
          </div>
          <div className="mt-3 font-serif text-3xl text-[var(--color-ink)]">{statusCounts.issue}</div>
          <div className="mt-2 text-sm text-[var(--color-muted)]">Iptal veya iade durumundaki siparisler.</div>
        </div>
      </div>

      <div className="panel p-6">
        <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem_auto]">
          <input
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none"
            defaultValue={filters.q ?? ""}
            name="q"
            placeholder="Siparis no, musteri veya e-posta"
          />
          <select
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none"
            defaultValue={filters.status ?? ""}
            name="status"
          >
            <option value="">Tum durumlar</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="PREPARING">PREPARING</option>
            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
          <select
            className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none"
            defaultValue={filters.payment ?? ""}
            name="payment"
          >
            <option value="">Tum odeme durumlari</option>
            <option value="UNPAID">UNPAID</option>
            <option value="PAID">PAID</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
          <button
            className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-white"
            type="submit"
          >
            Filtrele
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[var(--color-muted)]">
              <tr>
                <th className="pb-3">No</th>
                <th className="pb-3">Musteri</th>
                <th className="pb-3">Durum</th>
                <th className="pb-3">Toplam</th>
                <th className="pb-3">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr className="border-t border-[var(--color-line)]" key={order.id}>
                  <td className="py-4">
                    <Link className="font-medium text-[var(--color-accent)]" href={`/admin/siparisler/${order.id}`}>
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4">{order.customerName}</td>
                  <td className="py-4">{order.status}</td>
                  <td className="py-4">{formatPrice(order.grandTotal)}</td>
                  <td className="py-4">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td className="py-8 text-[var(--color-muted)]" colSpan={5}>
                    Bu filtrelerle eslesen siparis bulunamadi.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
