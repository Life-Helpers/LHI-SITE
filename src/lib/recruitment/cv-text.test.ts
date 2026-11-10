import { strToU8, zipSync } from "fflate";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { cvText } = await import("@/lib/recruitment/cv-text");

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

  it("gives empty text for files it can't read, instead of throwing", async () => {
    expect(await cvText(new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 1, 2, 3]), "old.doc")).toBe("");
    expect(await cvText(strToU8("%PDF-broken"), "cv.pdf")).toBe("");
  });
});
