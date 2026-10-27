import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, CalendarDays, Hash, Mail, MapPin, Phone } from "lucide-react";

import { updateEmployeeAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { BankingCard, Info } from "@/components/hr/banking-card";
import { EmployeeFields } from "@/components/hr/employee-form";
import { LeaveListing, type LeaveParams } from "@/components/hr/leave-listing";
import { ChangePasswordModal } from "@/components/hr/password-panel";
import { PortalShell } from "@/components/hr/portal-shell";
import { hrefWith } from "@/components/hr/query";
import { Badge, Card, Field, fmtDate, fmtDateTime, initialsOf, inputClass, Notice, outlineButtonClass, todayLagos, toneFor } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { approversFor, canDecideLeave, canManageAccount, canManageApprovedLeave, findRole, has, reportsOf } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { EMPLOYEE_STATUSES, employeeName, isCurrentStaff, statusLabel, hasSignedIn } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Employee" };

export default async function EmployeePage({ params, searchParams }: { params: Promise<{ employeeId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage(["employees.view", "employees.manage"]);
  const { employeeId } = await params;
  const query = (await searchParams) as LeaveParams;
  const [employees, accounts, leave, customRoles, audit] = await Promise.all([
    readStore("hrEmployees"),
    readStore("hrAccounts"),
    readStore("hrLeave"),
    readStore("hrRoles"),
    readStore("hrAudit"),
  ]);
  const person = employees.find((e) => e.id === employeeId);
  if (!person) notFound();
  const p = ctx.permissions;
  const isSelf = person.id === ctx.employee.id;
  const canEdit = has(p, "employees.manage") && !isSelf;
  // Bank details: only the person and HR staff who manage records.
  const canSeeBanking = has(p, "employees.manage") || isSelf;
  const account = accounts.find((a) => a.employeeId === person.id);
  const role = account ? findRole(account.roleId, customRoles) : undefined;
  const nameOf = (id: string | null | undefined) => (id ? employeeName(employees.find((e) => e.id === id)) : "");
  const department = ctx.departments.find((d) => d.id === person.departmentId);
  const directReports = employees.filter((e) => e.managerId === person.id && isCurrentStaff(e));
  const theirLeave = leave.filter((l) => l.employeeId === person.id);
  const name = employeeName(person);
  const activity = has(p, "audit.view") ? audit.filter((a) => a.target.includes(name) || (account && a.target.includes(account.email))).slice(0, 50) : [];

  const tabs = [
    { id: "basic", label: "Basic Info", show: true },
    { id: "employment", label: "Employment", show: true },
    { id: "contact", label: "Contact", show: true },
    { id: "banking", label: "Banking", show: canSeeBanking },
    { id: "leave", label: "Leave", show: has(p, "leave.view_all") || has(p, "leave.manage") },
    { id: "activity", label: "Activity", show: has(p, "audit.view") },
    { id: "edit", label: "Edit", show: canEdit },
  ].filter((t) => t.show);
  const tab = tabs.some((t) => t.id === query.tab) ? query.tab! : "basic";
  const base = `/hrportal/hr/employees/${person.id}`;
  const loginLabel = !account ? "No login" : !account.active ? "Locked" : hasSignedIn(account) ? "Active" : "Invited";

  const sidebar: [typeof Hash, string][] = [
    [Hash, `Employee ID: ${person.staffNumber || "—"}`],
    [Mail, person.email || "No work email"],
    [Phone, person.phone || "No phone"],
    [CalendarDays, `DOB: ${person.dateOfBirth || "—"}`],
    [CalendarDays, `Joined: ${person.startDate || "—"}`],
    [Building2, person.department || "No department"],
    [MapPin, person.location || "No duty station"],
    [Briefcase, person.employmentType || "Employment type not set"],
  ];

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/employees" crumbs={[{ label: "Employees", href: "/hrportal/hr/employees" }, { label: name }]}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
          <p className="mt-1 text-sm text-admin-muted">View detailed information and activity for this employee.</p>
        </div>
        <Link href="/hrportal/hr/employees" className={outlineButtonClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </Link>
      </div>
      {isSelf && has(p, "employees.manage") && <Notice>This is your own record. Ask another HR colleague to change it; you can update your contact and bank details under My record.</Notice>}

      <div className="grid gap-6 hr-card p-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-6">
        <aside className="rounded-xl border border-admin-border p-6">
          <div className="flex flex-col items-center text-center">
            <span className={`flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold text-white ${toneFor(name)}`} aria-hidden="true">
              {initialsOf(name)}
            </span>
            <p className="mt-4 text-xl font-semibold">{name}</p>
            <p className="text-sm text-admin-muted">{person.jobTitle || "No job title"}</p>
            <div className="mt-2">
              <Badge status={person.status} label={statusLabel(person.status)} />
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {sidebar.map(([Icon, value], i) => (
              <li key={i} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-admin-muted" aria-hidden="true" />
                <span className="min-w-0 break-words">{value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-admin-border pt-4 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-admin-muted">Portal login</span>
              <Badge status={!account ? "none" : !account.active ? "inactive" : hasSignedIn(account) ? "active" : "invited"} label={loginLabel} />
            </p>
            {account && (
              <p className="mt-2 flex items-center justify-between">
                <span className="text-admin-muted">Role</span>
                <span className="font-medium">{role?.name ?? "No valid role"}</span>
              </p>
            )}
            {has(p, "accounts.manage") && account?.active && canManageAccount(ctx.actor, account) && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-admin-muted">Change password</span>
                <ChangePasswordModal account={account} name={name} />
              </div>
            )}
          </div>
        </aside>

        <div className="min-w-0">
          <nav aria-label="Employee details" className="flex gap-1 overflow-x-auto rounded-lg bg-admin-bg p-1">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={hrefWith(base, {}, { tab: t.id === "basic" ? undefined : t.id })}
                aria-current={tab === t.id ? "page" : undefined}
                className={`flex-1 whitespace-nowrap rounded-md px-4 py-2 text-center text-sm font-medium ${tab === t.id ? "bg-admin-card text-admin-text shadow-sm" : "text-admin-muted hover:text-admin-text"}`}
              >
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4">
            {tab === "basic" && (
              <Card title="Basic Information">
                <Info
                  items={[
                    ["Full Name", name],
                    ["Employee ID", person.staffNumber],
                    ["Email", person.email],
                    ["Phone Number", person.phone],
                    ["Date of Birth", person.dateOfBirth],
                    ["Gender", person.gender],
                  ]}
                />
              </Card>
            )}

            {tab === "employment" && (
              <Card title="Employment">
                <Info
                  items={[
                    ["Designation", person.jobTitle],
                    ["Department", department?.name ?? person.department],
                    ["Duty Station", person.location],
                    ["Employment Type", person.employmentType],
                    ["Employee Status", statusLabel(person.status)],
                    ["Joined", fmtDate(person.startDate)],
                    ["Line Manager", nameOf(person.managerId)],
                    ["Leave approvers", approversFor(person, employees, ctx.departments).map(employeeName).join(", ")],
                    ["Direct Reports", directReports.length ? `${directReports.map(employeeName).join(", ")} (${reportsOf(person.id, employees).size} in total)` : "None"],
                  ]}
                />
              </Card>
            )}

            {tab === "contact" && (
              <Card title="Contact">
                <Info
                  items={[
                    ["Work Email", person.email],
                    ["Phone Number", person.phone],
                    ["Home Address", person.address],
                    ["Emergency Contact", person.emergencyContactName],
                    ["Emergency Contact Phone", person.emergencyContactPhone],
                  ]}
                />
              </Card>
            )}

            {tab === "banking" && canSeeBanking && <BankingCard person={person} editable={canEdit || isSelf} />}

            {tab === "leave" && (
              <LeaveListing leaveTypes={ctx.leaveTypes}
                rows={theirLeave}
                employees={employees}
                basePath={base}
                params={{ ...query, leave: query.leave ?? "all" }}
                statusParam="leave"
                showEmployee={false}
                canDecide={(l) => canDecideLeave(ctx.actor, l, employees, ctx.departments)}
                canManage={(l) => canManageApprovedLeave(ctx.actor, l, employees, ctx.departments)}
                today={todayLagos()}
              />
            )}

            {tab === "activity" && (
              <Card title="Activity" subtitle="Changes to this person's record, login and leave" flush>
                <ul className="divide-y divide-admin-border">
                  {activity.map((a) => (
                    <li key={a.id} className="flex flex-wrap items-start justify-between gap-2 px-5 py-3 text-sm">
                      <span>
                        <span className="font-medium">{a.actorName.replace(/ \(.*\)$/, "")}</span> {a.action}
                        {a.details && <span className="block text-xs text-admin-muted">{a.details}</span>}
                      </span>
                      <span className="text-xs text-admin-muted">{fmtDateTime(a.at)}</span>
                    </li>
                  ))}
                </ul>
                {activity.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No recorded activity yet.</p>}
              </Card>
            )}

            {tab === "edit" && canEdit && (
              <Card title="Edit employee record">
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
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
