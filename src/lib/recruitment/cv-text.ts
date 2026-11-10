import "server-only";

import { execFile } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { strFromU8, unzipSync } from "fflate";

const MAX_CHARS = 60_000;
/** Below this many characters a CV is treated as having no text (a scan). */
export const MIN_TEXT = 50;
const OCR_PAGES = 3;
const run = promisify(execFile);

/** Text of a PDF, page by page. Scanned PDFs (images only) give "". */
async function pdfText(data: Uint8Array): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // On a server pdf.js runs its worker in-process; handing it the worker module keeps it in the bundle
  // instead of loading a file next to the bundled chunk, which the build leaves out.
  const g = globalThis as { pdfjsWorker?: unknown };
  // @ts-expect-error pdf.js ships no types for its worker module.
  g.pdfjsWorker ??= await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  // A copy: pdf.js takes over the buffer it is given, and the caller may still need it (e.g. for OCR).
  const doc = await pdfjs.getDocument({ data: data.slice(), isEvalSupported: false, useSystemFonts: false, disableFontFace: true }).promise;
  const pages: string[] = [];
  try {
    for (let n = 1; n <= Math.min(doc.numPages, 15); n++) {
      const content = await (await doc.getPage(n)).getTextContent();
      pages.push(content.items.map((i) => ("str" in i ? i.str : "")).join(" "));
    }
  } finally {
    await doc.destroy();
  }
  return pages.join("\n");
}

/** Text of a .docx: the words in word/document.xml, one paragraph per line. */
function docxText(data: Uint8Array): string {
  const files = unzipSync(data, { filter: (f) => f.name === "word/document.xml" });
  const xml = files["word/document.xml"];
  if (!xml) return "";
  return strFromU8(xml)
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:tab\/>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** Text of an old Word .doc (the binary format from before 2007). */
async function docText(data: Uint8Array): Promise<string> {
  // @ts-expect-error word-extractor ships no types.
  const { default: WordExtractor } = await import("word-extractor");
  const doc = await new WordExtractor().extract(Buffer.from(data));
  return String(doc.getBody() ?? "");
}

let ocrQueue: Promise<unknown> = Promise.resolve();

/**
 * Text of a scanned PDF by OCR: the first pages as 150 dpi greyscale images (poppler's pdftoppm; enough
 * for CV text and light on memory inside the 512 MB container), each read
 * by Tesseract. One CV at a time, so a burst of applications can't exhaust a small server. Needs
 * both programs installed (the Dockerfile adds them); without them this gives "".
 */
function ocrPdf(data: Uint8Array): Promise<string> {
  const job = ocrQueue.then(async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "lhi-cv-"));
    try {
      await writeFile(path.join(dir, "cv.pdf"), data);
      await run("pdftoppm", ["-r", "150", "-gray", "-png", "-l", String(OCR_PAGES), "cv.pdf", "page"], { cwd: dir, timeout: 60_000 });
      const pages = (await readdir(dir)).filter((f) => f.startsWith("page") && f.endsWith(".png")).sort();
      const texts: string[] = [];
      for (const page of pages) {
        const { stdout } = await run("tesseract", [page, "stdout", "-l", "eng", "--psm", "1"], { cwd: dir, timeout: 90_000, maxBuffer: 4 * 1024 * 1024, env: { ...process.env, OMP_THREAD_LIMIT: "1" } });
        texts.push(stdout);
      }
      return texts.join("\n");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
  ocrQueue = job.catch(() => undefined);
  return job;
}

const isPdf = (data: Uint8Array) => new TextDecoder("latin1").decode(data.subarray(0, 5)) === "%PDF-";

/**
 * The readable text of a CV (PDF, .docx or old .doc), or "" when it has none we can read. A PDF with
 * no text (a scan) is read by OCR when `ocr` is set; that takes seconds a page, so the application
 * form leaves it to the background. Never throws, so a CV we can't read never blocks an application.
 */
export async function cvText(data: Uint8Array, filename: string, { ocr = false } = {}): Promise<string> {
  const tidy = (t: string) => t.replace(/[ \t]+/g, " ").trim().slice(0, MAX_CHARS);
  try {
    const ext = filename.toLowerCase().split(".").pop();
    const zip = data[0] === 0x50 && data[1] === 0x4b;
    const ole = data[0] === 0xd0 && data[1] === 0xcf && data[2] === 0x11 && data[3] === 0xe0;
    const text = tidy(isPdf(data) ? await pdfText(data) : ext === "docx" || zip ? docxText(data) : ole ? await docText(data) : "");
    if (text.length >= MIN_TEXT || !ocr || !isPdf(data)) return text;
    return tidy(await ocrPdf(data));
  } catch (err) {
    console.error("[recruitment] could not read CV text:", err instanceof Error ? err.message : err);
    return "";
  }
}

/** Whether a CV would need OCR: a PDF whose text layer is empty. */
export async function needsOcr(data: Uint8Array, filename: string): Promise<boolean> {
  return isPdf(data) && (await cvText(data, filename)).length < MIN_TEXT;
}
