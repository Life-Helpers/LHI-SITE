import { readStore } from "@/lib/cms/store";
import { toCsv } from "@/lib/cms/csv";
import { has } from "@/lib/hr/access";
import { balanceSheet, balanceSheetCsv } from "@/lib/hr/balance-sheet";
import { loadHrSession } from "@/lib/hr/session";
import { employeeName, isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";

/** Leave balances as CSV, with the same filters as the table view; HR and auditors only. */
export async function GET(req: Request) {
  const state = await loadHrSession();
  if (state.status !== "ok" || !(has(state.ctx.permissions, "leave.view_all") || has(state.ctx.permissions, "leave.manage"))) {
    return new Response("Not found", { status: 404 });
  }
  const { ctx } = state;
  const url = new URL(req.url);
  const yearParam = Number(url.searchParams.get("year"));
  const year = yearParam >= 2000 && yearParam <= 2100 ? yearParam : new Date().getFullYear();
  const emp = url.searchParams.get("emp") ?? "";
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const typeParam = url.searchParams.get("type") ?? "all";
  const [employees, leave, policies, adjustments] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave"), readStore("hrLeavePolicies"), readStore("hrLeaveAdjustments")]);
  const staff = employees
    .filter(isCurrentStaff)
    .filter((e) => (!emp || e.id === emp) && (!q || [employeeName(e), e.staffNumber, e.department, e.jobTitle].some((v) => v.toLowerCase().includes(q))))
    .sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const types = ctx.leaveTypes.filter((t) => t.active);
  const detail = typeParam === "all" ? undefined : types.find((t) => t.id === typeParam);
  const { head, body } = balanceSheetCsv(balanceSheet(staff, year, ctx.leaveTypes, policies, leave, adjustments), types, detail);
  const name = `lhi-leave-balances-${year}${detail ? `-${detail.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : ""}.csv`;
  return new Response(toCsv(head, body), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store" },
  });
}
