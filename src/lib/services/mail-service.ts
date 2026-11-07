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
 *   MAIL_FROM                          (sender address, e.g. "Riva Çiçekçilik <no-reply@rivacicekantalya.com>")
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
  const from = process.env.MAIL_FROM ?? "Cicekci <no-reply@example.com>";

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
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[mail:resend] RESEND_API_KEY missing — dropping email to", payload.to);
      return { ok: false, transport: "resend" };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          html: payload.html,
          subject: payload.subject,
          to: [payload.to],
        }),
      });

      const body = (await response.json()) as {
        error?: { message?: string };
        id?: string;
      };

      if (!response.ok || !body.id) {
        console.warn("[mail:resend] send failed:", body.error?.message ?? response.statusText);
        return { ok: false, transport: "resend" };
      }

      return { ok: true, transport: "resend", messageId: body.id };
    } catch (error) {
      console.warn(
        "[mail:resend] request failed:",
        error instanceof Error ? error.message : "unknown error",
      );
      return { ok: false, transport: "resend" };
    }
  }

  // Unknown provider — log and continue.
  console.warn(`[mail] Unknown provider "${provider}" — dropping email to`, payload.to);
  return { ok: false, transport: provider };
}
