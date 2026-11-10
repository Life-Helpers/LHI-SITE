import "server-only";

import { strFromU8, unzipSync } from "fflate";

const MAX_CHARS = 60_000;

/** Text of a PDF, page by page. Scanned PDFs (images only) give "". */
async function pdfText(data: Uint8Array): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  // On a server pdf.js runs its worker in-process; handing it the worker module keeps it in the bundle
  // instead of loading a file next to the bundled chunk, which the build leaves out.
  const g = globalThis as { pdfjsWorker?: unknown };
  // @ts-expect-error pdf.js ships no types for its worker module.
  g.pdfjsWorker ??= await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  const doc = await pdfjs.getDocument({ data, isEvalSupported: false, useSystemFonts: false, disableFontFace: true }).promise;
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

/**
 * The readable text of a CV (PDF or .docx), or "" when it has none we can read: a scanned PDF,
 * an old .doc, or a damaged file. Never throws, so a CV we can't read never blocks an application.
 */
export async function cvText(data: Uint8Array, filename: string): Promise<string> {
  try {
    const ext = filename.toLowerCase().split(".").pop();
    const head = new TextDecoder("latin1").decode(data.subarray(0, 5));
    const text = head === "%PDF-" ? await pdfText(data) : ext === "docx" || (data[0] === 0x50 && data[1] === 0x4b) ? docxText(data) : "";
    return text.replace(/[ \t]+/g, " ").trim().slice(0, MAX_CHARS);
  } catch (err) {
    console.error("[recruitment] could not read CV text:", err instanceof Error ? err.message : err);
    return "";
  }
}
