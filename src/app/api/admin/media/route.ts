import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-guard";
import { readAuthSessionFromRequest } from "@/lib/auth-server";
import { logAdminAction } from "@/lib/services/admin-audit-service";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSizeBytes = 4 * 1024 * 1024;

async function ensureUploadDir() {
  await mkdir(uploadDir, { recursive: true });
}

export async function GET(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  await ensureUploadDir();
  const entries = await readdir(uploadDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => ({
      name: entry.name,
      url: `/uploads/${entry.name}`,
    }))
    .sort((left, right) => right.name.localeCompare(left.name));

  return NextResponse.json(files);
}

export async function POST(request: Request) {
  const deny = requireAdmin(request);
  if (deny) return deny;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Dosya bulunamadi." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ message: "Sadece JPG, PNG veya WEBP kabul edilir." }, { status: 415 });
  }

  if (file.size > maxSizeBytes) {
    return NextResponse.json({ message: "Dosya boyutu 4 MB sinirini asiyor." }, { status: 413 });
  }

  await ensureUploadDir();

  const extension = path.extname(file.name) || ".bin";
  const safeBase = path
    .basename(file.name, extension)
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "asset";
  const filename = `${Date.now()}-${safeBase}${extension.toLowerCase()}`;
  const target = path.join(uploadDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(target, buffer);

  const uploaded = {
    name: filename,
    size: file.size,
    type: file.type,
    url: `/uploads/${filename}`,
  };

  const session = readAuthSessionFromRequest(request);
  if (session?.user.role === "ADMIN") {
    await logAdminAction({
      action: "media.uploaded",
      actorEmail: session.user.email,
      actorName: session.user.name,
      entityId: filename,
      entityType: "media",
      metadata: {
        size: file.size,
      },
      summary: `${filename} medya kutuphanesine yüklendi.`,
    });
  }

  return NextResponse.json({ ok: true, file: uploaded }, { status: 201 });
}
