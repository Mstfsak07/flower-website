import { NextResponse } from "next/server";

import { readAuthSession, setAuthSession, createAuthSession } from "@/lib/auth-server";
import { safeJson } from "@/lib/request";
import { profileUpdateSchema } from "@/lib/schemas";
import { getAccountProfileRepo, updateAccountProfileRepo } from "@/lib/repositories/account-repository";
import type { AuthUser } from "@/lib/types";

export async function GET() {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const profile = await getAccountProfileRepo(session.user.id);
  if (!profile) {
    return NextResponse.json({ ok: true, data: session.user });
  }

  return NextResponse.json({ ok: true, data: profile });
}

export async function PATCH(request: Request) {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = profileUpdateSchema.safeParse(payload.data);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Gecersiz profil bilgisi.";
    return NextResponse.json({ message: firstIssue, errors: parsed.error.flatten() }, { status: 400 });
  }

  const phone = parsed.data.phone || undefined;
  const updated = await updateAccountProfileRepo(session.user.id, {
    birthDate: parsed.data.birthDate || undefined,
    currentPassword: parsed.data.currentPassword || undefined,
    email: parsed.data.email,
    name: parsed.data.name,
    phone,
  });

  if (!updated.ok) {
    if (updated.reason === "PASSWORD_REQUIRED") {
      return NextResponse.json(
        { message: "E-posta degisikligi icin mevcut sifrenizi girmeniz gerekiyor." },
        { status: 400 },
      );
    }

    if (updated.reason === "INVALID_CURRENT_PASSWORD") {
      return NextResponse.json({ message: "Mevcut sifre hatali." }, { status: 400 });
    }

    if (updated.reason === "PASSWORD_NOT_AVAILABLE") {
      return NextResponse.json(
        { message: "Bu hesap icin e-posta degisikligi su anda kullanilamiyor." },
        { status: 400 },
      );
    }

    if (updated.reason === "EMAIL_IN_USE") {
      return NextResponse.json(
        { message: "Bu e-posta baska bir hesap tarafindan kullaniliyor." },
        { status: 400 },
      );
    }

    if (updated.reason === "ACCOUNT_NOT_FOUND") {
      return NextResponse.json({ message: "Hesap bulunamadi." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profil servisi su anda kullanilamiyor. Lutfen daha sonra tekrar deneyin." },
      { status: 503 },
    );
  }

  const freshUser: AuthUser = {
    birthDate: updated.profile.birthDate,
    id: session.user.id,
    email: updated.profile.email,
    emailVerified: session.user.emailVerified,
    name: updated.profile.name,
    phone: updated.profile.phone,
    role: session.user.role,
  };

  await setAuthSession(createAuthSession(freshUser));

  return NextResponse.json({ ok: true, data: updated.profile });
}
