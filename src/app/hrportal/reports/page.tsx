import { PortalShell } from "@/components/hr/portal-shell";
import { CalendarCheck, CalendarClock, UserPlus, Users } from "lucide-react";

import { Card, Notice, PageTitle, Table, TintStat } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { requireHrPage } from "@/lib/hr/session";
import { LEAVE_TYPES } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports" };

const countBy = <T,>(rows: T[], key: (r: T) => string) => {
  const map = new Map<string, number>();
  for (const r of rows) map.set(key(r) || "Not recorded", (map.get(key(r) || "Not recorded") ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
};

/** Organisation-wide figures for management. Totals only: no individual's details. */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage("reports.view");
  const { denied } = await searchParams;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const active = employees.filter((e) => e.status === "active");
  const year = new Date().getFullYear();
  const thisYear = leave.filter((l) => l.startDate.startsWith(String(year)));
  const approved = thisYear.filter((l) => l.status === "approved");
  const today = new Date().toISOString().slice(0, 10);
  const onLeaveToday = new Set(approved.filter((l) => l.startDate <= today && l.endDate >= today).map((l) => l.employeeId)).size;
  const startersThisYear = active.filter((e) => e.startDate.startsWith(String(year))).length;

  return (
    <PortalShell ctx={ctx} current="/hrportal/reports" crumbs={[{ label: "Reports" }]}>
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="Reports" subtitle={`LHI-wide figures, ${year}. Totals only.`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TintStat tint="blue" icon={Users} label="Active staff" value={active.length} />
        <TintStat tint="green" icon={UserPlus} label={`Started in ${year}`} value={startersThisYear} />
        <TintStat tint="teal" icon={CalendarCheck} label="On leave today" value={onLeaveToday} />
        <TintStat tint="amber" icon={CalendarClock} label="Leave requests pending" value={leave.filter((l) => l.status === "pending").length} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Headcount by department">
          <Table head={["Department", "Staff"]} empty={active.length === 0 && "No staff records yet."}>
            {countBy(active, (e) => e.department).map(([k, n]) => (
              <tr key={k}>
                <td className="px-3 py-2">{k}</td>
                <td className="px-3 py-2 font-semibold">{n}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title="Headcount by duty station">
          <Table head={["Duty station", "Staff"]} empty={active.length === 0 && "No staff records yet."}>
            {countBy(active, (e) => e.location).map(([k, n]) => (
              <tr key={k}>
                <td className="px-3 py-2">{k}</td>
                <td className="px-3 py-2 font-semibold">{n}</td>
              </tr>
            ))}
          </Table>
        </Card>
        <Card title={`Approved leave in ${year}`}>
          <Table head={["Type", "Requests", "Working days"]}>
            {LEAVE_TYPES.map((t) => {
              const rows = approved.filter((l) => l.type === t);
              return (
                <tr key={t}>
                  <td className="px-3 py-2">{t}</td>
                  <td className="px-3 py-2">{rows.length}</td>
                  <td className="px-3 py-2 font-semibold">{rows.reduce((n, l) => n + l.days, 0)}</td>
                </tr>
              );
            })}
          </Table>
        </Card>
        <Card title="Staff who have left">
          <p className="text-3xl font-bold">{employees.filter((e) => e.status === "left").length}</p>
          <p className="mt-1 text-sm text-admin-muted">Records kept, marked as left.</p>
        </Card>
      </div>
    </PortalShell>
  );
}
