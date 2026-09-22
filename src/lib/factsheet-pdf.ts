import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

import { siteConfig } from "@/config/site";
import type { InterventionProject } from "@/data/interventions-data";
import { OPERATIONAL_STATES } from "@/data/operational-states";

const BRAND = rgb(0xeb / 255, 0x16 / 255, 0x1c / 255);
const INK = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.42, 0.42, 0.46);
const RULE = rgb(0.88, 0.88, 0.9);

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 44;
const CONTENT_W = PAGE_W - MARGIN * 2;

/** Standard PDF fonts only cover WinAnsi; map typographic characters and drop the rest. */
function sanitize(text: string) {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = sanitize(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildFactsheetPdf(project: InterventionProject): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${sanitize(project.title)} - Factsheet`);
  doc.setAuthor("Life Helpers Initiative");
  doc.setSubject("Project factsheet for donor compliance, M&E reporting and consortium proposals");

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);

  // Header band
  page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 92, color: BRAND });
  try {
    const logoBytes = await readFile(path.join(process.cwd(), "public", "logo.png"));
    const logo = await doc.embedPng(logoBytes);
    const h = 34;
    const w = (logo.width / logo.height) * h;
    page.drawRectangle({ x: MARGIN - 6, y: PAGE_H - 66, width: w + 12, height: h + 12, color: rgb(1, 1, 1) });
    page.drawImage(logo, { x: MARGIN, y: PAGE_H - 60, width: w, height: h });
  } catch {
    page.drawText("LIFE HELPERS INITIATIVE", { x: MARGIN, y: PAGE_H - 52, size: 14, font: bold, color: rgb(1, 1, 1) });
  }
  page.drawText("PROJECT FACTSHEET", {
    x: PAGE_W - MARGIN - bold.widthOfTextAtSize("PROJECT FACTSHEET", 10),
    y: PAGE_H - 44,
    size: 10,
    font: bold,
    color: rgb(1, 1, 1),
  });
  const statusLine = sanitize(`${project.status} | ${project.duration}`);
  page.drawText(statusLine, {
    x: PAGE_W - MARGIN - regular.widthOfTextAtSize(statusLine, 8.5),
    y: PAGE_H - 58,
    size: 8.5,
    font: regular,
    color: rgb(1, 1, 1),
  });

  let y = PAGE_H - 124;

  const text = (value: string, opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number } = {}) => {
    const font = opts.font ?? regular;
    const size = opts.size ?? 9.5;
    const indent = opts.indent ?? 0;
    for (const line of wrap(value, font, size, CONTENT_W - indent)) {
      page.drawText(line, { x: MARGIN + indent, y, size, font, color: opts.color ?? INK });
      y -= size * 1.38;
    }
    y -= opts.gap ?? 0;
  };

  const heading = (label: string) => {
    y -= 6;
    page.drawText(label.toUpperCase(), { x: MARGIN, y, size: 8.5, font: bold, color: BRAND });
    y -= 6;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.6, color: RULE });
    y -= 14;
  };

  text(project.title, { font: bold, size: 17, gap: 4 });
  text(project.donor, { size: 10, color: MUTED, gap: 8 });

  // Key facts grid
  const stateNames = OPERATIONAL_STATES.filter((s) => project.states.includes(s.id)).map((s) => s.name);
  const facts: [string, string][] = [
    ["Donor / Lead partner", project.donor],
    ["Status", `${project.status} (${project.duration})`],
    ["Location", project.locations],
    ["States", stateNames.join(", ")],
    ["Thematic areas", project.thematicAreas.map((t) => t.name).join(", ")],
  ];
  heading("Key facts");
  for (const [label, value] of facts) {
    page.drawText(sanitize(label), { x: MARGIN, y, size: 8.5, font: bold, color: MUTED });
    const lines = wrap(value, regular, 9.5, CONTENT_W - 130);
    lines.forEach((line, i) => {
      page.drawText(line, { x: MARGIN + 130, y: y - i * 13, size: 9.5, font: regular, color: INK });
    });
    y -= Math.max(1, lines.length) * 13 + 4;
  }

  heading("Project summary");
  text(project.summary, { gap: 4 });

  heading("Key interventions & deliverables");
  for (const item of project.keyInterventions) {
    page.drawCircle({ x: MARGIN + 3, y: y + 3, size: 1.8, color: BRAND });
    text(item, { indent: 12, gap: 3 });
  }

  heading("Headline impact");
  const impactLines = wrap(project.impactMetric, bold, 11, CONTENT_W - 24);
  const boxH = impactLines.length * 15 + 16;
  page.drawRectangle({ x: MARGIN, y: y - boxH + 12, width: CONTENT_W, height: boxH, color: rgb(0.99, 0.94, 0.94) });
  y -= 4;
  impactLines.forEach((line) => {
    page.drawText(line, { x: MARGIN + 12, y, size: 11, font: bold, color: INK });
    y -= 15;
  });

  // Footer
  const hq = siteConfig.offices?.[0];
  page.drawLine({ start: { x: MARGIN, y: 64 }, end: { x: PAGE_W - MARGIN, y: 64 }, thickness: 0.6, color: RULE });
  const footer = [
    `Life Helpers Initiative (LHI) | ${siteConfig.url.replace(/^https?:\/\//, "")} | ${hq?.email ?? "official@lhinigeria.org"} | ${hq?.phone ?? ""}`,
    `Prepared for donor compliance, M&E reporting and consortium proposals. Generated ${new Date().toISOString().slice(0, 10)}.`,
  ];
  footer.forEach((line, i) => {
    page.drawText(sanitize(line), { x: MARGIN, y: 48 - i * 12, size: 7.5, font: regular, color: MUTED });
  });

  return doc.save();
}
