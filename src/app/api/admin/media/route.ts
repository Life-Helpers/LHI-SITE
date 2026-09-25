import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { logActivity } from "@/lib/cms/activity";
import { AuthError, requireUser } from "@/lib/cms/auth";
import { ALLOWED_MEDIA, maxBytesFor } from "@/lib/cms/media-types";
import { optimizeUpload } from "@/lib/media/optimize";
import type { MediaItem } from "@/lib/cms/schema";
import { fileInfo, putFile } from "@/lib/cms/files";
import { readStore, updateStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireUser("media");
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 401 });
  }
  return NextResponse.json({ items: await readStore("media") });
}

export async function POST(req: NextRequest) {
  let user;
  try {
    user = await requireUser("media");
  } catch (err) {
    return NextResponse.json({ error: err instanceof AuthError ? err.message : "Unauthorized" }, { status: 401 });
  }

  // A large file uploaded straight to Vercel Blob by the browser: check it and add it to the library.
  if (req.headers.get("content-type")?.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as { register?: unknown; alt?: unknown };
    const filename = String(body.register ?? "");
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mimeType = ALLOWED_MEDIA[ext];
    if (!/^[a-z0-9-]{1,60}-[0-9a-f]{8}\.[a-z0-9]+$/.test(filename) || !mimeType) {
      return NextResponse.json({ error: "Invalid file." }, { status: 400 });
    }
    const info = await fileInfo(`uploads/${filename}`);
    if (!info) return NextResponse.json({ error: "The upload did not complete. Please try again." }, { status: 400 });
    if (info.size > maxBytesFor(mimeType)) return NextResponse.json({ error: "File is too large." }, { status: 400 });
    const item: MediaItem = {
      id: randomUUID(),
      filename,
      url: `/media/${filename}`,
      mimeType,
      size: info.size,
      alt: String(body.alt ?? "").slice(0, 300),
      uploadedBy: user.name,
      uploadedAt: new Date().toISOString(),
    };
    await updateStore("media", (items) => ({ items: [item, ...items.filter((i) => i.filename !== filename)] }));
    await logActivity(user, "uploaded media", filename, "/admin/media");
    return NextResponse.json({ items: [item] });
  }

  const form = await req.formData().catch(() => null);
  const files = form?.getAll("file").filter((f): f is File => f instanceof File) ?? [];
  if (files.length === 0) return NextResponse.json({ error: "No file received." }, { status: 400 });

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
    const { buffer } = await optimizeUpload(Buffer.from(await file.arrayBuffer()), mimeType);
    await putFile(`uploads/${filename}`, buffer, mimeType);
    saved.push({
      id: randomUUID(),
      filename,
      url: `/media/${filename}`,
      mimeType,
      size: buffer.length,
      alt: String(form?.get("alt") ?? ""),
      uploadedBy: user.name,
      uploadedAt: new Date().toISOString(),
    });
  }

  await updateStore("media", (items) => ({ items: [...saved, ...items] }));
  await logActivity(user, saved.length > 1 ? `uploaded ${saved.length} files` : "uploaded media", saved.map((s) => s.filename).join(", "), "/admin/media");
  return NextResponse.json({ items: saved });
}
