import { NextResponse } from "next/server";

export async function safeJson<T>(request: Request): Promise<
  | { ok: true; data: T }
  | { ok: false; response: NextResponse }
> {
  try {
    const data = (await request.json()) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ message: "Invalid JSON" }, { status: 400 }),
    };
  }
}

export function apiOk<T>(data: T, init?: { status?: number }) {
  return NextResponse.json(
    {
      ok: true,
      data,
    },
    init,
  );
}

export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      message,
      details,
    },
    { status },
  );
}
