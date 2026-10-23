import Link from "next/link";

import { PortalShell } from "@/components/hr/portal-shell";
import { Card, Notice, PageTitle, Stat } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "HR overview" };

export default async function HrOverviewPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage(["employees.view", "employees.manage", "accounts.manage"]);
  const { denied } = await searchParams;
  const [employees, accounts, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts"), readStore("hrLeave")]);
  const active = employees.filter((e) => e.status === "active");
  const withoutAccount = active.filter((e) => !accounts.some((a) => a.employeeId === e.id));
  const p = ctx.permissions;

  const links = [
    { href: "/hrportal/hr/employees", label: "Employee records", text: "Add staff, edit records and reporting lines.", show: has(p, "employees.view") || has(p, "employees.manage") },
    { href: "/hrportal/hr/accounts", label: "Portal accounts", text: "Create, deactivate and reactivate accounts; assign roles.", show: has(p, "accounts.manage") },
    { href: "/hrportal/hr/roles", label: "Roles & permissions", text: "Built-in and custom roles.", show: has(p, "roles.manage") },
    { href: "/hrportal/hr/leave", label: "Leave", text: "All leave requests and decisions.", show: has(p, "leave.view_all") || has(p, "leave.manage") },
    { href: "/hrportal/hr/audit", label: "Audit trail", text: "Every account, role and permission change.", show: has(p, "audit.view") },
    { href: "/hrportal/reports", label: "Reports", text: "Headcount and leave across LHI.", show: has(p, "reports.view") },
  ].filter((l) => l.show);

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr">
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="HR overview" subtitle="Organisation-wide HR operations" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active employees" value={active.length} />
        <Stat label="Active portal accounts" value={accounts.filter((a) => a.active && a.passwordHash).length} />
        {has(p, "accounts.manage") && <Stat label="Invites not yet used" value={accounts.filter((a) => a.active && !a.passwordHash).length} />}
        {(has(p, "leave.view_all") || has(p, "leave.manage")) && <Stat label="Leave awaiting decision" value={leave.filter((l) => l.status === "pending").length} />}
      </div>
      {has(p, "accounts.manage") && withoutAccount.length > 0 && (
        <p className="mt-4 text-sm text-admin-muted">
          {withoutAccount.length} active employee{withoutAccount.length === 1 ? " has" : "s have"} no portal account yet.{" "}
          <Link href="/hrportal/hr/accounts" className="font-semibold text-admin-primary hover:underline">
            Create accounts
          </Link>
        </p>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block rounded-2xl border border-admin-border bg-admin-card p-5 hover:border-admin-primary">
            <p className="font-semibold text-admin-text">{l.label}</p>
            <p className="mt-1 text-sm text-admin-muted">{l.text}</p>
          </Link>
        ))}
      </div>
      {has(p, "self.view") && (
        <div className="mt-6">
          <Card>
            <p className="text-sm">
              Your own record and leave are under{" "}
              <Link href="/hrportal/me" className="font-semibold text-admin-primary hover:underline">
                My record
              </Link>
              .
            </p>
          </Card>
        </div>
      )}
    </PortalShell>
  );
}
