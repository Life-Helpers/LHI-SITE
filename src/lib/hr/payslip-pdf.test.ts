import { readFileSync } from "node:fs";
import path from "node:path";

import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";

import { pdfAmount, payslipFileName, payslipPdf } from "@/lib/hr/payslip-pdf";
import type { HrPayslip } from "@/lib/hr/types";

const slip: HrPayslip = {
  id: "s1",
  employeeId: "e1",
  month: "2026-10",
  status: "published",
  employee: { name: "Aisha Bello", staffNumber: "LHI-001", jobTitle: "Programme Manager", department: "Programmes", bankName: "First Bank", bankAccountEnding: "4321" },
  earnings: [
    { name: "Basic salary", amount: 450000 },
    { name: "Housing allowance", amount: 180000 },
  ],
  deductions: [{ name: "PAYE tax", amount: 61234.5 }],
  gross: 630000,
  totalDeductions: 61234.5,
  net: 568765.5,
  preparedByName: "Halima Admin",
  createdAt: "2026-10-26T10:00:00Z",
  publishedAt: "2026-10-27T10:00:00Z",
  payDate: "2026-10-30",
};

describe("payslip PDF", () => {
  it("is a one-page A4 PDF with the logo, titled for the person and month", async () => {
    const bytes = await payslipPdf(slip, readFileSync(path.join(process.cwd(), "public", "logo.png")));
    expect(Buffer.from(bytes.slice(0, 5)).toString()).toBe("%PDF-");
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    expect(doc.getTitle()).toBe("Payslip October 2026 - Aisha Bello");
    expect(Math.round(doc.getPage(0).getWidth())).toBe(595);
  });

  it("works without a logo, writes amounts the standard fonts can show, and names the file", async () => {
    expect((await payslipPdf({ ...slip, status: "draft" })).length).toBeGreaterThan(1000);
    expect(pdfAmount(568765.5)).toBe("NGN 568,765.50");
    expect(payslipFileName(slip)).toBe("payslip-2026-10-aisha-bello.pdf");
  });
});
