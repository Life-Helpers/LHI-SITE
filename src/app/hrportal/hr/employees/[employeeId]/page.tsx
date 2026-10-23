import Link from "next/link";
import { notFound } from "next/navigation";

import { updateEmployeeAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { EmployeeFields } from "@/components/hr/employee-form";
import { LeaveListing, type LeaveParams } from "@/components/hr/leave-listing";
import { PortalShell } from "@/components/hr/portal-shell";
import { Avatar, Badge, Card, Field, fmtDate, inputClass, Notice } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave, findRole, has, reportsOf } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { EMPLOYEE_STATUSES, employeeName, isCurrentStaff, statusLabel } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Employee" };

export default async function EmployeePage({ params, searchParams }: { params: Promise<{ employeeId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage(["employees.view", "employees.manage"]);
  const { employeeId } = await params;
  const query = (await searchParams) as LeaveParams;
  const [employees, accounts, leave, customRoles] = await Promise.all([readStore("hrEmployees"), readStore("hrAccounts"), readStore("hrLeave"), readStore("hrRoles")]);
  const person = employees.find((e) => e.id === employeeId);
  if (!person) notFound();
  const p = ctx.permissions;
  const isSelf = person.id === ctx.employee.id;
  const canEdit = has(p, "employees.manage") && !isSelf;
  const account = accounts.find((a) => a.employeeId === person.id);
  const directReports = employees.filter((e) => e.managerId === person.id && isCurrentStaff(e));
  const allReports = reportsOf(person.id, employees);
  const theirLeave = leave.filter((l) => l.employeeId === person.id);
  const showLeave = has(p, "leave.view_all") || has(p, "leave.manage");

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/employees" crumbs={[{ label: "Employees", href: "/hrportal/hr/employees" }, { label: employeeName(person) }]}>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar name={employeeName(person)} size="lg" />
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{employeeName(person)}</h1>
          <p className="text-sm text-admin-muted">{[person.jobTitle, person.department, person.location].filter(Boolean).join(" · ") || "No job details yet"}</p>
        </div>
        <Badge status={person.status} label={statusLabel(person.status)} />
      </div>
      {isSelf && has(p, "employees.manage") && <Notice>This is your own record. Ask another HR colleague to change it; you can update your contact details under My record.</Notice>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div id="edit" className="scroll-mt-20 space-y-6 lg:col-span-2">
          {canEdit ? (
            <Card title="Employee record">
              <ActionForm action={updateEmployeeAction} submitLabel="Save record" className="space-y-4">
                <input type="hidden" name="employeeId" value={person.id} />
                <EmployeeFields employee={person} managers={employees} departments={ctx.departments} />
                <Field label="Employee status" hint="Active and probation staff can use the portal; inactive and terminated staff can't.">
                  <select name="status" defaultValue={person.status} className={`${inputClass} sm:w-1/2`}>
                    {EMPLOYEE_STATUSES.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </ActionForm>
            </Card>
          ) : (
            <Card title="Employee record">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Work email", person.email || "—"],
                  ["Phone", person.phone || "—"],
                  ["Staff number", person.staffNumber || "—"],
                  ["Reports to", person.managerId ? employeeName(employees.find((e) => e.id === person.managerId)) : "—"],
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
          )}
          {showLeave && (
            <LeaveListing
              rows={theirLeave}
              employees={employees}
              basePath={`/hrportal/hr/employees/${person.id}`}
              params={{ ...query, tab: query.tab ?? "all" }}
              showEmployee={false}
              canDecide={(l) => canDecideLeave(ctx.actor, l, employees, ctx.departments)}
            />
          )}
        </div>
        <div className="space-y-6">
          <Card title="Personal contact">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-admin-muted">Home address</dt>
                <dd>{person.address || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-admin-muted">Emergency contact</dt>
                <dd>{person.emergencyContactName ? `${person.emergencyContactName} (${person.emergencyContactPhone || "no phone"})` : "—"}</dd>
              </div>
            </dl>
          </Card>
          <Card title="Reporting line">
            <p className="text-sm">
              {directReports.length} direct report{directReports.length === 1 ? "" : "s"}, {allReports.size} in total.
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {directReports.map((e) => (
                <li key={e.id}>
                  <Link href={`/hrportal/hr/employees/${e.id}`} className="text-admin-primary hover:underline">
                    {employeeName(e)}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          {has(p, "accounts.manage") && (
            <Card title="Portal account">
              {account ? (
                <div className="space-y-1 text-sm">
                  <p>{account.email}</p>
                  <p>
                    Role: <strong>{findRole(account.roleId, customRoles)?.name ?? "No valid role"}</strong>
                  </p>
                  <Badge status={!account.active ? "inactive" : account.passwordHash ? "active" : "invited"} />
                  <p className="pt-2">
                    <Link href={`/hrportal/hr/accounts#account-${account.id}`} className="font-semibold text-admin-primary hover:underline">
                      Manage account
                    </Link>
                  </p>
                </div>
              ) : (
                <p className="text-sm">
                  No account.{" "}
                  <Link href="/hrportal/hr/accounts" className="font-semibold text-admin-primary hover:underline">
                    Create one
                  </Link>
                </p>
              )}
            </Card>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
