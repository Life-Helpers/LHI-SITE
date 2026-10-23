import Link from "next/link";

import { LeaveTable } from "@/components/hr/leave-parts";
import { PortalShell } from "@/components/hr/portal-shell";
import { Card, Notice, PageTitle, Stat, Table } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave, has, reportsOf } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My team" };

/** A manager's team: everyone who reports to them, directly or through others. */
export default async function TeamPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage("team.view");
  const { denied } = await searchParams;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const teamIds = reportsOf(ctx.employee.id, employees);
  const team = employees.filter((e) => teamIds.has(e.id) && e.status === "active").sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const nameOf = (id: string) => employeeName(employees.find((e) => e.id === id));
  const teamLeave = leave.filter((l) => teamIds.has(l.employeeId));
  const pending = teamLeave.filter((l) => l.status === "pending");
  const today = new Date().toISOString().slice(0, 10);
  const away = teamLeave.filter((l) => l.status === "approved" && l.startDate <= today && l.endDate >= today);

  return (
    <PortalShell ctx={ctx} current="/hrportal/team">
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="My team" subtitle="Staff who report to you, directly or through others" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Team members" value={team.length} />
        <Stat label="Leave awaiting decision" value={pending.length} />
        <Stat label="On leave today" value={away.length} />
      </div>

      {has(ctx.permissions, "team.leave.approve") && (
        <div className="mt-6">
          <Card title="Leave awaiting your decision">
            <LeaveTable rows={pending} who={nameOf} canDecide={(l) => canDecideLeave(ctx.actor, l, employees)} empty="Nothing waiting for you." />
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Card title="Team members">
          <Table head={["Name", "Job title", "Duty station", "Reports to"]} empty={team.length === 0 && "Nobody reports to you in the HR records yet."}>
            {team.map((e) => (
              <tr key={e.id}>
                <td className="px-3 py-3 font-medium">
                  <Link href={`/hrportal/team/${e.id}`} className="text-admin-primary hover:underline">
                    {employeeName(e)}
                  </Link>
                </td>
                <td className="px-3 py-3">{e.jobTitle || "—"}</td>
                <td className="px-3 py-3">{e.location || "—"}</td>
                <td className="px-3 py-3">{e.managerId === ctx.employee.id ? "You" : nameOf(e.managerId ?? "")}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Team leave history">
          <LeaveTable rows={teamLeave.filter((l) => l.status !== "pending").slice(0, 50)} who={nameOf} empty="No decided leave yet." />
        </Card>
      </div>
    </PortalShell>
  );
}
