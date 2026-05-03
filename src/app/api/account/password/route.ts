import { NextResponse } from "next/server";

import { readAuthSession } from "@/lib/auth-server";
import { safeJson } from "@/lib/request";
import { updateAccountPasswordRepo } from "@/lib/repositories/account-repository";
import { passwordUpdateSchema } from "@/lib/schemas";

export async function PATCH(request: Request) {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = passwordUpdateSchema.safeParse(payload.data);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Gecersiz sifre bilgisi.";
    return NextResponse.json({ message: firstIssue, errors: parsed.error.flatten() }, { status: 400 });
  }

  const result = await updateAccountPasswordRepo(session.user.id, {
    currentPassword: parsed.data.currentPassword,
    nextPassword: parsed.data.nextPassword,
  });

  if (result === "UPDATED") {
    return NextResponse.json({ ok: true });
  }

  if (result === "INVALID_CURRENT_PASSWORD") {
    return NextResponse.json({ message: "Mevcut sifre hatali." }, { status: 400 });
  }

  if (result === "PASSWORD_NOT_AVAILABLE") {
    return NextResponse.json(
      { message: "Bu hesap icin sifre degistirme su anda kullanilamiyor." },
      { status: 400 },
    );
  }

  if (result === "ACCOUNT_NOT_FOUND") {
    return NextResponse.json({ message: "Hesap bulunamadi." }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Sifre servisi su anda kullanilamiyor. Lutfen daha sonra tekrar deneyin." },
    { status: 503 },
  );
}
