import { open, stat } from "node:fs/promises";
import path from "node:path";

import { ALLOWED_MEDIA } from "@/lib/cms/media-types";
import { UPLOADS_DIR } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

/** Serves files uploaded through the admin media library, with byte-range support so audio and video can seek. */
export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = path.basename(file);
  const mimeType = ALLOWED_MEDIA[path.extname(name).slice(1).toLowerCase()];
  if (!mimeType || name !== file) return new Response("Not found", { status: 404 });
  const full = path.join(UPLOADS_DIR, name);
  let size: number;
  try {
    size = (await stat(full)).size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": mimeType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  };

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

  const handle = await open(full, "r");
  try {
    const buffer = Buffer.alloc(length);
    await handle.read(buffer, 0, length, start);
    return new Response(new Uint8Array(buffer), { status, headers });
  } finally {
    await handle.close();
  }
}
