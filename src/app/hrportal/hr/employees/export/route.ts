import { readStore } from "@/lib/cms/store";
import { toCsv } from "@/lib/cms/csv";
import { has } from "@/lib/hr/access";
import { loadHrSession } from "@/lib/hr/session";
import { employeeName, statusLabel } from "@/lib/hr/types";

export const dynamic = "force-dynamic";

/** CSV of employee work records (no home address, birthday or emergency contacts), for HR. */
export async function GET(req: Request) {
  const state = await loadHrSession();
  if (state.status !== "ok" || !(has(state.ctx.permissions, "employees.view") || has(state.ctx.permissions, "employees.manage"))) {
    return new Response("Not found", { status: 404 });
  }
  const url = new URL(req.url);
  const tab = url.searchParams.get("tab") ?? "all";
  const branch = url.searchParams.get("branch") ?? "";
  const dept = url.searchParams.get("dept") ?? "";
  const role = url.searchParams.get("role") ?? "";
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const [employees, accounts] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts")]);
  const rows = employees
    .filter((e) => (tab === "all" || e.status === tab) && (!branch || e.location === branch) && (!dept || e.department === dept) && (!role || e.jobTitle === role))
    .filter((e) => !q || [employeeName(e), e.email, e.jobTitle, e.department, e.location, e.staffNumber].some((v) => v.toLowerCase().includes(q)))
    .sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const nameOf = (id: string | null) => (id ? employeeName(employees.find((e) => e.id === id)) : "");
  const csv = toCsv(
    ["Staff number", "First name", "Last name", "Email", "Phone", "Job title", "Department", "Duty station", "Line manager", "Start date", "Status", "Login"],
    rows.map((e) => {
      const a = accounts.find((x) => x.employeeId === e.id);
      return [e.staffNumber, e.firstName, e.lastName, e.email, e.phone, e.jobTitle, e.department, e.location, nameOf(e.managerId), e.startDate, statusLabel(e.status), !a ? "None" : !a.active ? "Locked" : a.passwordHash ? "Active" : "Invited"];
    }),
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lhi-employees-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
