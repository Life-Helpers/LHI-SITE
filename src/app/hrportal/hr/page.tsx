import Link from "next/link";
import { Briefcase, Building2, CalendarCheck, CalendarClock, CalendarDays, ClipboardList, Gift, PartyPopper, UserCheck, Users } from "lucide-react";

import { decideLeaveAction, loadSampleDataAction, removeSampleDataAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { leaveName, leaveStyle } from "@/components/hr/leave-style";
import { PortalShell } from "@/components/hr/portal-shell";
import { QuickAction } from "@/components/hr/quick-action";
import { Card, Field, fmtDate, fmtDateTime, inputClass, Notice, PageTitle, Person, TintStat, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave, has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, type HrEmployee, isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const MONTH_DAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Days from `today` to the next occurrence of this person's birthday (0 = today). */
function daysToBirthday(dob: string, today: string) {
  const year = Number(today.slice(0, 4));
  const md = dob.slice(5);
  // 29 February birthdays fall on 28 February in other years.
  const on = (y: number) => (md === "02-29" && !(y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? `${y}-02-28` : `${y}-${md}`);
  let next = on(year);
  if (next < today) next = on(year + 1);
  return Math.round((Date.parse(`${next}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000);
}

export default async function HrDashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage(["employees.view", "employees.manage", "accounts.manage"]);
  const { denied } = await searchParams;
  const [employees, accounts, leave, audit, jobs] = await Promise.all([
    readStore("hrEmployees"),
    readStore("hrAccounts"),
    readStore("hrLeave"),
    readStore("hrAudit"),
    readStore("jobs"),
  ]);
  const p = ctx.permissions;
  const seesPeople = has(p, "employees.view") || has(p, "employees.manage");
  const seesLeave = has(p, "leave.view_all") || has(p, "leave.manage");
  const today = todayLagos();
  const month = today.slice(0, 7);

  const active = employees.filter((e) => isCurrentStaff(e));
  const joinedThisMonth = active.filter((e) => e.startDate.startsWith(month)).length;
  const departments = new Set(active.map((e) => e.department).filter(Boolean));
  const stations = new Set(active.map((e) => e.location).filter(Boolean));
  const activated = accounts.filter((a) => a.active && a.passwordHash).length;
  const invitesOpen = accounts.filter((a) => a.active && !a.passwordHash).length;
  const pending = leave.filter((l) => l.status === "pending");
  const onLeaveToday = leave.filter((l) => l.status === "approved" && l.startDate <= today && l.endDate >= today);
  const approvedDaysThisMonth = leave.filter((l) => l.status === "approved" && l.startDate.startsWith(month)).reduce((n, l) => n + l.days, 0);
  const openJobs = jobs.filter((j) => j.status === "open" && j.deadline >= today);
  const weekAhead = new Date(Date.parse(`${today}T12:00:00Z`) + 7 * 86_400_000).toISOString().slice(0, 10);

  const birthdays = active
    .filter((e): e is HrEmployee & { dateOfBirth: string } => Boolean(e.dateOfBirth))
    .map((e) => ({ e, inDays: daysToBirthday(e.dateOfBirth, today) }))
    .filter((b) => b.inDays <= 30)
    .sort((a, b) => a.inDays - b.inDays)
    .slice(0, 8);
  const byDept = [...departments]
    .map((d) => ({ d, n: active.filter((e) => e.department === d).length }))
    .sort((a, b) => b.n - a.n);
  const unassigned = active.filter((e) => !e.department).length;
  const sampleCount = employees.filter((e) => e.sample).length;
  const sampleLogins = accounts.filter((a) => a.sample).length;
  const nameOf = (id: string) => employeeName(employees.find((e) => e.id === id));
  const personHref = (id: string) => (seesPeople ? `/hrportal/hr/employees/${id}` : undefined);

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr" crumbs={[{ label: "HR overview" }]}>
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title={`Good day, ${ctx.employee.firstName}`} subtitle={`HR overview for Life Helpers Initiative · ${fmtDate(today)}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <TintStat tint="blue" icon={Users} label="Total Employees" value={active.length} note={`${joinedThisMonth} joined this month`} href={seesPeople ? "/hrportal/hr/employees" : undefined} />
        <TintStat tint="green" icon={Building2} label="Departments" value={departments.size} note={`${stations.size} duty station${stations.size === 1 ? "" : "s"}`} />
        <TintStat
          tint="violet"
          icon={UserCheck}
          label="Portal accounts"
          value={activated}
          progress={active.length ? (activated / active.length) * 100 : 0}
          note={`${invitesOpen} invite${invitesOpen === 1 ? "" : "s"} not yet used`}
          href={has(p, "accounts.manage") ? "/hrportal/hr/accounts" : undefined}
        />
        {seesLeave && (
          <TintStat tint="amber" icon={CalendarClock} label="Pending Leaves" value={pending.length} note={`${onLeaveToday.length} on leave today`} href="/hrportal/hr/leave" />
        )}
        {seesLeave && <TintStat tint="teal" icon={CalendarDays} label="Leave days this month" value={approvedDaysThisMonth} note="Approved, starting this month" />}
        <TintStat
          tint="orange"
          icon={Briefcase}
          label="Active Jobs"
          value={openJobs.length}
          note={`${openJobs.filter((j) => j.deadline <= weekAhead).length} closing this week`}
          href="/careers"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {seesPeople && (
          <section className="relative overflow-hidden rounded-xl border border-pink-200 bg-admin-card dark:border-pink-500/30">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle,rgba(236,72,153,0.25)_1.5px,transparent_2px)] [background-size:46px_46px]" />
            <div className="relative flex items-start justify-between border-b border-admin-border px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">Birthdays</h2>
                <p className="text-xs text-admin-muted">Celebrate with your team: today and the next 30 days</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-300">
                <PartyPopper className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <ul className="relative max-h-80 divide-y divide-admin-border overflow-y-auto">
              {birthdays.map(({ e, inDays }) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <Person name={employeeName(e)} sub={e.jobTitle || e.department} href={personHref(e.id)} />
                  <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${inDays === 0 ? "border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-300" : "border-admin-border text-admin-muted"}`}>
                    {inDays === 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Gift className="h-3.5 w-3.5" aria-hidden="true" /> Today
                      </span>
                    ) : (
                      MONTH_DAY.format(new Date(`2000-${e.dateOfBirth.slice(5)}T12:00:00Z`))
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {birthdays.length === 0 && (
              <p className="relative px-5 py-10 text-center text-sm text-admin-muted">No birthdays in the next 30 days. Add dates of birth to employee records to see them here.</p>
            )}
          </section>
        )}

        {seesLeave && (
          <section className="overflow-hidden rounded-xl border border-amber-200 bg-admin-card dark:border-amber-500/30">
            <div className="flex items-start justify-between border-b border-admin-border px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">Today&apos;s Leave</h2>
                <p className="text-xs text-admin-muted">Employees on leave today</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <ul className="max-h-80 divide-y divide-admin-border overflow-y-auto">
              {onLeaveToday.map((l) => {
                const e = employees.find((x) => x.id === l.employeeId);
                return (
                  <li key={l.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <Person name={employeeName(e)} sub={e?.jobTitle || e?.department} href={personHref(l.employeeId)} />
                    <span className="text-right">
                      <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${leaveStyle(l.type, ctx.leaveTypes).pill}`}>{leaveName(l.type, ctx.leaveTypes)}</span>
                      <span className="mt-0.5 block text-[11px] text-admin-muted">until {fmtDate(l.endDate)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            {onLeaveToday.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">Everyone is in today.</p>}
          </section>
        )}

        {seesLeave && (
          <Card
            title="Awaiting approval"
            subtitle="Oldest first"
            flush
            actions={
              <Link href="/hrportal/hr/leave" className="text-sm font-semibold text-admin-primary hover:underline">
                View all
              </Link>
            }
          >
            <ul className="divide-y divide-admin-border">
              {[...pending]
                .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
                .slice(0, 6)
                .map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{nameOf(l.employeeId)}</span>
                      <span className="flex items-center gap-1.5 text-xs text-admin-muted">
                        <span className={`h-2 w-2 rounded-full ${leaveStyle(l.type, ctx.leaveTypes).dot}`} aria-hidden="true" />
                        {leaveName(l.type, ctx.leaveTypes)} · {fmtDate(l.startDate)} – {fmtDate(l.endDate)} · {l.days} day{l.days === 1 ? "" : "s"}
                      </span>
                    </span>
                    {canDecideLeave(ctx.actor, l, employees, ctx.departments) && (
                      <span className="flex shrink-0 gap-1">
                        <QuickAction action={decideLeaveAction} kind="approve" label={`Approve ${nameOf(l.employeeId)}'s leave`} fields={{ leaveId: l.id, decision: "approve" }} />
                        <QuickAction action={decideLeaveAction} kind="reject" label={`Reject ${nameOf(l.employeeId)}'s leave`} fields={{ leaveId: l.id, decision: "reject" }} askNote="Reason for rejecting (optional):" />
                      </span>
                    )}
                  </li>
                ))}
            </ul>
            {pending.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">Nothing waiting for a decision.</p>}
          </Card>
        )}

        <Card title="Headcount by department" subtitle={`${active.length} active staff`}>
          <ul className="space-y-3">
            {byDept.map(({ d, n }) => (
              <li key={d}>
                <div className="flex justify-between text-sm">
                  <span>{d}</span>
                  <span className="font-semibold">{n}</span>
                </div>
                <span className="mt-1 block h-2 overflow-hidden rounded-full bg-admin-bg" aria-hidden="true">
                  <span className="block h-full rounded-full bg-admin-primary" style={{ width: `${(n / Math.max(1, active.length)) * 100}%` }} />
                </span>
              </li>
            ))}
            {unassigned > 0 && <li className="text-xs text-admin-muted">{unassigned} without a department on record</li>}
          </ul>
          {active.length === 0 && <p className="py-6 text-center text-sm text-admin-muted">No employees yet.</p>}
        </Card>

        {has(p, "audit.view") && (
          <Card
            title="Recent activity"
            flush
            className="lg:col-span-2"
            actions={
              <Link href="/hrportal/hr/audit" className="text-sm font-semibold text-admin-primary hover:underline">
                Audit trail
              </Link>
            }
          >
            <ul className="divide-y divide-admin-border">
              {audit.slice(0, 6).map((a) => (
                <li key={a.id} className="flex items-start gap-3 px-5 py-3 text-sm">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-admin-primary-soft text-admin-primary">
                    <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block">
                      <span className="font-medium">{a.actorName.replace(/ \(.*\)$/, "")}</span> {a.action} · <span className="text-admin-muted">{a.target}</span>
                    </span>
                    {a.details && <span className="block truncate text-xs text-admin-muted">{a.details}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-admin-muted">{fmtDateTime(a.at)}</span>
                </li>
              ))}
            </ul>
            {audit.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No activity yet.</p>}
          </Card>
        )}
      </div>
      {has(p, "accounts.manage") && has(p, "employees.manage") && (
        <div className="mt-6">
          <Card title="Sample data for testing" subtitle="Five made-up staff (staff numbers SAMPLE-001 to SAMPLE-005) with leave requests, to try the portal safely">
            {/* Both forms stay mounted so each one's result message survives the refresh. */}
            <p className="mb-4 text-sm text-admin-muted">
              {sampleCount
                ? `${sampleCount} sample employees are loaded${sampleLogins ? `, with ${sampleLogins} sample logins` : ""}. Their staff numbers start with SAMPLE.`
                : "No sample data is loaded."}
            </p>
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <ActionForm action={loadSampleDataAction} submitLabel="Load sample data" className="space-y-3">
                <Field label="Password for sample logins (optional)" hint="Leave blank for records only. With a password, each sample person gets a login (e.g. aisha.bello.sample@example.test) so you can test each role.">
                  <input type="password" name="password" autoComplete="new-password" className={`${inputClass} max-w-sm`} />
                </Field>
              </ActionForm>
              <ActionForm action={removeSampleDataAction} submitLabel="Remove sample data" danger confirmText="Remove all sample employees, their leave and sample logins?" />
            </div>
          </Card>
        </div>
      )}
    </PortalShell>
  );
}
