import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { payrollSchedule } from "@/lib/hr/payroll-schedule";
import { loadHrSession } from "@/lib/hr/session";

const cell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** A run's payslips as CSV, for those who may see everyone's payslips (everyone else gets "not found"). */
export async function GET(_req: Request, { params }: { params: Promise<{ month: string }> }) {
  const state = await loadHrSession();
  if (state.status !== "ok" || !has(state.ctx.permissions, "payroll.payslips.view")) return new Response("Not found", { status: 404 });
  const { month } = await params;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return new Response("Not found", { status: 404 });
  const slips = (await readStore("hrPayslips")).filter((p) => p.month === month).sort((a, b) => a.employee.name.localeCompare(b.employee.name));
  // LHI's payroll schedule layout, with a totals row.
  const { columns, rows, totals } = payrollSchedule(slips);
  const head = ["Staff Name", "Position", ...columns.map((c) => c.label), "Status", "Pay Date", "Bank", "Account Ending"];
  const body = [
    ...rows.map((r, i) => [r.name, r.position, ...columns.map((c) => (r.values[c.key] ?? 0).toFixed(2)), slips[i].status, slips[i].payDate ?? "", slips[i].employee.bankName, slips[i].employee.bankAccountEnding]),
    ["Total", "", ...columns.map((c) => totals[c.key].toFixed(2)), "", "", "", ""],
  ];
  const csv = [head, ...body].map((r) => r.map(cell).join(",")).join("\r\n");
  return new Response(`﻿${csv}\r\n`, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="payroll-schedule-${month}.csv"`, "cache-control": "no-store" },
  });
}
