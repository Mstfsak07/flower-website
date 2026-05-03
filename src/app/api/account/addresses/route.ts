import { NextResponse } from "next/server";

import { readAuthSession } from "@/lib/auth-server";
import { safeJson } from "@/lib/request";
import { addressCreateSchema } from "@/lib/schemas";
import {
  getAccountAddressesRepo,
  createAccountAddressRepo,
} from "@/lib/repositories/account-repository";

export async function GET() {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const addresses = await getAccountAddressesRepo(session.user.id);
  return NextResponse.json({ ok: true, data: addresses });
}

export async function POST(request: Request) {
  const session = await readAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Oturum bulunamadi." }, { status: 401 });
  }

  const payload = await safeJson<Record<string, unknown>>(request);
  if (!payload.ok) return payload.response;

  const parsed = addressCreateSchema.safeParse(payload.data);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  let address = null;

  try {
    address = await createAccountAddressRepo(session.user.id, parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_DB_UNAVAILABLE") {
      return NextResponse.json(
        { message: "Adres servisi su anda kullanilamiyor. Lutfen daha sonra tekrar deneyin." },
        { status: 503 },
      );
    }

    throw error;
  }

  return NextResponse.json({ ok: true, data: address }, { status: 201 });
}
