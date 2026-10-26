import { notFound } from "next/navigation";

import { LeaveListing, type LeaveParams } from "@/components/hr/leave-listing";
import { PortalShell } from "@/components/hr/portal-shell";
import { Avatar, Card, fmtDate } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave, canManageApprovedLeave, canViewEmployee, has } from "@/lib/hr/access";
import { todayLagos } from "@/components/hr/ui";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team member" };

/**
 * One team member's work details and leave. Changing the id in the address doesn't help:
 * anyone outside the manager's reporting line is simply "not found".
 */
export default async function TeamMemberPage({ params, searchParams }: { params: Promise<{ employeeId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage("team.view");
  const { employeeId } = await params;
  const query = (await searchParams) as LeaveParams;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const person = employees.find((e) => e.id === employeeId);
  if (!person || person.id === ctx.employee.id || !canViewEmployee(ctx.actor, person.id, employees, ctx.departments)) notFound();
  const manager = employees.find((e) => e.id === person.managerId);
  const theirLeave = leave.filter((l) => l.employeeId === person.id);

  return (
    <PortalShell ctx={ctx} current="/hrportal/team" crumbs={[{ label: "My team", href: "/hrportal/team" }, { label: employeeName(person) }]}>
      <div className="mb-6 flex items-center gap-4">
        <Avatar name={employeeName(person)} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{employeeName(person)}</h1>
          <p className="text-sm text-admin-muted">{person.jobTitle || "Team member"}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Work details">
          <dl className="space-y-3 text-sm">
            {[
              ["Department", person.department || "—"],
              ["Duty station", person.location || "—"],
              ["Reports to", manager ? employeeName(manager) : "—"],
              ["Work email", person.email || "—"],
              ["Work phone", person.phone || "—"],
              ["Start date", fmtDate(person.startDate)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-admin-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <div className="lg:col-span-2">
          <LeaveListing leaveTypes={ctx.leaveTypes}
            rows={theirLeave}
            employees={employees}
            basePath={`/hrportal/team/${person.id}`}
            params={{ ...query, tab: query.tab ?? "all" }}
            showEmployee={false}
            canDecide={(l) => has(ctx.permissions, "team.leave.approve") && canDecideLeave(ctx.actor, l, employees, ctx.departments)}
            canManage={(l) => has(ctx.permissions, "team.leave.approve") && canManageApprovedLeave(ctx.actor, l, employees, ctx.departments)}
            today={todayLagos()}
          />
        </div>
      </div>
    </PortalShell>
  );
}
