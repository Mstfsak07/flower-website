import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { env } from "@/lib/env";
import type { AuthSession, AuthUser } from "@/lib/types";

type StoredAccount = {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: "CUSTOMER";
};

const SESSION_COOKIE = "cicekci_session";
const ACCOUNTS_COOKIE = "cicekci_accounts";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const ACCOUNTS_MAX_AGE = 60 * 60 * 24 * 30;

function getSessionSecret() {
  return env.AUTH_SESSION_SECRET || env.ADMIN_SECRET || "cicekci-dev-session-secret";
}

function toBase64Url(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signValue(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function encodeSignedJson(value: unknown) {
  const payload = toBase64Url(JSON.stringify(value));
  return `${payload}.${signValue(payload)}`;
}

function decodeSignedJson<T>(input: string | null | undefined): T | null {
  if (!input) {
    return null;
  }

  const [payload, signature] = input.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = signValue(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(payload)) as T;
  } catch {
    return null;
  }
}

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: env.isProduction,
    priority: "high" as const,
  };
}

function parseCookieHeader(header: string | null) {
  const cookiesMap = new Map<string, string>();

  if (!header) {
    return cookiesMap;
  }

  for (const part of header.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName || rawValue.length === 0) {
      continue;
    }

    cookiesMap.set(rawName, decodeURIComponent(rawValue.join("=")));
  }

  return cookiesMap;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string) {
  return createHmac("sha256", getSessionSecret()).update(password).digest("hex");
}

export function getDemoAdminCredentials() {
  return {
    email: normalizeEmail(env.ADMIN_EMAIL ?? "admin@lunacicek.test"),
    password: env.ADMIN_PASSWORD ?? "Admin123!",
    name: "Luna Admin",
  };
}

export function verifyAdminCredentials(email: string, password: string): AuthUser | null {
  const admin = getDemoAdminCredentials();
  if (normalizeEmail(email) !== admin.email || password !== admin.password) {
    return null;
  }

  return {
    email: admin.email,
    name: admin.name,
    role: "ADMIN",
  };
}

export function createAuthSession(user: AuthUser): AuthSession {
  return {
    user,
    issuedAt: new Date().toISOString(),
  };
}

export function readAuthSessionFromRequest(request: Pick<Request, "headers">): AuthSession | null {
  const cookieHeader = request.headers.get("cookie");
  return decodeSignedJson<AuthSession>(parseCookieHeader(cookieHeader).get(SESSION_COOKIE));
}

export async function readAuthSession() {
  const store = await cookies();
  return decodeSignedJson<AuthSession>(store.get(SESSION_COOKIE)?.value);
}

export async function setAuthSession(session: AuthSession) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSignedJson(session), getCookieOptions(SESSION_MAX_AGE));
}

export async function clearAuthSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { ...getCookieOptions(0), maxAge: 0 });
}

export async function readStoredAccounts() {
  const store = await cookies();
  return decodeSignedJson<StoredAccount[]>(store.get(ACCOUNTS_COOKIE)?.value) ?? [];
}

export async function writeStoredAccounts(accounts: StoredAccount[]) {
  const store = await cookies();
  store.set(ACCOUNTS_COOKIE, encodeSignedJson(accounts), getCookieOptions(ACCOUNTS_MAX_AGE));
}

export async function registerCustomerAccount(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const accounts = await readStoredAccounts();
  const email = normalizeEmail(input.email);

  if (accounts.some((account) => normalizeEmail(account.email) === email)) {
    return { ok: false as const, message: "Bu e-posta ile kayitli bir hesap zaten var." };
  }

  const account: StoredAccount = {
    email,
    name: input.name.trim(),
    passwordHash: hashPassword(input.password),
    phone: input.phone?.trim(),
    role: "CUSTOMER",
  };

  await writeStoredAccounts([...accounts, account]);

  return {
    ok: true as const,
    user: {
      email: account.email,
      name: account.name,
      phone: account.phone,
      role: "CUSTOMER" as const,
    },
  };
}

export async function authenticateCustomerAccount(email: string, password: string) {
  const accounts = await readStoredAccounts();
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = hashPassword(password);

  const account = accounts.find(
    (entry) => normalizeEmail(entry.email) === normalizedEmail && entry.passwordHash === passwordHash,
  );

  if (!account) {
    return null;
  }

  return {
    email: account.email,
    name: account.name,
    phone: account.phone,
    role: account.role,
  } satisfies AuthUser;
}
