import { requestLeaveAction, updateMyContactAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { LeaveTable } from "@/components/hr/leave-parts";
import { PortalShell } from "@/components/hr/portal-shell";
import { Card, Field, fmtDate, inputClass, Notice, PageTitle, Stat } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { annualLeaveUsed, has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, LEAVE_TYPES } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "My record" };

/** Employee self-service: only ever the signed-in person's own record. */
export default async function MyRecordPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage("self.view");
  const { denied } = await searchParams;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const me = ctx.employee;
  const manager = employees.find((e) => e.id === me.managerId);
  const mine = leave.filter((l) => l.employeeId === me.id).sort((a, b) => b.startDate.localeCompare(a.startDate));
  const year = new Date().getFullYear();
  const used = annualLeaveUsed(me.id, year, leave);

  return (
    <PortalShell ctx={ctx} current="/hrportal/me">
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title={`Welcome, ${me.firstName}`} subtitle="Your employee record and leave" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={`Annual leave ${year}`} value={`${me.annualLeaveDays} days`} />
        <Stat label="Taken or approved" value={used.approved} />
        <Stat label="Left (after pending)" value={Math.max(0, me.annualLeaveDays - used.approved - used.pending)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="My details">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            {[
              ["Name", employeeName(me)],
              ["Staff number", me.staffNumber || "—"],
              ["Job title", me.jobTitle || "—"],
              ["Department", me.department || "—"],
              ["Duty station", me.location || "—"],
              ["Line manager", manager ? employeeName(manager) : "—"],
              ["Work email", me.email || "—"],
              ["Start date", fmtDate(me.startDate)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-admin-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-admin-muted">Something wrong here? Ask the HR team to correct it.</p>
        </Card>

        {has(ctx.permissions, "self.update") && (
          <Card title="Contact details">
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

      {has(ctx.permissions, "leave.request") && (
        <div className="mt-6">
          <Card title="Request leave">
            <ActionForm action={requestLeaveAction} submitLabel="Send request" resetOnSuccess className="grid gap-3 sm:grid-cols-2">
              <Field label="Type">
                <select name="type" className={inputClass} defaultValue="Annual">
                  {LEAVE_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="From">
                  <input name="startDate" type="date" required className={inputClass} />
                </Field>
                <Field label="To">
                  <input name="endDate" type="date" required className={inputClass} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Reason (optional)">
                  <input name="reason" maxLength={500} className={inputClass} />
                </Field>
              </div>
            </ActionForm>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Card title="My leave requests">
          <LeaveTable rows={mine} canCancel={(l) => has(ctx.permissions, "leave.request") && l.status === "pending"} empty="You haven't requested any leave yet." />
        </Card>
      </div>
    </PortalShell>
  );
}
