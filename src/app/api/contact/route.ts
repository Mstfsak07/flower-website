import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/schemas";
import { sendMail } from "@/lib/services/mail-service";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const { fullName, email, phone, message } = parsed.data;

  sendMail({
    to: process.env.ADMIN_EMAIL ?? "admin@rivacicekantalya.test",
    subject: `Iletisim formu — ${fullName}`,
    html: `<div style="font-family:Arial,sans-serif;color:#3c2b30">
      <h2>Yeni iletisim mesaji</h2>
      <p><strong>Ad:</strong> ${fullName}</p>
      <p><strong>E-posta:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${message}</p>
    </div>`,
  }).catch(() => {});

  return NextResponse.json(
    { ok: true, message: "Mesaj alindi." },
    { status: 201 },
  );
}
