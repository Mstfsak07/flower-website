import { NextRequest, NextResponse } from "next/server";

import { readAuthSession } from "@/lib/auth-server";
import { safeJson } from "@/lib/request";
import { addressUpdateSchema } from "@/lib/schemas";
import {
  getAccountAddressByIdRepo,
  updateAccountAddressRepo,
  deleteAccountAddressRepo,
} from "@/lib/repositories/account-repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const { id } = await params;
  const address = await getAccountAddressByIdRepo(session.user.id, id);

  if (!address) {
    return NextResponse.json({ message: "Adres bulunamadi." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: address });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const { id } = await params;
  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = addressUpdateSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await updateAccountAddressRepo(session.user.id, id, parsed.data);
  if (!updated) {
    return NextResponse.json({ message: "Adres bulunamadi." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteAccountAddressRepo(session.user.id, id);

  if (!deleted) {
    return NextResponse.json({ message: "Adres bulunamadi." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
