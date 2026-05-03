import { env } from "@/lib/env";
import { hashPassword, readAuthSession, readStoredAccounts, writeStoredAccounts } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Socket } from "node:net";

const DATABASE_PRECHECK_TIMEOUT_MS = 250;
const DATABASE_UNAVAILABLE_COOLDOWN_MS = 15_000;

let databaseUnavailableUntil = 0;

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

export type AccountProfile = {
  id: string;
  birthDate?: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export type AccountAddress = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
  postalCode?: string;
  isDefault: boolean;
};

export type PasswordUpdateResult =
  | "UPDATED"
  | "INVALID_CURRENT_PASSWORD"
  | "PASSWORD_NOT_AVAILABLE"
  | "ACCOUNT_NOT_FOUND"
  | "DB_UNAVAILABLE";

export type ProfileUpdateResult =
  | { ok: true; profile: AccountProfile }
  | {
      ok: false;
      reason:
        | "INVALID_CURRENT_PASSWORD"
        | "PASSWORD_REQUIRED"
        | "PASSWORD_NOT_AVAILABLE"
        | "EMAIL_IN_USE"
        | "ACCOUNT_NOT_FOUND"
        | "DB_UNAVAILABLE";
    };

export async function getAccountProfileRepo(userId: string): Promise<AccountProfile | null> {
  if (!(await canUseDatabase())) {
    const accounts = await readStoredAccounts();
    const account = accounts.find((entry) => entry.id === userId);
    if (!account) {
      return null;
    }

    return {
      id: account.id,
      birthDate: account.birthDate,
      name: account.name,
      email: account.email,
      phone: account.phone ?? undefined,
      createdAt: new Date().toISOString(),
    };
  }

  let user = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
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
  if (!user) return null;

  return {
    id: user.id,
    birthDate: undefined,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function updateAccountProfileRepo(
  userId: string,
  input: { name: string; email: string; phone?: string; currentPassword?: string; birthDate?: string },
): Promise<ProfileUpdateResult> {
  if (!(await canUseDatabase())) {
    const session = await readAuthSession();
    const accounts = await readStoredAccounts();
    const currentAccount =
      accounts.find((entry) => entry.id === userId) ??
      (session?.user && session.user.id === userId
        ? {
            birthDate: session.user.birthDate,
            email: session.user.email,
            emailVerified: session.user.emailVerified,
            id: userId,
            name: session.user.name,
            passwordHash: undefined,
            phone: session.user.phone,
            role: session.user.role,
          }
        : null);

    if (!currentAccount) {
      return { ok: false, reason: "ACCOUNT_NOT_FOUND" };
    }

    const normalizedEmail = input.email.trim().toLowerCase();
    const isEmailChanging = currentAccount.email.trim().toLowerCase() !== normalizedEmail;

    if (isEmailChanging) {
      if (!input.currentPassword?.trim()) {
        return { ok: false, reason: "PASSWORD_REQUIRED" };
      }

      if (currentAccount.passwordHash !== hashPassword(input.currentPassword)) {
        return { ok: false, reason: "INVALID_CURRENT_PASSWORD" };
      }

      const existingAccount = accounts.find(
        (entry) => entry.id !== userId && entry.email.trim().toLowerCase() === normalizedEmail,
      );

      if (existingAccount) {
        return { ok: false, reason: "EMAIL_IN_USE" };
      }
    }

    const updatedSnapshot = {
      ...currentAccount,
      birthDate: input.birthDate?.trim() || undefined,
      email: normalizedEmail,
      name: input.name.trim(),
      phone: input.phone?.trim() || undefined,
    };

    const updatedAccounts = accounts.some((entry) => entry.id === userId)
      ? accounts.map((entry) => (entry.id === userId ? updatedSnapshot : entry))
      : [...accounts, updatedSnapshot];

    await writeStoredAccounts(updatedAccounts);
    const updatedAccount = updatedAccounts.find((entry) => entry.id === userId) ?? updatedSnapshot;

    return {
      ok: true,
      profile: {
        id: updatedAccount.id,
        birthDate: updatedAccount.birthDate,
        name: updatedAccount.name,
        email: updatedAccount.email,
        phone: updatedAccount.phone ?? undefined,
        createdAt: new Date().toISOString(),
      },
    };
  }

  let user = null;
  const normalizedEmail = input.email.trim().toLowerCase();

  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        passwordHash: true,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return { ok: false, reason: "DB_UNAVAILABLE" };
    }

    throw error;
  }

  if (!user) {
    clearDatabaseUnavailable();
    return { ok: false, reason: "ACCOUNT_NOT_FOUND" };
  }

  const isEmailChanging = user.email.trim().toLowerCase() !== normalizedEmail;

  if (isEmailChanging) {
    if (!input.currentPassword?.trim()) {
      clearDatabaseUnavailable();
      return { ok: false, reason: "PASSWORD_REQUIRED" };
    }

    if (!user.passwordHash) {
      clearDatabaseUnavailable();
      return { ok: false, reason: "PASSWORD_NOT_AVAILABLE" };
    }

    if (user.passwordHash !== hashPassword(input.currentPassword)) {
      clearDatabaseUnavailable();
      return { ok: false, reason: "INVALID_CURRENT_PASSWORD" };
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== userId) {
        clearDatabaseUnavailable();
        return { ok: false, reason: "EMAIL_IN_USE" };
      }
    } catch (error) {
      if (isDatabaseUnavailable(error)) {
        markDatabaseUnavailable();
        return { ok: false, reason: "DB_UNAVAILABLE" };
      }

      throw error;
    }
  }

  let updatedUser = null;

  try {
    updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: normalizedEmail,
        name: input.name.trim(),
        phone: input.phone?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return { ok: false, reason: "DB_UNAVAILABLE" };
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return {
    ok: true,
    profile: {
      id: updatedUser.id,
      birthDate: undefined,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone ?? undefined,
      createdAt: updatedUser.createdAt.toISOString(),
    },
  };
}

export async function updateAccountPasswordRepo(
  userId: string,
  input: { currentPassword: string; nextPassword: string },
): Promise<PasswordUpdateResult> {
  if (!(await canUseDatabase())) {
    return "DB_UNAVAILABLE";
  }

  let user = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return "DB_UNAVAILABLE";
    }

    throw error;
  }

  if (!user) {
    clearDatabaseUnavailable();
    return "ACCOUNT_NOT_FOUND";
  }

  if (!user.passwordHash) {
    clearDatabaseUnavailable();
    return "PASSWORD_NOT_AVAILABLE";
  }

  if (user.passwordHash !== hashPassword(input.currentPassword)) {
    clearDatabaseUnavailable();
    return "INVALID_CURRENT_PASSWORD";
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashPassword(input.nextPassword),
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return "DB_UNAVAILABLE";
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return "UPDATED";
}

function serializeAddress(address: {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
  postalCode: string | null;
  isDefault: boolean;
}): AccountAddress {
  return {
    id: address.id,
    title: address.title,
    fullName: address.fullName,
    phone: address.phone,
    city: address.city,
    district: address.district,
    neighborhood: address.neighborhood,
    addressLine: address.addressLine,
    postalCode: address.postalCode ?? undefined,
    isDefault: address.isDefault,
  };
}

export async function getAccountAddressesRepo(userId: string): Promise<AccountAddress[]> {
  if (!(await canUseDatabase())) {
    return [];
  }

  let addresses = [];

  try {
    addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return [];
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return addresses.map(serializeAddress);
}

export async function getAccountAddressByIdRepo(
  userId: string,
  addressId: string,
): Promise<AccountAddress | null> {
  if (!(await canUseDatabase())) {
    return null;
  }

  let address = null;

  try {
    address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return null;
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return address ? serializeAddress(address) : null;
}

export async function createAccountAddressRepo(
  userId: string,
  input: {
    title: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string;
    addressLine: string;
    postalCode?: string;
    isDefault?: boolean;
  },
): Promise<AccountAddress> {
  if (!(await canUseDatabase())) {
    throw new Error("ACCOUNT_DB_UNAVAILABLE");
  }

  let address = null;

  try {
    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    address = await prisma.address.create({
      data: {
        userId,
        title: input.title.trim(),
        fullName: input.fullName.trim(),
        phone: input.phone.trim(),
        city: input.city.trim(),
        district: input.district.trim(),
        neighborhood: input.neighborhood.trim(),
        addressLine: input.addressLine.trim(),
        postalCode: input.postalCode?.trim() || null,
        isDefault: input.isDefault ?? false,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      throw new Error("ACCOUNT_DB_UNAVAILABLE");
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return serializeAddress(address);
}

export async function updateAccountAddressRepo(
  userId: string,
  addressId: string,
  input: Partial<{
    title: string;
    fullName: string;
    phone: string;
    city: string;
    district: string;
    neighborhood: string;
    addressLine: string;
    postalCode: string;
    isDefault: boolean;
  }>,
): Promise<AccountAddress | null> {
  if (!(await canUseDatabase())) {
    return null;
  }

  let existing = null;

  try {
    existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return null;
    }

    throw error;
  }

  if (!existing) return null;

  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.fullName !== undefined) patch.fullName = input.fullName.trim();
  if (input.phone !== undefined) patch.phone = input.phone.trim();
  if (input.city !== undefined) patch.city = input.city.trim();
  if (input.district !== undefined) patch.district = input.district.trim();
  if (input.neighborhood !== undefined) patch.neighborhood = input.neighborhood.trim();
  if (input.addressLine !== undefined) patch.addressLine = input.addressLine.trim();
  if (input.postalCode !== undefined) patch.postalCode = input.postalCode.trim() || null;
  if (input.isDefault !== undefined) patch.isDefault = input.isDefault;

  let address = null;

  try {
    if (input.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    address = await prisma.address.update({
      where: { id: addressId },
      data: patch,
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return null;
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return serializeAddress(address);
}

export async function deleteAccountAddressRepo(userId: string, addressId: string): Promise<boolean> {
  if (!(await canUseDatabase())) {
    return false;
  }

  let existing = null;

  try {
    existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return false;
    }

    throw error;
  }

  if (!existing) return false;

  try {
    await prisma.address.delete({ where: { id: addressId } });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return false;
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return true;
}
