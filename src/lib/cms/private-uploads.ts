import "server-only";

import { randomUUID } from "node:crypto";
import { deleteFile, putFile, readWholeFile } from "@/lib/cms/files";
import { optimizeUpload } from "@/lib/media/optimize";

/**
 * Private uploads (CVs, vendor quotations). Stored under private/ (on disk or as private
 * blobs) and only served through the authenticated admin route.
 */

export const PRIVATE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

const SIGNATURES: { ext: string; mime: string; test: (b: Buffer) => boolean }[] = [
  { ext: "pdf", mime: "application/pdf", test: (b) => b.subarray(0, 5).toString("latin1") === "%PDF-" },
  // .docx (zip container)
  { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", test: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04 },
  // legacy .doc (OLE compound file)
  { ext: "doc", mime: "application/msword", test: (b) => b.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0])) },
];

export const MIME_BY_EXT: Record<string, string> = Object.fromEntries(SIGNATURES.map((s) => [s.ext, s.mime]));

export type PrivateUpload = { filename: string; stored: string; size: number };

/** Validate (size + file signature) and store an uploaded document. Returns an error string on failure. */
export async function savePrivateUpload(file: File, folder: string): Promise<PrivateUpload | string> {
  if (file.size === 0) return "The attached file is empty.";
  if (file.size > PRIVATE_UPLOAD_MAX_BYTES) return "Attachments must be 5 MB or smaller.";
  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = SIGNATURES.find((s) => s.test(buffer));
  if (!kind) return "Attach a PDF or Word document.";
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
  const stored = `${safeFolder}/${randomUUID()}.${kind.ext}`;
  const { buffer: optimized } = await optimizeUpload(buffer, kind.mime);
  await putFile(`private/${stored}`, optimized, kind.mime);
  const filename = file.name.replace(/[^\w.\- ()]/g, "_").slice(0, 120) || `attachment.${kind.ext}`;
  return { filename, stored, size: optimized.length };
}

function keyFor(stored: string) {
  if (!/^[a-z0-9-]+\/[\w-]+\.(pdf|docx?)$/i.test(stored)) throw new Error("Invalid path");
  return `private/${stored}`;
}

export function readPrivateUpload(stored: string) {
  return readWholeFile(keyFor(stored));
}

export async function deletePrivateUpload(stored: string) {
  await deleteFile(keyFor(stored));
}
