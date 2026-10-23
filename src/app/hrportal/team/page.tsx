import { CalendarCheck, CalendarClock, UsersRound } from "lucide-react";

import { LeaveCalendar } from "@/components/hr/leave-calendar";
import { LeaveListing, type LeaveParams } from "@/components/hr/leave-listing";
import { PortalShell } from "@/components/hr/portal-shell";
import { isIsoDate, mondayOf } from "@/components/hr/query";
import { Notice, PageTitle, TintStat, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave, has, teamOf } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My team" };

/** A manager's team: everyone who reports to them, directly or through others. */
export default async function TeamPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage("team.view");
  const params = (await searchParams) as LeaveParams;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const teamIds = teamOf(ctx.employee.id, employees, ctx.departments);
  const team = employees.filter((e) => teamIds.has(e.id));
  const teamLeave = leave.filter((l) => teamIds.has(l.employeeId));
  const today = todayLagos();
  const pending = teamLeave.filter((l) => l.status === "pending").length;
  const away = new Set(teamLeave.filter((l) => l.status === "approved" && l.startDate <= today && l.endDate >= today).map((l) => l.employeeId)).size;
  const weekStart = mondayOf(isIsoDate(params.week) ? params.week : today);
  const memberHref = (id: string) => `/hrportal/team/${id}`;

  return (
    <PortalShell ctx={ctx} current="/hrportal/team" crumbs={[{ label: "My team" }]}>
      {params.denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="My team" subtitle="Staff who report to you, and staff in departments you head or approve leave for" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <TintStat tint="blue" icon={UsersRound} label="Team members" value={team.filter((e) => isCurrentStaff(e)).length} />
        <TintStat tint="amber" icon={CalendarClock} label="Leave awaiting decision" value={pending} note={has(ctx.permissions, "team.leave.approve") ? "You can approve or reject below" : undefined} />
        <TintStat tint="green" icon={CalendarCheck} label="On leave today" value={away} />
      </div>
      <LeaveCalendar employees={team} leave={teamLeave} weekStart={weekStart} basePath="/hrportal/team" params={params} personHref={memberHref} />
      <div className="mt-6">
        <LeaveListing
          rows={teamLeave}
          employees={employees}
          basePath="/hrportal/team"
          params={params}
          canDecide={(l) => has(ctx.permissions, "team.leave.approve") && canDecideLeave(ctx.actor, l, employees, ctx.departments)}
          viewHref={memberHref}
        />
      </div>
    </PortalShell>
  );
}
