"use client";

/**
 * Browser helper for files larger than a serverless request allows (about 4.5 MB on Vercel):
 * when the site uses Vercel Blob, the file goes straight from the browser to storage with a
 * short-lived token from /api/admin/upload; otherwise it falls back to a normal form upload.
 */
export const SERVER_UPLOAD_LIMIT = 4 * 1024 * 1024;

let cachedAccess: Promise<"public" | "private" | null> | null = null;

export function directUploadAccess() {
  cachedAccess ??= fetch("/api/admin/upload")
    .then((r) => (r.ok ? r.json() : { direct: null }))
    .then((d: { direct?: "public" | "private" | null }) => d.direct ?? null)
    .catch(() => null);
  return cachedAccess;
}

/** Upload one file to `pathname` (e.g. "uploads/talk-1a2b3c4d.mp3") directly to Vercel Blob. */
export async function uploadDirect(pathname: string, file: File, purpose: "media" | "magazine-pdf", access: "public" | "private") {
  const { upload } = await import("@vercel/blob/client");
  await upload(pathname, file, {
    access,
    handleUploadUrl: "/api/admin/upload",
    clientPayload: JSON.stringify({ purpose }),
    contentType: file.type || undefined,
    multipart: file.size > 20 * 1024 * 1024,
  });
}

/** The stored name for a media file, matching the server's naming. */
export function mediaFilename(file: File) {
  const dot = file.name.lastIndexOf(".");
  const ext = (dot > 0 ? file.name.slice(dot + 1) : "").toLowerCase();
  const base =
    (dot > 0 ? file.name.slice(0, dot) : file.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "file";
  const random = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0")).join("");
  return `${base}-${random}.${ext}`;
}
