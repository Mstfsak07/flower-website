"use client";

import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { useStore } from "@/components/providers/store-provider";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { orders } = useStore();

  return (
    <AdminShell
      currentPath="/admin/siparisler"
      description="Yeni, hazirlaniyor ve teslimat surecindeki siparisleri tek ekranda gor."
      title="Siparisler"
    >
      <div className="panel p-6">
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
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
