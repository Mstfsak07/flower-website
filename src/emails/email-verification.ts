export function renderEmailVerificationEmail(input: {
  customerName: string;
  verificationUrl: string;
}) {
  return `
    <div style="background:#131313;padding:32px 16px;font-family:Arial,sans-serif;color:#e5e2e1;">
      <div style="max-width:560px;margin:0 auto;background:#1c1b1b;border:1px solid rgba(212,175,55,0.18);padding:32px;border-radius:14px;">
        <p style="margin:0 0 8px;color:#d4af37;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;">Midnight Bloom</p>
        <h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:30px;line-height:1.2;color:#f2ca50;">E-posta adresini doğrula</h1>
        <p style="margin:0 0 16px;line-height:1.7;color:#d0c5af;">Merhaba ${input.customerName}, hesabını güvenle kullanabilmen için e-posta adresini doğrulaman gerekiyor.</p>
        <p style="margin:0 0 28px;line-height:1.7;color:#d0c5af;">Aşağıdaki butona tıklayarak doğrulama işlemini tamamlayabilirsin. Link 24 saat boyunca geçerlidir.</p>
        <a href="${input.verificationUrl}" style="display:inline-block;background:linear-gradient(135deg,#F2CA50 0%,#D4AF37 100%);color:#3c2f00;text-decoration:none;padding:14px 24px;border-radius:6px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;font-size:12px;">E-postamı Doğrula</a>
        <p style="margin:28px 0 0;line-height:1.7;color:#99907c;font-size:13px;">Buton çalışmazsa bu bağlantıyı tarayıcıya yapıştır:<br /><span style="word-break:break-all;color:#d0c5af;">${input.verificationUrl}</span></p>
      </div>
    </div>
  `;
}
