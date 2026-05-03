import { NextResponse } from "next/server";

import { readAuthSession } from "@/lib/auth-server";
import { createAccountReturnRequestRepo } from "@/lib/repositories/admin-repository";
import { returnRequestCreateSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const session = await readAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Oturum bulunamadı." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = returnRequestCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
  }

  const returnRequest = await createAccountReturnRequestRepo(
    session.user.email,
    session.user.id,
    parsed.data,
  );

  if (!returnRequest) {
    return NextResponse.json(
      { message: "Bu sipariş veya seçilen ürünler için talep oluşturulamadı." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true, request: returnRequest }, { status: 201 });
}
