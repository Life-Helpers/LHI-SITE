import { readFile } from "node:fs/promises";
import path from "node:path";

import { ALLOWED_MEDIA } from "@/lib/cms/media-types";
import { UPLOADS_DIR } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

/** Serves files uploaded through the admin media library. */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = path.basename(file);
  const mimeType = ALLOWED_MEDIA[path.extname(name).slice(1).toLowerCase()];
  if (!mimeType || name !== file) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(UPLOADS_DIR, name));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
