import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { seedOrders } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = seedOrders.find((entry) => entry.id === id);
  if (!order) {
    notFound();
  }

  return (
    <AdminShell
      currentPath="/admin/siparisler"
      description="Adres snapshot, odeme ve urun detaylarini gosterir."
      title={order.orderNumber}
    >
      <div className="panel p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
            <div className="text-sm text-[var(--color-muted)]">Musteri</div>
            <div className="mt-2 font-semibold">{order.customerName}</div>
          </div>
          <div className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
            <div className="text-sm text-[var(--color-muted)]">Toplam</div>
            <div className="mt-2 font-semibold">{formatPrice(order.grandTotal)}</div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between rounded-[1.5rem] border border-[var(--color-line)] p-4">
              <span>{item.productName}</span>
              <span>{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
