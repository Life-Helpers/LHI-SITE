import Link from "next/link";
import { Eye, Search } from "lucide-react";

import { createEmployeeAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { EmployeeFields } from "@/components/hr/employee-form";
import { AutoSubmitSelect } from "@/components/hr/filters";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { hrefWith } from "@/components/hr/query";
import { Badge, Card, fmtDate, inputClass, PageTitle, Person, Table } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Employees" };

const PER = 20;

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage(["employees.view", "employees.manage"]);
  const params = await searchParams;
  const { q = "", dept = "", status = "active" } = params;
  const [employees, accounts] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts")]);
  const needle = q.trim().toLowerCase();
  const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))].sort();
  const rows = employees
    .filter((e) => (status === "all" ? true : e.status === status))
    .filter((e) => !dept || e.department === dept)
    .filter((e) => !needle || [employeeName(e), e.email, e.jobTitle, e.department, e.location, e.staffNumber].some((v) => v.toLowerCase().includes(needle)))
    .sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const page = Math.min(pages, Math.max(1, Number(params.page) || 1));
  const shown = rows.slice((page - 1) * PER, page * PER);
  const nameOf = (id: string | null) => (id ? employeeName(employees.find((e) => e.id === id)) : "—");

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/employees" crumbs={[{ label: "HR" }, { label: "Employees" }]}>
      <PageTitle
        title="Employees"
        subtitle={`${employees.filter((e) => e.status === "active").length} active employees`}
        actions={
          has(ctx.permissions, "employees.manage") && (
            <Modal label="Add Employee" title="Add an employee" description="Create the employee record. Portal access is a separate step under Accounts." wide>
              <ActionForm action={createEmployeeAction} submitLabel="Add employee" resetOnSuccess className="space-y-4">
                <EmployeeFields managers={employees} />
              </ActionForm>
            </Modal>
          )
        }
      />
      <Card flush>
        <form className="flex flex-wrap items-center gap-3 px-4 py-4" role="search">
          <span className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
            <input name="q" defaultValue={q} placeholder="Search name, email, title…" aria-label="Search employees" className={`${inputClass} mt-0 max-w-64 pl-9`} />
          </span>
          <AutoSubmitSelect name="dept" defaultValue={dept} aria-label="Department" className={`${inputClass} mt-0 max-w-56`}>
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </AutoSubmitSelect>
          <AutoSubmitSelect name="status" defaultValue={status} aria-label="Status" className={`${inputClass} mt-0 max-w-36`}>
            <option value="active">Active</option>
            <option value="left">Left</option>
            <option value="all">All</option>
          </AutoSubmitSelect>
          <button className="ml-auto rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-bg">Filter</button>
        </form>
        <Table head={["Employee", "Job Title", "Department", "Duty Station", "Reports To", "Joined", "Portal", "Status", ""]} empty={shown.length === 0 && "No employees match."}>
          {shown.map((e) => {
            const account = accounts.find((a) => a.employeeId === e.id);
            return (
              <tr key={e.id} className="hover:bg-admin-bg/60">
                <td className="px-4 py-3">
                  <Person name={employeeName(e)} sub={e.email || e.staffNumber} href={`/hrportal/hr/employees/${e.id}`} />
                </td>
                <td className="px-4 py-3">{e.jobTitle || "—"}</td>
                <td className="px-4 py-3">{e.department || "—"}</td>
                <td className="px-4 py-3">{e.location || "—"}</td>
                <td className="px-4 py-3">{nameOf(e.managerId)}</td>
                <td className="whitespace-nowrap px-4 py-3">{fmtDate(e.startDate)}</td>
                <td className="px-4 py-3">
                  {account ? <Badge status={!account.active ? "inactive" : account.passwordHash ? "active" : "invited"} /> : <span className="text-xs text-admin-muted">None</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge status={e.status} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/hrportal/hr/employees/${e.id}`} aria-label={`Open ${employeeName(e)}`} className="inline-flex rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                    <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </Table>
        <div className="flex items-center justify-between border-t border-admin-border px-4 py-3 text-sm">
          <p className="text-admin-muted">{rows.length === 0 ? "No results" : `Showing ${(page - 1) * PER + 1} to ${Math.min(page * PER, rows.length)} of ${rows.length} results`}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={hrefWith("/hrportal/hr/employees", params, { page: page - 1 })} className="rounded-lg border border-admin-border px-3 py-1.5 hover:bg-admin-bg">
                « Previous
              </Link>
            )}
            {page < pages && (
              <Link href={hrefWith("/hrportal/hr/employees", params, { page: page + 1 })} className="rounded-lg border border-admin-border px-3 py-1.5 hover:bg-admin-bg">
                Next »
              </Link>
            )}
          </div>
        </div>
      </Card>
    </PortalShell>
  );
}
