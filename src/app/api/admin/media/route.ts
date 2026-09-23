import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { logActivity } from "@/lib/cms/activity";
import { AuthError, requireUser } from "@/lib/cms/auth";
import { ALLOWED_MEDIA, maxBytesFor } from "@/lib/cms/media-types";
import type { MediaItem } from "@/lib/cms/schema";
import { readStore, UPLOADS_DIR, updateStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireUser("author");
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 401 });
  }
  return NextResponse.json({ items: await readStore("media") });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser("author");
  } catch (err) {
    return NextResponse.json({ error: err instanceof AuthError ? err.message : "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const files = form?.getAll("file").filter((f): f is File => f instanceof File) ?? [];
  if (files.length === 0) return NextResponse.json({ error: "No file received." }, { status: 400 });

  await mkdir(UPLOADS_DIR, { recursive: true });
  const saved: MediaItem[] = [];
  for (const file of files) {
    const ext = path.extname(file.name).slice(1).toLowerCase();
    const mimeType = ALLOWED_MEDIA[ext];
    if (!mimeType) {
      return NextResponse.json({ error: `${file.name}: file type not allowed.` }, { status: 400 });
    }
    const limit = maxBytesFor(mimeType);
    if (file.size > limit) {
      return NextResponse.json({ error: `${file.name}: larger than ${limit / 1024 / 1024} MB.` }, { status: 400 });
    }
    const base = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file";
    const filename = `${base}-${randomUUID().slice(0, 8)}.${ext}`;
    await writeFile(path.join(UPLOADS_DIR, filename), Buffer.from(await file.arrayBuffer()));
    saved.push({
      id: randomUUID(),
      filename,
      url: `/media/${filename}`,
      mimeType,
      size: file.size,
      alt: String(form?.get("alt") ?? ""),
      uploadedBy: user.name,
      uploadedAt: new Date().toISOString(),
    });
  }

  await updateStore("media", (items) => ({ items: [...saved, ...items] }));
  await logActivity(user, saved.length > 1 ? `uploaded ${saved.length} files` : "uploaded media", saved.map((s) => s.filename).join(", "), "/admin/media");
  return NextResponse.json({ items: saved });
}
