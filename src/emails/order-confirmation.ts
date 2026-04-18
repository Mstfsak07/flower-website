import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function renderOrderConfirmationEmail(order: Order): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 4px;border-bottom:1px solid #f0e8ec;">${item.productName}${item.variantName ? ` — ${item.variantName}` : ""}</td>
        <td style="padding:8px 4px;border-bottom:1px solid #f0e8ec;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 4px;border-bottom:1px solid #f0e8ec;text-align:right;">${formatPrice(item.totalPrice)}</td>
      </tr>`,
    )
    .join("");

  const addressSnapshot = (() => {
    try {
      const a = JSON.parse(order.addressSnapshotJson);
      return `${a.addressLine ?? ""}, ${a.neighborhood ?? ""}, ${a.district ?? ""} / ${a.city ?? ""}`;
    } catch {
      return order.addressSnapshotJson;
    }
  })();

  return `
<div style="font-family:Arial,sans-serif;color:#3c2b30;max-width:600px;margin:0 auto;">
  <div style="background:#7b3f5e;padding:24px 32px;">
    <h1 style="color:#fff;margin:0;font-size:22px;">Siparisiz alindi ✓</h1>
    <p style="color:#f5d9e8;margin:6px 0 0;">Siparis numarasi: <strong>${order.orderNumber}</strong></p>
  </div>

  <div style="padding:24px 32px;background:#fffaf9;">
    <h2 style="font-size:16px;margin:0 0 12px;">Siparis ozeti</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f5eff2;">
          <th style="padding:8px 4px;text-align:left;">Urun</th>
          <th style="padding:8px 4px;text-align:center;">Adet</th>
          <th style="padding:8px 4px;text-align:right;">Tutar</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>

    <table style="width:100%;font-size:14px;margin-top:12px;">
      <tr>
        <td style="padding:4px 0;">Ara toplam</td>
        <td style="text-align:right;">${formatPrice(order.subtotal)}</td>
      </tr>
      ${order.discountTotal > 0 ? `<tr><td style="padding:4px 0;color:#7b3f5e;">İndirim (${order.couponCode ?? ""})</td><td style="text-align:right;color:#7b3f5e;">-${formatPrice(order.discountTotal)}</td></tr>` : ""}
      <tr>
        <td style="padding:4px 0;">Teslimat</td>
        <td style="text-align:right;">${formatPrice(order.deliveryFee)}</td>
      </tr>
      <tr style="font-weight:bold;font-size:16px;">
        <td style="padding:8px 0 0;">Genel toplam</td>
        <td style="text-align:right;padding-top:8px;">${formatPrice(order.grandTotal)}</td>
      </tr>
    </table>
  </div>

  <div style="padding:20px 32px;background:#f9f2f6;font-size:14px;">
    <h3 style="margin:0 0 10px;font-size:15px;">Teslimat bilgileri</h3>
    <p style="margin:4px 0;"><strong>Alici:</strong> ${order.recipientName} — ${order.recipientPhone}</p>
    <p style="margin:4px 0;"><strong>Adres:</strong> ${addressSnapshot}</p>
    <p style="margin:4px 0;"><strong>Tarih / Saat:</strong> ${order.deliveryDate} / ${order.deliverySlot}</p>
    ${order.cardMessage ? `<p style="margin:4px 0;"><strong>Kart mesaji:</strong> ${order.cardMessage}</p>` : ""}
  </div>

  <div style="padding:16px 32px;font-size:12px;color:#888;text-align:center;">
    Siparisinizi takip etmek icin: <strong>${order.orderNumber}</strong> numarasini kullanabilirsiniz.
  </div>
</div>
`.trim();
}
