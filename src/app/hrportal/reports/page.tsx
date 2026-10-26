import { CalendarCheck, CalendarClock, UserPlus, Users } from "lucide-react";

import { OrgAnalytics } from "@/components/hr/analytics-panels";
import { PortalShell } from "@/components/hr/portal-shell";
import { Notice, PageTitle, TintStat, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { requireHrPage } from "@/lib/hr/session";
import { isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports" };

/** Organisation-wide figures for management. Totals only: no individual's details. */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage("reports.view");
  const { denied } = await searchParams;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const active = employees.filter((e) => isCurrentStaff(e));
  const today = todayLagos();
  const year = today.slice(0, 4);
  const onLeaveToday = new Set(leave.filter((l) => l.status === "approved" && l.startDate <= today && l.endDate >= today).map((l) => l.employeeId)).size;
  const startersThisYear = active.filter((e) => e.startDate.startsWith(year)).length;

  return (
    <PortalShell ctx={ctx} current="/hrportal/reports" crumbs={[{ label: "Reports" }]}>
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="Reports" subtitle={`LHI-wide workforce and leave analytics, ${year}. Totals only: no one's personal details.`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TintStat tint="blue" icon={Users} label="Active staff" value={active.length} />
        <TintStat tint="green" icon={UserPlus} label={`Started in ${year}`} value={startersThisYear} />
        <TintStat tint="teal" icon={CalendarCheck} label="On leave today" value={onLeaveToday} />
        <TintStat tint="amber" icon={CalendarClock} label="Leave requests pending" value={leave.filter((l) => l.status === "pending").length} />
      </div>
      <OrgAnalytics employees={employees} leave={leave} types={ctx.leaveTypes} departments={ctx.departments} today={today} showPeople showLeave />
    </PortalShell>
  );
}
