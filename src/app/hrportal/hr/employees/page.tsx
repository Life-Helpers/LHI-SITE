import Link from "next/link";
import { CalendarDays, CircleCheck, CircleX, Clock3, Eye, FileDown, LayoutGrid, Pencil, Search, UserMinus, UserPlus } from "lucide-react";

import { createEmployeeAction, deleteEmployeeAction, importEmployeesAction, setAccountActiveAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { EmployeeFields } from "@/components/hr/employee-form";
import { AutoSubmitSelect } from "@/components/hr/filters";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { hrefWith } from "@/components/hr/query";
import { ChangePasswordModal } from "@/components/hr/password-panel";
import { QuickAction } from "@/components/hr/quick-action";
import { Tip } from "@/components/hr/tooltip";
import { Badge, Field, inputClass, outlineButtonClass, PageTitle, Person } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canManageAccount, has } from "@/lib/hr/access";
import { IMPORT_TEMPLATE } from "@/lib/hr/csv-import";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, isCurrentStaff, statusLabel, type HrAccount } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Employees" };

const TABS = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "active", label: "Active", icon: CircleCheck },
  { id: "inactive", label: "Inactive", icon: CircleX },
  { id: "probation", label: "Probation", icon: Clock3 },
  { id: "left", label: "Terminated", icon: UserMinus },
] as const;
const PER_PAGE = [10, 25, 50];

const loginState = (a?: HrAccount) => (!a ? { status: "none", label: "No login" } : !a.active ? { status: "inactive", label: "Locked" } : a.passwordHash ? { status: "active", label: "Active" } : { status: "invited", label: "Invited" });

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage(["employees.view", "employees.manage"]);
  const params = await searchParams;
  const tab = TABS.some((t) => t.id === params.tab) ? params.tab! : "all";
  const { q = "", branch = "", dept = "", role = "" } = params;
  const [employees, accounts] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts")]);
  const canManage = has(ctx.permissions, "employees.manage");
  const canAccounts = has(ctx.permissions, "accounts.manage");

  const distinct = (pick: (e: (typeof employees)[number]) => string) => [...new Set(employees.map(pick).filter(Boolean))].sort();
  const branches = distinct((e) => e.location);
  const departmentNames = distinct((e) => e.department);
  const designations = distinct((e) => e.jobTitle);
  const needle = q.trim().toLowerCase();
  const filtered = employees
    .filter((e) => (!branch || e.location === branch) && (!dept || e.department === dept) && (!role || e.jobTitle === role))
    .filter((e) => !needle || [employeeName(e), e.email, e.jobTitle, e.department, e.location, e.staffNumber].some((v) => v.toLowerCase().includes(needle)));
  const counts = Object.fromEntries(TABS.map((t) => [t.id, t.id === "all" ? filtered.length : filtered.filter((e) => e.status === t.id).length]));
  const rows = filtered.filter((e) => tab === "all" || e.status === tab).sort((a, b) => (params.dir === "desc" ? -1 : 1) * employeeName(a).localeCompare(employeeName(b)));
  const per = PER_PAGE.includes(Number(params.per)) ? Number(params.per) : 10;
  const pages = Math.max(1, Math.ceil(rows.length / per));
  const page = Math.min(pages, Math.max(1, Number(params.page) || 1));
  const shown = rows.slice((page - 1) * per, page * per);
  const link = (changes: Record<string, string | number | undefined>) => hrefWith("/hrportal/hr/employees", params, changes);
  const kept = (omit: string[]) =>
    Object.entries(params)
      .filter(([k, v]) => v && !omit.includes(k))
      .map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />);
  const icon = "inline-flex rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text";

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/employees" crumbs={[{ label: "Employees" }]}>
      <PageTitle
        title="Employees"
        subtitle="Manage employees and their information."
        actions={
          <>
            <a href={hrefWith("/hrportal/hr/employees/export", { tab, q, branch, dept, role })} className={outlineButtonClass}>
              <FileDown className="h-4 w-4" aria-hidden="true" /> Export
            </a>
            {canManage && (
              <Modal label="Import" icon="upload" outline title="Import employees" description="Add several employee records at once from a CSV file.">
                <div className="space-y-3 text-sm">
                  <p>
                    The first row must hold column names. <strong>First name</strong> and <strong>Last name</strong> are required; you can also include Email, Phone, Staff number, Job title, Department,
                    Duty station, Start date (YYYY-MM-DD), Status (Active, Probation, Inactive or Terminated) and Line manager email.
                  </p>
                  <p className="text-admin-muted">Rows whose email already exists are skipped, never overwritten. Portal logins are created separately.</p>
                  <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(IMPORT_TEMPLATE)}`} download="lhi-employee-import-template.csv" className="inline-flex font-semibold text-admin-primary hover:underline">
                    Download the template
                  </a>
                  <ActionForm action={importEmployeesAction} submitLabel="Import employees" resetOnSuccess className="space-y-3">
                    <Field label="CSV file">
                      <input type="file" name="file" accept=".csv,text/csv" required className={inputClass} />
                    </Field>
                  </ActionForm>
                </div>
              </Modal>
            )}
            {canManage && (
              <Modal label="Add Employee" title="Add an employee" description="Create the employee record. The portal login is a separate step." wide>
                <ActionForm action={createEmployeeAction} submitLabel="Add employee" resetOnSuccess className="space-y-4">
                  <EmployeeFields managers={employees} departments={ctx.departments} />
                </ActionForm>
              </Modal>
            )}
          </>
        }
      />

      <section className="overflow-hidden hr-card">
        <form action="/hrportal/hr/employees" className="flex flex-wrap items-center gap-3 px-4 py-4" role="search">
          {kept(["q", "branch", "dept", "role", "page"])}
          <span className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
            <input name="q" defaultValue={q} placeholder="Search…" aria-label="Search employees" className={`${inputClass} mt-0 pl-9`} />
          </span>
          <AutoSubmitSelect name="branch" defaultValue={branch} aria-label="Duty station" className={`${inputClass} mt-0 max-w-48`}>
            <option value="">All Duty Stations</option>
            {branches.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </AutoSubmitSelect>
          <AutoSubmitSelect name="dept" defaultValue={dept} aria-label="Department" className={`${inputClass} mt-0 max-w-56`}>
            <option value="">All Departments</option>
            {departmentNames.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </AutoSubmitSelect>
          <AutoSubmitSelect name="role" defaultValue={role} aria-label="Designation" className={`${inputClass} mt-0 max-w-56`}>
            <option value="">All Designations</option>
            {designations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </AutoSubmitSelect>
          <button className="ml-auto rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-bg">Filter</button>
        </form>
        <nav aria-label="Employee status" className="flex overflow-x-auto border-t border-admin-border px-2">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={link({ tab: t.id === "all" ? undefined : t.id, page: undefined })}
              aria-current={tab === t.id ? "page" : undefined}
              className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${tab === t.id ? "border-admin-primary text-admin-primary" : "border-transparent text-admin-muted hover:text-admin-text"}`}
            >
              <t.icon className="h-4 w-4" aria-hidden="true" /> {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${tab === t.id ? "bg-admin-primary text-white" : "bg-admin-bg text-admin-muted"}`}>{counts[t.id]}</span>
            </Link>
          ))}
        </nav>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead>
              <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                <th scope="col" className="whitespace-nowrap px-4 py-3">#</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">
                  <Link href={link({ dir: params.dir === "desc" ? undefined : "desc" })} className="hover:text-admin-text">
                    Name {params.dir === "desc" ? "↓" : "↑"}
                  </Link>
                </th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">Employee ID</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">Department</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">Designation</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">Employee Status</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">Joined</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3">Login Status</th>
                <th scope="col" className="whitespace-nowrap px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {shown.map((e, i) => {
                const account = accounts.find((a) => a.employeeId === e.id);
                const login = loginState(account);
                const manageLogin = canAccounts && account && canManageAccount(ctx.actor, account);
                return (
                  <tr key={e.id} className="hover:bg-admin-bg/60">
                    <td className="px-4 py-3 text-admin-muted">{(page - 1) * per + i + 1}</td>
                    <td className="px-4 py-3">
                      <Person name={employeeName(e)} sub={e.email || undefined} href={`/hrportal/hr/employees/${e.id}`} />
                    </td>
                    <td className="px-4 py-3">
                      {e.staffNumber ? <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-xs text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300">{e.staffNumber}</span> : <span className="text-admin-muted">—</span>}
                    </td>
                    <td className="px-4 py-3">{e.department || "—"}</td>
                    <td className="px-4 py-3">{e.jobTitle || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge status={e.status} label={statusLabel(e.status)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {e.startDate ? (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4 text-admin-muted" aria-hidden="true" /> {e.startDate}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={login.status} label={login.label} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center justify-center gap-1">
                        <Tip label="View">
                          <Link href={`/hrportal/hr/employees/${e.id}`} aria-label={`View ${employeeName(e)}`} className={icon}>
                            <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                          </Link>
                        </Tip>
                        {canManage && e.id !== ctx.employee.id && (
                          <Tip label="Edit">
                            <Link href={`/hrportal/hr/employees/${e.id}?tab=edit`} aria-label={`Edit ${employeeName(e)}`} className={icon}>
                              <Pencil className="h-[18px] w-[18px]" aria-hidden="true" />
                            </Link>
                          </Tip>
                        )}
                        {manageLogin && account.active && <ChangePasswordModal account={account} name={employeeName(e)} />}
                        {manageLogin && (
                          <QuickAction
                            action={setAccountActiveAction}
                            kind={account.active ? "lock" : "unlock"}
                            tip={account.active ? "Lock Login" : "Unlock Login"}
                            label={`${account.active ? "Lock" : "Unlock"} ${employeeName(e)}'s login`}
                            fields={{ accountId: account.id, active: account.active ? "false" : "true" }}
                            confirmText={account.active ? `Lock ${employeeName(e)}'s login? They'll be signed out everywhere.` : undefined}
                          />
                        )}
                        {canAccounts && !account && isCurrentStaff(e) && (
                          <Tip label="Create Login">
                            <Link href="/hrportal/hr/accounts" aria-label={`Create a login for ${employeeName(e)}`} className={icon}>
                              <UserPlus className="h-[18px] w-[18px]" aria-hidden="true" />
                            </Link>
                          </Tip>
                        )}
                        {canManage && e.id !== ctx.employee.id && (!account || canAccounts) && (
                          <QuickAction
                            action={deleteEmployeeAction}
                            kind="delete"
                            tip="Delete"
                            label={`Delete ${employeeName(e)}`}
                            fields={{ employeeId: e.id }}
                            confirmText={`Permanently delete ${employeeName(e)}, their login and leave history? This can't be undone. For staff who have left, set their status to Terminated instead.`}
                          />
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {shown.length === 0 && <p className="px-4 py-10 text-center text-sm text-admin-muted">No employees match.</p>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-admin-border px-4 py-3 text-sm">
          <p className="text-admin-muted">{rows.length === 0 ? "No results" : `Showing ${(page - 1) * per + 1} to ${Math.min(page * per, rows.length)} of ${rows.length} results`}</p>
          <div className="flex flex-wrap items-center gap-2">
            <form action="/hrportal/hr/employees" className="flex items-center gap-2">
              {kept(["per", "page"])}
              <label htmlFor="emp-per-page" className="whitespace-nowrap text-xs text-admin-muted">
                Rows per page:
              </label>
              <AutoSubmitSelect id="emp-per-page" name="per" defaultValue={String(per)} className={`${inputClass} mt-0 max-w-20 py-1.5`}>
                {PER_PAGE.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </AutoSubmitSelect>
            </form>
            {page > 1 ? (
              <Link href={link({ page: page - 1 })} className="rounded-lg border border-admin-border px-3 py-1.5 hover:bg-admin-bg">
                « Previous
              </Link>
            ) : (
              <span className="rounded-lg border border-admin-border px-3 py-1.5 text-admin-muted opacity-60">« Previous</span>
            )}
            <span className="min-w-9 rounded-lg border border-admin-primary bg-admin-primary px-3 py-1.5 text-center text-white">{page}</span>
            {page < pages ? (
              <Link href={link({ page: page + 1 })} className="rounded-lg border border-admin-border px-3 py-1.5 hover:bg-admin-bg">
                Next »
              </Link>
            ) : (
              <span className="rounded-lg border border-admin-border px-3 py-1.5 text-admin-muted opacity-60">Next »</span>
            )}
          </div>
        </div>
      </section>
    </PortalShell>
  );
}
