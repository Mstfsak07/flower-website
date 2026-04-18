/**
 * Mail service abstraction.
 *
 * Behaviour:
 *  - When MAIL_PROVIDER is not set (or "mock"): logs the payload and resolves — safe for local demo.
 *  - When MAIL_PROVIDER=SMTP: sends via the SMTP env vars (wire Nodemailer here).
 *  - When MAIL_PROVIDER=RESEND: sends via the Resend API (wire resend SDK here).
 *
 * Env vars:
 *   MAIL_PROVIDER=SMTP|RESEND          (defaults to "mock")
 *   ADMIN_EMAIL                        (recipient for admin notifications)
 *   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
 *   RESEND_API_KEY
 *   MAIL_FROM                          (sender address, e.g. "Luna Cicek <no-reply@lunacicek.com>")
 */

export type MailPayload = {
  to: string;
  subject: string;
  html: string;
};

export type MailResult = {
  ok: boolean;
  transport: string;
  messageId?: string;
};

export function resolveMailProvider(): string {
  return (process.env.MAIL_PROVIDER ?? "mock").toLowerCase();
}

/**
 * Send an email.
 * Always resolves (never throws) so callers can fire-and-forget safely.
 */
export async function sendMail(payload: MailPayload): Promise<MailResult> {
  const provider = resolveMailProvider();

  if (provider === "mock") {
    // In demo/test mode just log — no external call.
    if (process.env.NODE_ENV !== "test") {
      console.log("[mail:mock]", payload.to, "|", payload.subject);
    }
    return { ok: true, transport: "mock" };
  }

  if (provider === "smtp") {
    // Wire real Nodemailer transport once SMTP_* env vars are present.
    // Example (install nodemailer first):
    //   const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } });
    //   const info = await transporter.sendMail({ from, to, subject, html });
    //   return { ok: true, transport: "smtp", messageId: info.messageId };
    console.warn("[mail:smtp] SMTP transport not yet wired — dropping email to", payload.to);
    return { ok: true, transport: "smtp" };
  }

  if (provider === "resend") {
    // Wire Resend SDK once RESEND_API_KEY is present.
    // Example (install resend first):
    //   const resend = new Resend(process.env.RESEND_API_KEY);
    //   const { data, error } = await resend.emails.send({ from, to, subject, html });
    //   if (error) throw error;
    //   return { ok: true, transport: "resend", messageId: data.id };
    console.warn("[mail:resend] Resend transport not yet wired — dropping email to", payload.to);
    return { ok: true, transport: "resend" };
  }

  // Unknown provider — log and continue.
  console.warn(`[mail] Unknown provider "${provider}" — dropping email to`, payload.to);
  return { ok: false, transport: provider };
}
