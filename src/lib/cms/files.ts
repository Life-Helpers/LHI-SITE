import "server-only";

import { createReadStream } from "node:fs";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { del, get, head, put } from "@vercel/blob";

import { DATA_DIR } from "@/lib/cms/paths";

/**
 * Where uploaded files live. Keys look like "uploads/photo-1a2b.jpg" (media library,
 * magazine pages) or "private/cvs/<uuid>.pdf" (CVs and bids, admin-only).
 * - Vercel Blob when BLOB_READ_WRITE_TOKEN is set: required on Vercel, whose disk is temporary.
 *   Files are stored as private blobs and always served through this app, so /media/… links
 *   keep working and private files stay behind the admin login.
 * - Otherwise the CMS_DATA_DIR folder on disk.
 */
export function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Private blob stores are recommended; set BLOB_ACCESS=public only for a public store. */
export const blobAccess = () => (process.env.BLOB_ACCESS === "public" ? "public" : "private") as "public" | "private";
const access = blobAccess;

function safeKey(key: string) {
  const normalized = path.posix.normalize(key).replace(/^\/+/, "");
  if (normalized.startsWith("..") || !/^(uploads|private)\/[\w./-]+$/.test(normalized)) throw new Error("Invalid file key");
  return normalized;
}

const diskPath = (key: string) => path.join(DATA_DIR, ...safeKey(key).split("/"));

export async function putFile(key: string, data: Buffer, contentType: string) {
  const k = safeKey(key);
  if (blobEnabled()) {
    await put(k, data, { access: access(), contentType, addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 31536000 });
    return;
  }
  const full = diskPath(k);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
}

export async function deleteFile(key: string) {
  const k = safeKey(key);
  if (blobEnabled()) {
    await del(k).catch(() => undefined);
    return;
  }
  await rm(diskPath(k), { force: true });
}

/** Size and version of a stored file, or null if it doesn't exist. */
export async function fileInfo(key: string): Promise<{ size: number; etag: string; lastModified: Date } | null> {
  const k = safeKey(key);
  if (blobEnabled()) {
    try {
      const info = await head(k);
      const etag = info.etag.startsWith('"') || info.etag.startsWith("W/") ? info.etag : `"${info.etag}"`;
      return { size: info.size, etag, lastModified: new Date(info.uploadedAt) };
    } catch {
      return null;
    }
  }
  try {
    const { size, mtime } = await stat(diskPath(k));
    return { size, etag: `W/"${size.toString(16)}-${mtime.getTime().toString(16)}"`, lastModified: mtime };
  } catch {
    return null;
  }
}

/** A stream of the file's bytes from `start` to `end` inclusive. */
export async function readFileRange(key: string, start: number, end: number): Promise<ReadableStream<Uint8Array> | null> {
  const k = safeKey(key);
  if (blobEnabled()) {
    const res = await get(k, { access: access(), headers: { Range: `bytes=${start}-${end}` } });
    return res?.stream ?? null;
  }
  return Readable.toWeb(createReadStream(diskPath(k), { start, end })) as ReadableStream<Uint8Array>;
}

/** The whole file in memory (small private documents only). */
export async function readWholeFile(key: string): Promise<Buffer> {
  const k = safeKey(key);
  if (blobEnabled()) {
    const res = await get(k, { access: access() });
    if (!res?.stream) throw new Error("File not found");
    return Buffer.from(await new Response(res.stream).arrayBuffer());
  }
  return readFile(diskPath(k));
}
