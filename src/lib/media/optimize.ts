import "server-only";

import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { unzipSync, zipSync, type Zippable } from "fflate";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const run = promisify(execFile);

/**
 * Shrinks uploaded files without visible quality loss, and keeps the original whenever
 * the optimised copy is not meaningfully smaller or fails a sanity check.
 *
 * - PNG and Office files (docx/pptx/xlsx): lossless re-compression.
 * - JPEG: re-encoded at quality 90 (visually identical), auto-rotated, metadata such as
 *   GPS location removed. Only kept when at least 10% smaller.
 * - PDF: lossless re-packing (qpdf when installed, otherwise pdf-lib object streams).
 * - MP4: moved the index to the front for faster streaming (no re-encode), when ffmpeg is installed.
 * - WebP/AVIF/GIF and audio are already compressed formats; re-encoding them would lose
 *   quality, so they are stored as uploaded.
 */
export async function optimizeUpload(input: Buffer, mimeType: string): Promise<{ buffer: Buffer; saved: number }> {
  try {
    const out = await optimize(input, mimeType);
    // A fast-start MP4 is worth keeping even at the same size: it can play before fully downloading.
    const allowance = mimeType === "video/mp4" ? input.length * 0.01 : 0;
    if (out && out.length < input.length + allowance) return { buffer: out, saved: Math.max(0, input.length - out.length) };
  } catch (err) {
    console.warn("[media] optimisation skipped:", (err as Error).message);
  }
  return { buffer: input, saved: 0 };
}

async function optimize(input: Buffer, mimeType: string): Promise<Buffer | null> {
  switch (mimeType) {
    case "image/png":
      return sharp(input).png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true, palette: false }).toBuffer();
    case "image/jpeg": {
      const out = await sharp(input).rotate().jpeg({ quality: 90, mozjpeg: true, progressive: true }).toBuffer();
      return out.length <= input.length * 0.9 ? out : null;
    }
    case "application/pdf":
      return optimizePdf(input);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return optimizeOfficeZip(input);
    case "video/mp4":
      return withTool("ffmpeg", input, "mp4", (src, dst) => ["-v", "error", "-i", src, "-map", "0", "-c", "copy", "-movflags", "+faststart", "-y", dst]);
    default:
      return null;
  }
}

async function optimizePdf(input: Buffer): Promise<Buffer | null> {
  const viaQpdf = await withTool("qpdf", input, "pdf", (src, dst) => [
    "--object-streams=generate",
    "--compress-streams=y",
    "--recompress-flate",
    "--compression-level=9",
    src,
    dst,
  ]).catch(() => null);
  const out = viaQpdf ?? Buffer.from(await (await PDFDocument.load(input, { updateMetadata: false })).save({ useObjectStreams: true }));
  if (out.subarray(0, 5).toString("latin1") !== "%PDF-") return null;
  // Must still open with the same number of pages.
  const [a, b] = await Promise.all([PDFDocument.load(input, { ignoreEncryption: true }), PDFDocument.load(out, { ignoreEncryption: true })]);
  return a.getPageCount() === b.getPageCount() ? out : null;
}

/** Office files are zip archives: re-deflate every part at maximum level and losslessly shrink embedded PNGs. */
async function optimizeOfficeZip(input: Buffer): Promise<Buffer | null> {
  const files = unzipSync(new Uint8Array(input));
  const names = Object.keys(files);
  if (!names.includes("[Content_Types].xml")) return null;
  const packed: Zippable = {};
  // [Content_Types].xml first, as Office expects.
  for (const name of ["[Content_Types].xml", ...names.filter((n) => n !== "[Content_Types].xml")]) {
    let data = files[name];
    if (/\.png$/i.test(name)) {
      const png = await sharp(data).png({ compressionLevel: 9, effort: 10, palette: false }).toBuffer().catch(() => null);
      if (png && png.length < data.length) data = new Uint8Array(png);
    }
    packed[name] = [data, { level: /\.(jpe?g|png|gif|mp3|mp4|wav)$/i.test(name) ? 0 : 9 }];
  }
  const out = Buffer.from(zipSync(packed));
  // Sanity check: the repacked archive must contain the same parts.
  return Object.keys(unzipSync(new Uint8Array(out))).length === names.length ? out : null;
}

/** Runs a command-line tool on a temp copy; returns null when the tool is not installed. */
async function withTool(tool: string, input: Buffer, ext: string, args: (src: string, dst: string) => string[]): Promise<Buffer | null> {
  const dir = await mkdtemp(path.join(tmpdir(), "lhi-opt-"));
  try {
    const src = path.join(dir, `in.${ext}`);
    const dst = path.join(dir, `out.${ext}`);
    await writeFile(src, input);
    try {
      await run(tool, args(src, dst), { timeout: 120_000 });
    } catch (err) {
      const code = (err as { code?: string | number }).code;
      if (code === "ENOENT") return null;
      // qpdf exits with 3 for warnings but still writes a valid file.
      if (!(tool === "qpdf" && code === 3)) throw err;
    }
    return await readFile(dst);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
