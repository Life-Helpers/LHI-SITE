import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { strToU8, zipSync } from "fflate";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { cvText, needsOcr } = await import("@/lib/recruitment/cv-text");

const fixture = (name: string) => new Uint8Array(readFileSync(new URL(`./__fixtures__/${name}`, import.meta.url)));
const hasOcr = (() => {
  try {
    execFileSync("tesseract", ["--version"], { stdio: "ignore" });
    execFileSync("pdftoppm", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

describe("cvText", () => {
  it("reads the text of a PDF", async () => {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    pdf.addPage().drawText("Amina Bello, MEAL Officer with KoboToolbox experience", { x: 40, y: 700, size: 12, font });
    expect(await cvText(await pdf.save(), "cv.pdf")).toContain("KoboToolbox");
  });

  it("reads the text of a Word .docx", async () => {
    const xml = `<w:document><w:body><w:p><w:r><w:t>Finance &amp; Grants</w:t></w:r></w:p><w:p><w:r><w:t>QuickBooks</w:t></w:r></w:p></w:body></w:document>`;
    const docx = zipSync({ "word/document.xml": strToU8(xml), "[Content_Types].xml": strToU8("<Types/>") });
    expect(await cvText(docx, "cv.docx")).toBe("Finance & Grants\nQuickBooks");
  });

  it("reads the text of an old Word 97 .doc", async () => {
    expect(await cvText(fixture("cv-word97.doc"), "cv.doc")).toContain("KoboToolbox and Power BI");
  });

  it("leaves a scanned PDF to OCR, and reads it when asked", { timeout: 60_000 }, async (t) => {
    const scan = fixture("cv-scanned.pdf");
    expect(await cvText(scan, "scan.pdf")).toBe("");
    expect(await needsOcr(scan, "scan.pdf")).toBe(true);
    if (!hasOcr) return t.skip();
    const text = await cvText(scan, "scan.pdf", { ocr: true });
    expect(text).toContain("KoboToolbox");
    expect(text).toContain("Hausa");
  });

  it("gives empty text for files it can't read, instead of throwing", async () => {
    expect(await cvText(new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 1, 2, 3]), "old.doc")).toBe("");
    expect(await cvText(strToU8("%PDF-broken"), "cv.pdf")).toBe("");
  });
});
