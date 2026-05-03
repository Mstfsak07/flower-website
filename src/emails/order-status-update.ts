import type { Order } from "@/lib/types";

const statusCopy: Record<Order["status"], string> = {
  CANCELLED: "Siparisin iptal edildi. Istersen yeni bir teslimat tarihi ile tekrar yardimci olabiliriz.",
  DELIVERED: "Siparisin teslim edildi. Alici deneyimini duymaktan memnun oluruz.",
  OUT_FOR_DELIVERY: "Kurye su anda dagitimda. Alici ile teslimat oncesi son koordinasyon yapilabilir.",
  PAID: "Odemesi onaylandi ve operasyon akisi baslatildi.",
  PENDING: "Siparis alindi ve ekip tarafinda kontrol sirasina girdi.",
  PREPARING: "Atolye siparisi hazirliyor. Cicek secimi ve paketleme asamasi aktif.",
  REFUNDED: "Odeme iadesi baslatildi. Banka yansimasi saglayiciya gore degisebilir.",
};

export function renderOrderStatusUpdateEmail(order: Order): string {
  return `
<div style="font-family:Arial,sans-serif;color:#3c2b30;max-width:600px;margin:0 auto;">
  <div style="background:#7b3f5e;padding:24px 32px;">
    <h1 style="color:#fff;margin:0;font-size:22px;">Siparis durumun guncellendi</h1>
    <p style="color:#f5d9e8;margin:6px 0 0;">${order.orderNumber} - ${order.status}</p>
  </div>

  <div style="padding:24px 32px;background:#fffaf9;font-size:14px;">
    <p style="margin:0 0 14px;">Merhaba ${order.customerName},</p>
    <p style="margin:0 0 16px;line-height:1.7;">
      ${statusCopy[order.status]}
    </p>

    <div style="padding:14px 16px;background:#f5eff2;border-radius:12px;">
      <p style="margin:0 0 6px;"><strong>Durum:</strong> ${order.status}</p>
      <p style="margin:0 0 6px;"><strong>Odeme:</strong> ${order.paymentStatus}</p>
      <p style="margin:0 0 6px;"><strong>Teslimat:</strong> ${order.deliveryDate} / ${order.deliverySlot}</p>
      <p style="margin:0;"><strong>Alici:</strong> ${order.recipientName}</p>
    </div>
  </div>
</div>
`.trim();
}
