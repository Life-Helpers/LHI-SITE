import Link from "next/link";

import { createEmployeeAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { EmployeeFields } from "@/components/hr/employee-form";
import { PortalShell } from "@/components/hr/portal-shell";
import { Badge, Card, inputClass, PageTitle, Table } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Employees" };

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const ctx = await requireHrPage(["employees.view", "employees.manage"]);
  const { q = "", status = "active" } = await searchParams;
  const [employees, accounts] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts")]);
  const needle = q.trim().toLowerCase();
  const rows = employees
    .filter((e) => (status === "all" ? true : e.status === status))
    .filter((e) => !needle || [employeeName(e), e.email, e.jobTitle, e.department, e.location, e.staffNumber].some((v) => v.toLowerCase().includes(needle)))
    .sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const nameOf = (id: string | null) => (id ? employeeName(employees.find((e) => e.id === id)) : "—");

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/employees">
      <PageTitle title="Employees" subtitle={`${employees.filter((e) => e.status === "active").length} active employees`} />
      <form className="mb-4 flex flex-wrap gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Search name, email, title, department…" aria-label="Search employees" className={`${inputClass} mt-0 max-w-sm`} />
        <select name="status" defaultValue={status} aria-label="Status" className={`${inputClass} mt-0 w-auto`}>
          <option value="active">Active</option>
          <option value="left">Left</option>
          <option value="all">All</option>
        </select>
        <button className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold">Filter</button>
      </form>
      <Card>
        <Table head={["Name", "Job title", "Department", "Duty station", "Reports to", "Portal", "Status"]} empty={rows.length === 0 && "No employees match."}>
          {rows.map((e) => {
            const account = accounts.find((a) => a.employeeId === e.id);
            return (
              <tr key={e.id}>
                <td className="px-3 py-3 font-medium">
                  <Link href={`/hrportal/hr/employees/${e.id}`} className="text-admin-primary hover:underline">
                    {employeeName(e)}
                  </Link>
                </td>
                <td className="px-3 py-3">{e.jobTitle || "—"}</td>
                <td className="px-3 py-3">{e.department || "—"}</td>
                <td className="px-3 py-3">{e.location || "—"}</td>
                <td className="px-3 py-3">{nameOf(e.managerId)}</td>
                <td className="px-3 py-3">
                  {account ? <Badge status={!account.active ? "inactive" : account.passwordHash ? "active" : "invited"} /> : <span className="text-xs text-admin-muted">None</span>}
                </td>
                <td className="px-3 py-3">
                  <Badge status={e.status} />
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
      {has(ctx.permissions, "employees.manage") && (
        <div className="mt-6">
          <Card title="Add an employee">
            <ActionForm action={createEmployeeAction} submitLabel="Add employee" resetOnSuccess className="space-y-4">
              <EmployeeFields managers={employees} />
            </ActionForm>
          </Card>
        </div>
      )}
    </PortalShell>
  );
}
