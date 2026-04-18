import type { WholesaleInquiry } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function renderWholesaleInquiryEmail(inquiry: WholesaleInquiry): string {
  return `
<div style="font-family:Arial,sans-serif;color:#3c2b30;max-width:600px;margin:0 auto;">
  <div style="background:#7b3f5e;padding:24px 32px;">
    <h1 style="color:#fff;margin:0;font-size:22px;">Yeni toptan talep</h1>
    <p style="color:#f5d9e8;margin:6px 0 0;">${inquiry.fullName}${inquiry.companyName ? ` — ${inquiry.companyName}` : ""}</p>
  </div>

  <div style="padding:24px 32px;background:#fffaf9;font-size:14px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:6px 0;width:160px;color:#888;">Ad Soyad</td><td style="padding:6px 0;font-weight:bold;">${inquiry.fullName}</td></tr>
      ${inquiry.companyName ? `<tr><td style="padding:6px 0;color:#888;">Firma</td><td style="padding:6px 0;">${inquiry.companyName}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#888;">Telefon</td><td style="padding:6px 0;">${inquiry.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">E-posta</td><td style="padding:6px 0;">${inquiry.email}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Etkinlik turu</td><td style="padding:6px 0;">${inquiry.eventType}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Etkinlik tarihi</td><td style="padding:6px 0;">${inquiry.eventDate}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Adet</td><td style="padding:6px 0;">${inquiry.quantity}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Butce</td><td style="padding:6px 0;">${formatPrice(inquiry.budget)}</td></tr>
      <tr><td style="padding:6px 0;color:#888;">Sehir / Ilce</td><td style="padding:6px 0;">${inquiry.city} / ${inquiry.district}</td></tr>
    </table>

    <div style="margin-top:16px;padding:12px 16px;background:#f5eff2;border-radius:6px;">
      <p style="margin:0 0 6px;color:#888;font-size:13px;">Detaylar</p>
      <p style="margin:0;">${inquiry.details}</p>
    </div>
  </div>
</div>
`.trim();
}
