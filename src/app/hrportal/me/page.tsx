import { CalendarCheck, CalendarClock, CalendarDays, Palmtree } from "lucide-react";

import { requestLeaveAction, setMyDepartmentAction, updateMyContactAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { MyAnalytics } from "@/components/hr/analytics-panels";
import { BankingCard } from "@/components/hr/banking-card";
import { BalanceTable } from "@/components/hr/balance-table";
import { LeaveFields } from "@/components/hr/leave-form";
import { LeaveListing, type LeaveParams } from "@/components/hr/leave-listing";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { ReliefPanel, relieverLabel } from "@/components/hr/relief-panel";
import { Avatar, Card, Field, fmtDate, inputClass, Notice, PageTitle, Person, TintStat, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { approversFor, has, relieverOptions } from "@/lib/hr/access";
import { availableByType, balanceFor } from "@/lib/hr/leave-balance";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My record" };

/** Employee self-service: only ever the signed-in person's own record. */
export default async function MyRecordPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage("self.view");
  const params = (await searchParams) as LeaveParams;
  const [employees, leave, policies, adjustments, accounts] = await Promise.all([
    readStore("hrEmployees"),
    readStore("hrLeave"),
    readStore("hrLeavePolicies"),
    readStore("hrLeaveAdjustments"),
    readStore("hrAccounts"),
  ]);
  const me = ctx.employee;
  const manager = employees.find((e) => e.id === me.managerId);
  const mine = leave.filter((l) => l.employeeId === me.id);
  const year = new Date().getFullYear();
  const balances = balanceFor(me, year, ctx.leaveTypes, policies, leave, adjustments);
  const annual = balances.find((r) => r.type.id === "Annual") ?? balances.find((r) => r.total !== null);
  const total = annual?.total ?? 0;
  const left = Math.max(0, annual?.available ?? 0);
  const canRequest = has(ctx.permissions, "leave.request");
  const openDepartments = ctx.departments.filter((d) => d.active).sort((a, b) => a.name.localeCompare(b.name));
  const myDepartment = ctx.departments.find((d) => d.id === me.departmentId);
  const approvers = approversFor(me, employees, ctx.departments);
  const relievers = relieverOptions(me, employees, accounts);

  return (
    <PortalShell ctx={ctx} current="/hrportal/me" crumbs={[{ label: "My record" }]}>
      {params.denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle
        title={`Welcome, ${me.firstName}`}
        subtitle="Your employee record and leave"
        actions={
          canRequest && (
            <Modal label="Request Leave" title="Request leave" description={annual ? `You have ${left} ${annual.type.name.toLowerCase()} days left this year.` : undefined}>
              <ActionForm action={requestLeaveAction} submitLabel="Send request" resetOnSuccess className="space-y-4">
                <LeaveFields types={ctx.leaveTypes} relievers={relievers.map((e) => ({ id: e.id, label: relieverLabel(e) }))} relieverRequired available={availableByType(balances)} year={year} />
              </ActionForm>
            </Modal>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TintStat tint="teal" icon={CalendarDays} label={`${annual?.type.name ?? "Leave"} ${year}`} value={annual?.total === null || !annual ? "No limit" : `${total} days`} />
        <TintStat tint="green" icon={CalendarCheck} label="Taken or approved" value={annual?.used ?? 0} note={`${annual?.type.name ?? "Leave"}, this year`} />
        <TintStat tint="amber" icon={CalendarClock} label="Awaiting approval" value={annual?.pending ?? 0} note="Days in pending requests" />
        <TintStat tint="blue" icon={Palmtree} label="Days left" value={left} progress={total ? (left / total) * 100 : 0} />
      </div>

      <ReliefPanel me={me} leave={leave} employees={employees} options={relievers} />

      {openDepartments.length > 0 && !myDepartment && has(ctx.permissions, "self.update") && (
        <div className="mt-6">
          <Notice>Choose your department below so your leave requests reach your director or head of department.</Notice>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="My department" subtitle="Your leave requests go to your line manager and to your department's head and approvers.">
          {openDepartments.length > 0 && has(ctx.permissions, "self.update") ? (
            <ActionForm action={setMyDepartmentAction} submitLabel="Save department">
              <Field label="Department">
                <select name="departmentId" defaultValue={myDepartment?.id ?? ""} required className={inputClass}>
                  <option value="" disabled>
                    Choose your department…
                  </option>
                  {openDepartments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
            </ActionForm>
          ) : (
            <p className="text-sm">{myDepartment?.name ?? me.department ?? "Not set"}</p>
          )}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">Who receives your leave requests</p>
            {approvers.length ? (
              <ul className="mt-2 space-y-2">
                {approvers.map((a) => (
                  <li key={a.id}>
                    <Person
                      name={employeeName(a)}
                      sub={[a.id === me.managerId ? "Line manager" : "", myDepartment?.headEmployeeId === a.id ? `Head of ${myDepartment.name}` : "", myDepartment?.approverIds.includes(a.id) ? `${myDepartment.name} approver` : ""].filter(Boolean).join(" · ")}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-admin-muted">No line manager or department head is set yet, so the HR team will decide your requests.</p>
            )}
          </div>
        </Card>

        <Card title="My details" subtitle="Something wrong here? Ask the HR team to correct it.">
          <div className="mb-5 flex items-center gap-4">
            <Avatar name={employeeName(me)} size="lg" />
            <div>
              <p className="text-lg font-semibold">{employeeName(me)}</p>
              <p className="text-sm text-admin-muted">{[me.jobTitle, me.department].filter(Boolean).join(" · ") || ctx.role.name}</p>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Staff number", me.staffNumber || "—"],
              ["Duty station", me.location || "—"],
              ["Line manager", manager ? employeeName(manager) : "—"],
              ["Work email", me.email || "—"],
              ["Start date", fmtDate(me.startDate)],
              ["Portal role", ctx.role.name],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-admin-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {has(ctx.permissions, "self.update") && (
          <Card title="Contact details" subtitle="Keep these up to date so HR can reach you or your family in an emergency.">
            <ActionForm action={updateMyContactAction} submitLabel="Save contact details">
              <Field label="Phone">
                <input name="phone" defaultValue={me.phone} className={inputClass} />
              </Field>
              <Field label="Home address">
                <input name="address" defaultValue={me.address} className={inputClass} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Emergency contact">
                  <input name="emergencyContactName" defaultValue={me.emergencyContactName} className={inputClass} />
                </Field>
                <Field label="Emergency contact phone">
                  <input name="emergencyContactPhone" defaultValue={me.emergencyContactPhone} className={inputClass} />
                </Field>
              </div>
            </ActionForm>
          </Card>
        )}
      </div>

      <div className="mt-6">
        <Card title={`My leave balances ${year}`} subtitle="Allowances come from LHI's leave policies; hover the (i) for the breakdown." flush>
          <BalanceTable rows={balances} />
        </Card>
      </div>

      <MyAnalytics leave={mine} types={ctx.leaveTypes} balances={balances} today={todayLagos()} />

      <div className="mt-6">
        <BankingCard person={me} editable={has(ctx.permissions, "self.update")} />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">My leave applications</h2>
        <LeaveListing leaveTypes={ctx.leaveTypes}
          rows={mine}
          employees={employees}
          basePath="/hrportal/me"
          params={{ ...params, tab: params.tab ?? "all" }}
          showEmployee={false}
          canCancel={(l) => canRequest && l.status === "pending"}
        />
      </div>
    </PortalShell>
  );
}
