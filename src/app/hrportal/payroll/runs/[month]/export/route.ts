import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { loadHrSession } from "@/lib/hr/session";

const cell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** A run's payslips as CSV, for HR and Finance only (everyone else gets "not found"). */
export async function GET(_req: Request, { params }: { params: Promise<{ month: string }> }) {
  const state = await loadHrSession();
  if (state.status !== "ok" || !has(state.ctx.permissions, "payroll.manage")) return new Response("Not found", { status: 404 });
  const { month } = await params;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return new Response("Not found", { status: 404 });
  const slips = (await readStore("hrPayslips")).filter((p) => p.month === month).sort((a, b) => a.employee.name.localeCompare(b.employee.name));
  const deductionNames = [...new Set(slips.flatMap((p) => p.deductions.map((d) => d.name)))];
  const head = ["Employee", "Staff number", "Department", "Status", "Pay date", "Gross", ...deductionNames, "Total deductions", "Net", "Bank", "Account ending"];
  const rows = slips.map((p) => [
    p.employee.name,
    p.employee.staffNumber,
    p.employee.department,
    p.status,
    p.payDate ?? "",
    p.gross.toFixed(2),
    ...deductionNames.map((n) => (p.deductions.find((d) => d.name === n)?.amount ?? 0).toFixed(2)),
    p.totalDeductions.toFixed(2),
    p.net.toFixed(2),
    p.employee.bankName,
    p.employee.bankAccountEnding,
  ]);
  const csv = [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(`﻿${csv}\r\n`, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="payroll-${month}.csv"`, "cache-control": "no-store" },
  });
}
