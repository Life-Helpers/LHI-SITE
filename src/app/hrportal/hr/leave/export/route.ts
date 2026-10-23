import { readStore } from "@/lib/cms/store";
import { toCsv } from "@/lib/cms/csv";
import { has } from "@/lib/hr/access";
import { loadHrSession } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";

/** CSV of leave applications, for HR. Same filters as the Leave page; checked on the server. */
export async function GET(req: Request) {
  const state = await loadHrSession();
  if (state.status !== "ok" || !(has(state.ctx.permissions, "leave.view_all") || has(state.ctx.permissions, "leave.manage"))) {
    return new Response("Not found", { status: 404 });
  }
  const url = new URL(req.url);
  const tab = url.searchParams.get("tab") ?? "all";
  const emp = url.searchParams.get("emp") ?? "";
  const type = url.searchParams.get("type") ?? "";
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const byId = new Map(employees.map((e) => [e.id, e]));
  const rows = leave
    .filter((l) => (tab === "all" || l.status === tab) && (!emp || l.employeeId === emp) && (!type || l.type === type))
    .filter((l) => !q || [employeeName(byId.get(l.employeeId)), byId.get(l.employeeId)?.email ?? "", l.type, l.reason].some((v) => v.toLowerCase().includes(q)))
    .sort((a, b) => b.startDate.localeCompare(a.startDate));
  const csv = toCsv(
    ["Employee", "Email", "Department", "Leave type", "Start date", "End date", "Working days", "Status", "Reason", "Decided by", "Decided on", "Note", "Applied on"],
    rows.map((l) => {
      const e = byId.get(l.employeeId);
      return [employeeName(e), e?.email, e?.department, l.type, l.startDate, l.endDate, l.days, l.status, l.reason, l.decidedByName, l.decidedAt?.slice(0, 10), l.decisionNote, l.createdAt.slice(0, 10)];
    }),
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lhi-leave-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
