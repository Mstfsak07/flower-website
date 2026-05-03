import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";
import { getAdminReturnRequestsRepo } from "@/lib/repositories/admin-repository";
import type { ReturnRequest } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function AdminReturnRequestsPage() {
  const adminUser = await readCurrentAdminUser();
  const requests = await getAdminReturnRequestsRepo();

  return (
    <AdminShell
      currentPath="/admin/iade-talepleri"
      description="İptal veya iade durumuna alınmış siparişleri takip edin. Henüz talep yoksa liste boş görünür."
      initialUser={adminUser}
      title="İade Talepleri"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <div className="text-sm text-[var(--color-muted)]">Toplam talep</div>
          <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{requests.length}</div>
        </div>
        <div className="panel p-5">
          <div className="text-sm text-[var(--color-muted)]">İptal</div>
          <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
            {requests.filter((request) => request.type === "CANCEL").length}
          </div>
        </div>
        <div className="panel p-5">
          <div className="text-sm text-[var(--color-muted)]">İade</div>
          <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
            {requests.filter((request) => request.type === "REFUND").length}
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[var(--color-muted)]">
              <tr>
                <th className="pb-3">Talep</th>
                <th className="pb-3">Sipariş No</th>
                <th className="pb-3">Tür</th>
                <th className="pb-3">Müşteri</th>
                <th className="pb-3">Ürünler</th>
                <th className="pb-3">Durum</th>
                <th className="pb-3">Tutar</th>
                <th className="pb-3">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr className="border-t border-[var(--color-line)]" key={request.id}>
                  <td className="py-4 font-medium text-[var(--color-ink)]">{request.requestNumber}</td>
                  <td className="py-4">
                    <Link className="font-medium text-[var(--color-accent)]" href={`/admin/siparisler/${request.orderId}`}>
                      {request.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4">{request.type === "REFUND" ? "İade" : "İptal"}</td>
                  <td className="py-4">
                    <div>{request.customerName}</div>
                    <div className="text-xs text-[var(--color-muted)]">{request.customerEmail}</div>
                  </td>
                  <td className="py-4">{summarizeRequestItems(request)}</td>
                  <td className="py-4">{getRequestStatusLabel(request.status)}</td>
                  <td className="py-4">{formatPrice(getRequestTotal(request))}</td>
                  <td className="py-4">{formatDate(request.createdAt)}</td>
                </tr>
              ))}
              {requests.length === 0 ? (
                <tr>
                  <td className="py-8 text-[var(--color-muted)]" colSpan={8}>
                    Şu anda iade veya iptal talebi yok.
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

function getRequestTotal(request: ReturnRequest) {
  return request.items.reduce((total, item) => total + item.totalPrice, 0);
}

function summarizeRequestItems(request: ReturnRequest) {
  const firstItem = request.items[0];
  if (!firstItem) {
    return "Ürün seçilmedi";
  }

  return request.items.length === 1
    ? firstItem.productName
    : `${firstItem.productName} + ${request.items.length - 1} ürün`;
}

function getRequestStatusLabel(status: ReturnRequest["status"]) {
  const labels: Record<ReturnRequest["status"], string> = {
    APPROVED: "Onaylandı",
    COMPLETED: "Tamamlandı",
    NEW: "Yeni",
    REJECTED: "Reddedildi",
    REVIEWING: "İnceleniyor",
  };

  return labels[status] ?? status;
}
