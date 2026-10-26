/**
 * A payslip as a PDF, laid out like the on-screen payslip. The standard PDF fonts have no naira
 * sign, so amounts are written "NGN 1,234.00".
 */
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";

import { payMonthLabel } from "@/lib/hr/payroll";
import type { HrPayslip } from "@/lib/hr/types";

const AMOUNT = new Intl.NumberFormat("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pdfAmount = (n: number) => `NGN ${AMOUNT.format(n)}`;

const INK = rgb(0.11, 0.13, 0.16);
const MUTED = rgb(0.42, 0.45, 0.5);
const LINE = rgb(0.86, 0.88, 0.9);
const BRAND = rgb(0.06, 0.6, 0.42);
const SOFT = rgb(0.9, 0.97, 0.94);

/** The file name people get, e.g. "payslip-2026-10-aisha-bello.pdf". */
export const payslipFileName = (slip: Pick<HrPayslip, "month" | "employee">) =>
  `payslip-${slip.month}-${slip.employee.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "employee"}.pdf`;

export async function payslipPdf(slip: HrPayslip, logo?: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Payslip ${payMonthLabel(slip.month)} - ${slip.employee.name}`);
  doc.setAuthor("Life Helpers Initiative");
  doc.setSubject("Payslip (confidential)");
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const left = 48;
  const right = 595.28 - 48;
  const text = (p: PDFPage, s: string, x: number, y: number, size = 10, f: PDFFont = font, color = INK) => p.drawText(s, { x, y, size, font: f, color });
  const textRight = (p: PDFPage, s: string, x: number, y: number, size = 10, f: PDFFont = font, color = INK) => text(p, s, x - f.widthOfTextAtSize(s, size), y, size, f, color);
  const rule = (y: number) => page.drawLine({ start: { x: left, y }, end: { x: right, y }, thickness: 0.8, color: LINE });

  // Header: logo left, title and month right.
  let y = 841.89 - 56;
  if (logo) {
    const img = await doc.embedPng(logo);
    const h = 36;
    page.drawImage(img, { x: left, y: y - h + 12, width: (img.width / img.height) * h, height: h });
  } else {
    text(page, "Life Helpers Initiative", left, y - 8, 14, bold);
  }
  textRight(page, "Payslip", right, y, 18, bold);
  textRight(page, payMonthLabel(slip.month), right, y - 18, 11, font, MUTED);
  if (slip.status === "draft") textRight(page, "DRAFT: not yet published", right, y - 34, 9, bold, rgb(0.7, 0.45, 0.05));
  y -= 50;
  rule(y);

  // Who and where the money goes.
  const details: [string, string][] = [
    ["Employee", slip.employee.name],
    ["Staff number", slip.employee.staffNumber || "-"],
    ["Job title", slip.employee.jobTitle || "-"],
    ["Department", slip.employee.department || "-"],
    ["Bank", slip.employee.bankName || "-"],
    ["Account", slip.employee.bankAccountEnding ? `******${slip.employee.bankAccountEnding}` : "-"],
    ["Pay date", slip.payDate ?? "-"],
    ["Pay period", payMonthLabel(slip.month)],
  ];
  y -= 22;
  details.forEach(([k, v], i) => {
    const x = i % 2 === 0 ? left : left + (right - left) / 2;
    const rowY = y - Math.floor(i / 2) * 30;
    text(page, k, x, rowY, 8.5, font, MUTED);
    text(page, v.slice(0, 48), x, rowY - 12, 10.5, bold);
  });
  y -= Math.ceil(details.length / 2) * 30 + 4;
  rule(y);

  // Earnings and deductions side by side.
  const mid = left + (right - left) / 2;
  y -= 24;
  page.drawRectangle({ x: left, y: y - 6, width: right - left, height: 20, color: rgb(0.96, 0.97, 0.98) });
  text(page, "Earnings", left + 8, y, 9, bold, MUTED);
  textRight(page, "Amount", mid - 8, y, 9, bold, MUTED);
  text(page, "Deductions", mid + 8, y, 9, bold, MUTED);
  textRight(page, "Amount", right - 8, y, 9, bold, MUTED);
  const rows = Math.max(slip.earnings.length, slip.deductions.length);
  for (let i = 0; i < rows; i++) {
    y -= 22;
    const e = slip.earnings[i];
    const d = slip.deductions[i];
    if (e) {
      text(page, e.name.slice(0, 34), left + 8, y);
      textRight(page, pdfAmount(e.amount), mid - 8, y);
    }
    if (d) {
      text(page, d.name.slice(0, 34), mid + 8, y);
      textRight(page, pdfAmount(d.amount), right - 8, y);
    }
    page.drawLine({ start: { x: left, y: y - 8 }, end: { x: right, y: y - 8 }, thickness: 0.5, color: LINE });
  }
  y -= 22;
  text(page, "Gross pay", left + 8, y, 10, bold);
  textRight(page, pdfAmount(slip.gross), mid - 8, y, 10, bold);
  text(page, "Total deductions", mid + 8, y, 10, bold);
  textRight(page, pdfAmount(slip.totalDeductions), right - 8, y, 10, bold);
  page.drawLine({ start: { x: mid, y: y - 8 }, end: { x: mid, y: y + 22 * (rows + 1) + 6 }, thickness: 0.5, color: LINE });

  // Net pay band.
  y -= 40;
  page.drawRectangle({ x: left, y: y - 10, width: right - left, height: 34, color: SOFT, borderColor: BRAND, borderWidth: 0.6 });
  text(page, "Net pay", left + 12, y + 2, 12, bold);
  textRight(page, pdfAmount(slip.net), right - 12, y + 1, 15, bold);

  y -= 44;
  text(page, `Prepared by ${slip.preparedByName}${slip.publishedAt ? ` - issued ${slip.publishedAt.slice(0, 10)}` : ""}.`, left, y, 8.5, font, MUTED);
  text(page, "Life Helpers Initiative. This payslip is confidential.", left, y - 12, 8.5, font, MUTED);
  return doc.save();
}
