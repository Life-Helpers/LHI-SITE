import Link from "next/link";
import { notFound } from "next/navigation";

import { LeaveTable } from "@/components/hr/leave-parts";
import { PortalShell } from "@/components/hr/portal-shell";
import { Card, fmtDate, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave, canViewEmployee, has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Team member" };

/**
 * One team member's work details and leave. Changing the id in the address doesn't help:
 * anyone outside the manager's reporting line is simply "not found".
 */
export default async function TeamMemberPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const ctx = await requireHrPage("team.view");
  const { employeeId } = await params;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const person = employees.find((e) => e.id === employeeId);
  if (!person || person.id === ctx.employee.id || !canViewEmployee(ctx.actor, person.id, employees)) notFound();
  const manager = employees.find((e) => e.id === person.managerId);
  const theirLeave = leave.filter((l) => l.employeeId === person.id).sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <PortalShell ctx={ctx} current="/hrportal/team">
      <Link href="/hrportal/team" className="text-sm text-admin-primary hover:underline">
        ← My team
      </Link>
      <div className="mt-3">
        <PageTitle title={employeeName(person)} subtitle={person.jobTitle} />
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
              ["Annual leave", `${person.annualLeaveDays} days`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-admin-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <div className="lg:col-span-2">
          <Card title="Leave">
            <LeaveTable rows={theirLeave} canDecide={(l) => has(ctx.permissions, "team.leave.approve") && canDecideLeave(ctx.actor, l, employees)} />
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
