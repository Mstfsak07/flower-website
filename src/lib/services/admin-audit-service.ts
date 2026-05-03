import "server-only";

import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";

import { env } from "@/lib/env";

export type AdminAuditEntry = {
  id: string;
  actorEmail: string;
  actorName: string;
  action: string;
  entityType: "order" | "product" | "media" | "auth" | "wholesale";
  entityId: string;
  summary: string;
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null>;
};

const auditDir = path.join(process.cwd(), ".runtime");
const auditFile = path.join(auditDir, "admin-audit.log");

async function ensureAuditStore() {
  await mkdir(auditDir, { recursive: true });
}

export async function logAdminAction(entry: Omit<AdminAuditEntry, "createdAt" | "id">) {
  await ensureAuditStore();

  const payload: AdminAuditEntry = {
    ...entry,
    createdAt: new Date().toISOString(),
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };

  await appendFile(auditFile, `${JSON.stringify(payload)}\n`, "utf8");
  return payload;
}

export async function listAdminAuditEntries(limit = 80) {
  if (env.isDemoMode) {
    await ensureAuditStore();
  }

  try {
    const raw = await readFile(auditFile, "utf8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AdminAuditEntry)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, limit);
  } catch {
    return [] as AdminAuditEntry[];
  }
}
