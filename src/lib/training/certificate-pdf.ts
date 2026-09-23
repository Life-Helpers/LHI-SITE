import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

import { siteConfig } from "@/config/site";
import type { Certificate } from "@/lib/cms/schema";

const RED = rgb(0xeb / 255, 0x16 / 255, 0x1c / 255);
const ORANGE = rgb(0xc0 / 255, 0x57 / 255, 0x09 / 255);
const INK = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.42, 0.42, 0.46);

const clean = (t: string) =>
  t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");

/** A4 landscape completion certificate. */
export async function buildCertificatePdf(cert: Certificate): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${clean(cert.courseTitle)} - Certificate ${cert.id}`);
  doc.setAuthor("Life Helpers Initiative");
  const W = 841.89;
  const H = 595.28;
  const page = doc.addPage([W, H]);
  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const center = (text: string, y: number, font: typeof sans, size: number, color = INK) => {
    const t = clean(text);
    page.drawText(t, { x: (W - font.widthOfTextAtSize(t, size)) / 2, y, size, font, color });
  };

  // Frame
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(1, 0.985, 0.975) });
  page.drawRectangle({ x: 22, y: 22, width: W - 44, height: H - 44, borderColor: RED, borderWidth: 3 });
  page.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: ORANGE, borderWidth: 0.8 });
  page.drawRectangle({ x: 22, y: H - 30, width: W - 44, height: 8, color: RED });

  try {
    const logo = await doc.embedPng(await readFile(path.join(process.cwd(), "public", "logo.png")));
    const h = 46;
    const w = (logo.width / logo.height) * h;
    page.drawImage(logo, { x: (W - w) / 2, y: H - 110, width: w, height: h });
  } catch {
    center("LIFE HELPERS INITIATIVE", H - 95, sansBold, 18, RED);
  }

  center("CERTIFICATE OF COMPLETION", H - 160, sansBold, 13, ORANGE);
  center("This certifies that", H - 200, serifItalic, 15, MUTED);
  center(cert.name, H - 250, serif, 40, INK);
  page.drawLine({ start: { x: W / 2 - 200, y: H - 262 }, end: { x: W / 2 + 200, y: H - 262 }, thickness: 0.8, color: RED });
  center("has successfully completed the Life Helpers Initiative humanitarian training course", H - 292, serifItalic, 14, MUTED);
  center(cert.courseTitle, H - 326, sansBold, 20, INK);
  center(
    `with a final assessment score of ${cert.score}%, awarded on ${new Date(cert.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`,
    H - 352,
    serif,
    13,
    MUTED,
  );

  // Signatures (typed names)
  const sig = (x: number, name: string, role: string) => {
    page.drawLine({ start: { x, y: 128 }, end: { x: x + 210, y: 128 }, thickness: 0.8, color: INK });
    page.drawText(clean(name), { x, y: 112, size: 11, font: sansBold, color: INK });
    page.drawText(clean(role), { x, y: 98, size: 8.5, font: sans, color: MUTED });
  };
  sig(90, "Hadiza Ibrahim Yaro", "Director, Safeguarding, Accountability & Gender");
  sig(W - 300, "Tayo Fatinikun", "Executive Director");

  const verify = `${siteConfig.url.replace(/\/$/, "")}/get-involved/training/verify/${cert.id}`;
  // QR code to the public verification page, between the signatures.
  const qr = await doc.embedPng(await QRCode.toBuffer(verify, { errorCorrectionLevel: "M", margin: 1, width: 240, color: { dark: "#1f1f24", light: "#fffbf8" } }));
  page.drawImage(qr, { x: (W - 62) / 2, y: 86, width: 62, height: 62 });
  center("Scan to verify", 79, sans, 7, MUTED);
  center(`Certificate ID: ${cert.id}`, 66, sansBold, 9, INK);
  center(`Verify at ${verify}`, 54, sans, 8, MUTED);
  center("Putting A Smile On A Face", 41, serifItalic, 9, RED);

  return doc.save();
}
