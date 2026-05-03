import { createHmac, timingSafeEqual } from "node:crypto";
import { Socket } from "node:net";
import { cookies, headers } from "next/headers";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { AuthSession, AuthUser } from "@/lib/types";

type StoredAccount = {
  birthDate?: string;
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  passwordHash?: string;
  role: "CUSTOMER" | "ADMIN";
};

const SESSION_COOKIE = "cicekci_session";
const ACCOUNTS_COOKIE = "cicekci_accounts";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const ACCOUNTS_MAX_AGE = 60 * 60 * 24 * 30;
const DATABASE_PRECHECK_TIMEOUT_MS = 250;
const DATABASE_UNAVAILABLE_COOLDOWN_MS = 15_000;

let databaseUnavailableUntil = 0;

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

async function getCookieOptions(maxAge: number) {
  const headerStore = await headers();
  const host = headerStore.get("host") ?? "";
  const forwardedProto = headerStore.get("x-forwarded-proto");
  const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const secure = !isLocalHost && (forwardedProto === "https" || env.isProduction);

  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure,
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

function isDatabaseUnavailable(error: unknown) {
  return error instanceof Error && /can't reach database server|PrismaClientInitializationError/i.test(error.message);
}

function isDatabaseCooldownActive() {
  return databaseUnavailableUntil > Date.now();
}

function markDatabaseUnavailable() {
  databaseUnavailableUntil = Date.now() + DATABASE_UNAVAILABLE_COOLDOWN_MS;
}

function clearDatabaseUnavailable() {
  databaseUnavailableUntil = 0;
}

function getDatabaseEndpoint() {
  if (!env.DATABASE_URL) {
    return null;
  }

  try {
    const url = new URL(env.DATABASE_URL);
    const isLocalHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    return {
      host: url.hostname,
      isLocalHost,
      port: Number(url.port || "5432"),
    };
  } catch {
    return null;
  }
}

async function canReachLocalDatabaseQuickly() {
  const endpoint = getDatabaseEndpoint();
  if (!endpoint?.isLocalHost) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const socket = new Socket();
    let settled = false;

    const finish = (reachable: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();
      resolve(reachable);
    };

    socket.setTimeout(DATABASE_PRECHECK_TIMEOUT_MS);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(endpoint.port, endpoint.host);
  });
}

async function canUseDatabase() {
  if (env.isDemoMode) {
    return false;
  }

  if (isDatabaseCooldownActive()) {
    return false;
  }

  const reachable = await canReachLocalDatabaseQuickly();
  if (!reachable) {
    markDatabaseUnavailable();
    return false;
  }

  return true;
}

function toAuthUser(input: {
  birthDate?: string | null;
  id?: string;
  name: string;
  email: string;
  emailVerified?: boolean | null;
  emailVerifiedAt?: Date | null;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
}): AuthUser {
  return {
    birthDate: input.birthDate ?? undefined,
    id: input.id,
    email: normalizeEmail(input.email),
    emailVerified: Boolean(input.emailVerified ?? input.emailVerifiedAt),
    name: input.name,
    phone: input.phone ?? undefined,
    role: input.role,
  };
}

export function hashPassword(password: string) {
  return createHmac("sha256", getSessionSecret()).update(password).digest("hex");
}

export function getDemoAdminCredentials() {
  return {
    email: normalizeEmail(env.ADMIN_EMAIL || "admin@irisatalier.test"),
    password: env.ADMIN_PASSWORD || "Admin123!",
    name: "Iris Atalier Admin",
  };
}

export function verifyAdminCredentials(email: string, password: string): AuthUser | null {
  if (env.isProduction && !env.isDemoMode) {
    return null;
  }

  const admin = getDemoAdminCredentials();
  const normalizedEmail = normalizeEmail(email);
  const acceptsConfiguredAdmin = normalizedEmail === admin.email && password === admin.password;
  const acceptsDefaultLocalAdmin =
    !env.isProduction &&
    normalizedEmail === "admin@irisatalier.test" &&
    password === "Admin123!";

  if (!acceptsConfiguredAdmin && !acceptsDefaultLocalAdmin) {
    return null;
  }

  return {
    email: acceptsConfiguredAdmin ? admin.email : "admin@irisatalier.test",
    emailVerified: true,
    id: "demo-admin",
    name: admin.name,
    role: "ADMIN",
  };
}

export function verifyDemoAdminCredentials(email: string, password: string): AuthUser | null {
  if (!env.isDemoMode || env.isProduction) {
    return null;
  }

  const admin = getDemoAdminCredentials();
  if (normalizeEmail(email) !== admin.email || password !== admin.password) {
    return null;
  }

  return {
    email: admin.email,
    emailVerified: true,
    id: "demo-admin",
    name: admin.name,
    role: "ADMIN",
  };
}

export async function authenticateAdminAccount(email: string, password: string) {
  if (!(await canUseDatabase())) {
    return null;
  }

  const normalizedEmail = normalizeEmail(email);
  const passwordHash = hashPassword(password);

  let account:
    | {
        id: string;
        email: string;
        emailVerifiedAt: Date | null;
        birthDate?: string | null;
        name: string;
        phone: string | null;
        role: "CUSTOMER" | "ADMIN";
        passwordHash: string | null;
      }
    | null = null;

  try {
    account = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        role: "ADMIN",
      },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        name: true,
        phone: true,
        role: true,
        passwordHash: true,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return null;
    }

    throw error;
  }

  clearDatabaseUnavailable();

  if (!account?.passwordHash || account.passwordHash !== passwordHash) {
    return null;
  }

  return toAuthUser(account);
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

export async function readCurrentAuthUser() {
  const session = await readAuthSession();
  return session?.user ?? null;
}

async function findPersistedUserById(id: string) {
  if (!(await canUseDatabase())) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    clearDatabaseUnavailable();
    return user;
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return null;
    }

    throw error;
  }
}

async function findPersistedUserByEmail(email: string) {
  if (!(await canUseDatabase())) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    clearDatabaseUnavailable();
    return user;
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return null;
    }

    throw error;
  }
}

export async function refreshSessionUser(user: AuthUser | null) {
  if (!user || env.isDemoMode) {
    return user;
  }

  let persisted = null;

  try {
    persisted =
      (user.id ? await findPersistedUserById(user.id) : null) ??
      (user.email ? await findPersistedUserByEmail(user.email) : null);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return user;
    }

    throw error;
  }

  if (persisted) {
    return toAuthUser(persisted);
  }

  const accounts = await readStoredAccounts();
  const fallbackAccount = accounts.find(
    (account) =>
      (user.id && account.id === user.id) ||
      normalizeEmail(account.email) === normalizeEmail(user.email),
  );

  if (fallbackAccount) {
    return toAuthUser(fallbackAccount);
  }

  const demoAdmin = getDemoAdminCredentials();
  if (user.role === "ADMIN" && normalizeEmail(user.email) === demoAdmin.email) {
    return user;
  }

  return user;
}

export async function setAuthSession(session: AuthSession) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSignedJson(session), await getCookieOptions(SESSION_MAX_AGE));
}

export async function clearAuthSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { ...(await getCookieOptions(0)), maxAge: 0 });
}

export async function readStoredAccounts() {
  const store = await cookies();
  return decodeSignedJson<StoredAccount[]>(store.get(ACCOUNTS_COOKIE)?.value) ?? [];
}

export async function writeStoredAccounts(accounts: StoredAccount[]) {
  const store = await cookies();
  store.set(ACCOUNTS_COOKIE, encodeSignedJson(accounts), await getCookieOptions(ACCOUNTS_MAX_AGE));
}

export async function registerCustomerAccount(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const email = normalizeEmail(input.email);

  if (await canUseDatabase()) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existing) {
        return { ok: false as const, message: "Bu e-posta ile kayitli bir hesap zaten var." };
      }

      const user = await prisma.user.create({
        data: {
          email,
          emailVerifiedAt: null,
          name: input.name.trim(),
          passwordHash: hashPassword(input.password),
          phone: input.phone?.trim(),
          role: "CUSTOMER",
        },
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
          name: true,
          phone: true,
          role: true,
        },
      });

      return {
        ok: true as const,
        user: toAuthUser(user),
      };
    } catch (error) {
      if (!isDatabaseUnavailable(error)) {
        throw error;
      }

      markDatabaseUnavailable();
    }
  }

  const accounts = await readStoredAccounts();

  if (accounts.some((account) => normalizeEmail(account.email) === email)) {
    return { ok: false as const, message: "Bu e-posta ile kayitli bir hesap zaten var." };
  }

  const account: StoredAccount = {
    email,
    emailVerified: false,
    id: crypto.randomUUID(),
    name: input.name.trim(),
    passwordHash: hashPassword(input.password),
    phone: input.phone?.trim(),
    role: "CUSTOMER",
  };

  await writeStoredAccounts([...accounts, account]);

  return {
    ok: true as const,
    user: toAuthUser(account),
  };
}

export async function authenticateCustomerAccount(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = hashPassword(password);

  if (await canUseDatabase()) {
    let account:
      | {
          id: string;
          email: string;
          emailVerifiedAt: Date | null;
          name: string;
          phone: string | null;
          role: "CUSTOMER" | "ADMIN";
          passwordHash: string | null;
        }
      | null = null;

    try {
      account = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
          name: true,
          phone: true,
          role: true,
          passwordHash: true,
        },
      });
    } catch (error) {
      if (isDatabaseUnavailable(error)) {
        markDatabaseUnavailable();
        account = null;
      } else {
        throw error;
      }
    }

    if (account?.passwordHash && account.passwordHash === passwordHash) {
      clearDatabaseUnavailable();
      return toAuthUser(account);
    }
  }

  const accounts = await readStoredAccounts();
  const account = accounts.find(
    (entry) => normalizeEmail(entry.email) === normalizedEmail && entry.passwordHash === passwordHash,
  );

  if (!account) {
    return null;
  }

  if (!account.id) {
    account.id = `demo-${crypto.randomUUID()}`;
    await writeStoredAccounts(accounts);
  }

  return toAuthUser(account);
}

export async function findUserIdByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!(await canUseDatabase())) {
    const accounts = await readStoredAccounts();
    const account = accounts.find((a) => normalizeEmail(a.email) === normalizedEmail);
    return account?.id ?? null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    clearDatabaseUnavailable();
    return user?.id ?? null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      const accounts = await readStoredAccounts();
      const account = accounts.find((a) => normalizeEmail(a.email) === normalizedEmail);
      return account?.id ?? null;
    }

    throw error;
  }
}

type EmailVerificationTokenPayload = {
  email: string;
  exp: number;
  id?: string;
  kind: "email-verification";
};

const EMAIL_VERIFICATION_MAX_AGE_MS = 1000 * 60 * 60 * 24;

export function createEmailVerificationToken(input: { email: string; id?: string }) {
  return encodeSignedJson({
    email: normalizeEmail(input.email),
    exp: Date.now() + EMAIL_VERIFICATION_MAX_AGE_MS,
    id: input.id,
    kind: "email-verification",
  } satisfies EmailVerificationTokenPayload);
}

export function readEmailVerificationToken(token: string | null | undefined) {
  const payload = decodeSignedJson<EmailVerificationTokenPayload>(token);
  if (!payload || payload.kind !== "email-verification" || payload.exp < Date.now()) {
    return null;
  }

  return {
    email: normalizeEmail(payload.email),
    id: payload.id,
  };
}

export async function markEmailAsVerified(input: { email: string; id?: string }) {
  const email = normalizeEmail(input.email);
  let markedInDatabase = false;

  if (await canUseDatabase()) {
    try {
      const result = await prisma.user.updateMany({
        where: {
          email,
          ...(input.id ? { id: input.id } : {}),
        },
        data: {
          emailVerifiedAt: new Date(),
        },
      });

      clearDatabaseUnavailable();
      markedInDatabase = result.count > 0;
    } catch (error) {
      if (isDatabaseUnavailable(error)) {
        markDatabaseUnavailable();
      } else {
        throw error;
      }
    }
  }

  const accounts = await readStoredAccounts();
  let markedInCookies = false;
  const updatedAccounts = accounts.map((account) => {
    const isMatch =
      normalizeEmail(account.email) === email && (!input.id || !account.id || account.id === input.id);

    if (!isMatch) {
      return account;
    }

    markedInCookies = true;
    return {
      ...account,
      emailVerified: true,
    };
  });

  if (markedInCookies) {
    await writeStoredAccounts(updatedAccounts);
  }

  return markedInDatabase || markedInCookies;
}
