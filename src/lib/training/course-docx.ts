import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

/**
 * Course files as Word documents, so trainers can work in Word instead of a text editor. The document
 * holds the same lines as the text format (course-file.ts), one paragraph each, with the section lines
 * in bold. Reading one back undoes what Word does as people type: bullet and numbered lists, dashes
 * turned into en/em dashes, and single paragraphs where the text format wants a blank line between.
 */

const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unesc = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, "&");

function paragraph(line: string): string {
  const t = line.trim();
  // [bold, half-point size, colour, italic]
  const look: [boolean, number, string, boolean] = /^===/.test(t)
    ? [true, 30, "1F4E79", false]
    : /^---/.test(t)
      ? [true, 22, "1F4E79", false]
      : /^\/\//.test(t)
        ? [false, 18, "7F7F7F", true]
        : /^Title:/.test(t)
          ? [true, 32, "000000", false]
          : /^## /.test(t)
            ? [true, 22, "000000", false]
            : [false, 22, "000000", false];
  const [bold, size, color, italic] = look;
  const rPr = `<w:rPr>${bold ? "<w:b/>" : ""}${italic ? "<w:i/>" : ""}<w:color w:val="${color}"/><w:sz w:val="${size}"/></w:rPr>`;
  const space = /^===/.test(t) ? '<w:spacing w:before="240" w:after="80"/>' : '<w:spacing w:after="40"/>';
  return `<w:p><w:pPr>${space}</w:pPr>${line ? `<w:r>${rPr}<w:t xml:space="preserve">${esc(line)}</w:t></w:r>` : ""}</w:p>`;
}

/** A Word document with one paragraph per line of the course text. */
export function courseTextToDocx(text: string): Uint8Array {
  const body = text.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n").map(paragraph).join("");
  return zipSync({
    "[Content_Types].xml": strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    ),
    "_rels/.rels": strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    ),
    "word/document.xml": strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="${W}"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`,
    ),
  });
}

/** numId -> whether that Word list is numbered (1. 2. 3.) rather than bulleted, from numbering.xml. */
function numberedLists(xml: string | undefined): Map<string, boolean> {
  const map = new Map<string, boolean>();
  if (!xml) return map;
  const abstract = new Map<string, boolean>();
  for (const m of xml.matchAll(/<w:abstractNum\b[^>]*w:abstractNumId="(\d+)"[^>]*>([\s\S]*?)<\/w:abstractNum>/g)) {
    const first = /<w:numFmt w:val="([^"]+)"/.exec(m[2])?.[1] ?? "bullet";
    abstract.set(m[1], first !== "bullet" && first !== "none");
  }
  for (const m of xml.matchAll(/<w:num\b[^>]*w:numId="(\d+)"[^>]*>[\s\S]*?<w:abstractNumId w:val="(\d+)"/g)) map.set(m[1], abstract.get(m[2]) ?? false);
  return map;
}

const SECTION = /^[=\-–—_\s]*(LESSON\s*:.*?|FINAL EXAM|PRACTICE QUESTION|QUESTION)[=\-–—_\s]*$/i;
const listLike = (l: string) => /^(- |\d+[.)] |\* |Q\s*:|Why\s*:)/i.test(l);

/** The course text from a Word document (one written by courseTextToDocx, or typed in Word). */
export function docxToCourseText(data: Uint8Array): string {
  const files = unzipSync(data, { filter: (f) => f.name === "word/document.xml" || f.name === "word/numbering.xml" });
  const doc = files["word/document.xml"];
  if (!doc) throw new Error("That isn't a Word document (.docx).");
  const numbered = numberedLists(files["word/numbering.xml"] && strFromU8(files["word/numbering.xml"]));
  const xml = strFromU8(doc);

  const lines: string[] = [];
  for (const [p] of xml.matchAll(/<w:p\b[^>]*\/>|<w:p\b[^>]*>[\s\S]*?<\/w:p>/g)) {
    let text = unesc(
      p
        .replace(/<w:tab\/>/g, " ")
        .replace(/<w:br\/>/g, "\n")
        .replace(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<[^>]+>/g, (_, t) => t ?? ""),
    ).replace(/ /g, " ");
    const numId = /<w:numPr>[\s\S]*?<w:numId w:val="(\d+)"/.exec(p)?.[1];
    if (numId && numId !== "0" && text.trim()) text = `${numbered.get(numId) ? "1." : "-"} ${text.trim()}`;
    for (const raw of text.split("\n")) {
      let line = raw.trimEnd();
      const section = SECTION.exec(line.trim());
      if (section) {
        const inner = section[1].replace(/\s+/g, " ").trim();
        line = /^(LESSON|FINAL)/i.test(inner) ? `=== ${inner.replace(/^LESSON\s*:/i, "LESSON:")} ===` : `--- ${inner.toUpperCase()} ---`;
      }
      // Word's own bullet characters and its dash autocorrect at the start of a line.
      line = line.replace(/^\s*[•▪●◦·–—]\s+/, "- ");
      lines.push(line);
    }
  }

  // The text format separates paragraphs with a blank line; Word users press Enter once. Keep lists,
  // questions, a "## title" with its list and a "[!info] Title" with its text together.
  const out: string[] = [];
  lines.forEach((line, i) => {
    out.push(line);
    const next = lines[i + 1];
    if (next === undefined || !line.trim() || !next.trim()) return;
    if ((listLike(line.trim()) && listLike(next.trim())) || /^(## |\[!)/.test(line.trim())) return;
    out.push("");
  });
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/** Whether uploaded bytes are a Word .docx (a zip) rather than text. */
export const isDocx = (data: Uint8Array) => data[0] === 0x50 && data[1] === 0x4b && data[2] === 0x03 && data[3] === 0x04;
