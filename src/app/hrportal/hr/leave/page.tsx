import { FileDown } from "lucide-react";

import { recordLeaveAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { LeaveCalendar } from "@/components/hr/leave-calendar";
import { LeaveFields } from "@/components/hr/leave-form";
import { LeaveListing, type LeaveParams } from "@/components/hr/leave-listing";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { relieverLabel } from "@/components/hr/relief-panel";
import { hrefWith, isIsoDate, mondayOf } from "@/components/hr/query";
import { Field, inputClass, outlineButtonClass, PageTitle, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave, canManageApprovedLeave, has, relieverOptions } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave applications" };

export default async function LeaveApplicationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const ctx = await requireHrPage(["leave.view_all", "leave.manage"]);
  const params = (await searchParams) as LeaveParams;
  const [employees, leave, accounts] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave"), readStore("hrAccounts")]);
  const weekStart = mondayOf(isIsoDate(params.week) ? params.week : todayLagos());
  const canViewPeople = has(ctx.permissions, "employees.view") || has(ctx.permissions, "employees.manage");
  const viewHref = canViewPeople ? (id: string) => `/hrportal/hr/employees/${id}` : undefined;
  const others = employees.filter((e) => isCurrentStaff(e) && e.id !== ctx.employee.id).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/leave" crumbs={[{ label: "Leave Management" }, { label: "Leave Applications" }]}>
      <PageTitle
        title="Leave Applications"
        subtitle="View and manage leave applications."
        actions={
          <>
            <a href={hrefWith("/hrportal/hr/leave/export", { tab: params.tab, q: params.q, emp: params.emp, type: params.type })} className={outlineButtonClass}>
              <FileDown className="h-4 w-4" aria-hidden="true" /> Export
            </a>
            {has(ctx.permissions, "leave.manage") && (
              <Modal label="Add Leave Application" title="Add leave application" description="Record leave for an employee, for example from a paper form.">
                <ActionForm action={recordLeaveAction} submitLabel="Save leave application" resetOnSuccess className="space-y-4">
                  <Field label="Employee">
                    <select name="employeeId" required defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        Choose…
                      </option>
                      {others.map((e) => (
                        <option key={e.id} value={e.id}>
                          {employeeName(e)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <LeaveFields types={ctx.leaveTypes} relievers={relieverOptions({ id: "", departmentId: undefined }, employees, accounts).map((e) => ({ id: e.id, label: relieverLabel(e) }))} />
                  <Field label="Status">
                    <select name="status" defaultValue="pending" className={inputClass}>
                      <option value="pending">Pending (needs a decision)</option>
                      <option value="approved">Already approved</option>
                    </select>
                  </Field>
                </ActionForm>
              </Modal>
            )}
          </>
        }
      />
      <LeaveCalendar leaveTypes={ctx.leaveTypes} employees={employees} leave={leave} weekStart={weekStart} basePath="/hrportal/hr/leave" params={params} personHref={viewHref} />
      <div className="mt-6">
        <LeaveListing leaveTypes={ctx.leaveTypes} rows={leave} employees={employees} basePath="/hrportal/hr/leave" params={params} canDecide={(l) => canDecideLeave(ctx.actor, l, employees, ctx.departments)} canManage={(l) => canManageApprovedLeave(ctx.actor, l, employees, ctx.departments)} today={todayLagos()} viewHref={viewHref} />
      </div>
    </PortalShell>
  );
}
