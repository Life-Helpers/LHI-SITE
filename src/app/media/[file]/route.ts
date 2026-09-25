import path from "node:path";

import { fileInfo, readFileRange } from "@/lib/cms/files";
import { ALLOWED_MEDIA } from "@/lib/cms/media-types";

export const dynamic = "force-dynamic";

/** Serves files uploaded through the admin media library, with byte-range support so audio and video can seek. */
export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = path.basename(file);
  const mimeType = ALLOWED_MEDIA[path.extname(name).slice(1).toLowerCase()];
  if (!mimeType || name !== file) return new Response("Not found", { status: 404 });
  const key = `uploads/${name}`;
  const info = await fileInfo(key);
  if (!info) return new Response("Not found", { status: 404 });
  const { size, etag, lastModified: mtime } = info;

  const headers: Record<string, string> = {
    "Content-Type": mimeType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    ETag: etag,
    "Last-Modified": mtime.toUTCString(),
  };
  if (req.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });

  let start = 0;
  let end = size - 1;
  let status = 200;
  const range = req.headers.get("range");
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m || (!m[1] && !m[2])) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    if (m[1]) {
      start = Number(m[1]);
      end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    } else {
      start = Math.max(0, size - Number(m[2]));
    }
    if (start > end || start >= size) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  }
  const length = end - start + 1;
  headers["Content-Length"] = String(length);

  // Streamed so large audio and video files never sit whole in memory.
  const stream = await readFileRange(key, start, end);
  if (!stream) return new Response("Not found", { status: 404 });
  return new Response(stream, { status, headers });
}
