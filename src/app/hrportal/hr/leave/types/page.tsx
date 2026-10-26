import { saveLeaveTypeAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { LEAVE_COLOR_STYLE } from "@/components/hr/leave-style";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { Badge, Field, inputClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { LEAVE_COLORS, type HrLeaveType } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave types" };

function TypeFields({ type }: { type?: HrLeaveType }) {
  return (
    <div className="space-y-4">
      {type && <input type="hidden" name="typeId" value={type.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" required defaultValue={type?.name} placeholder="e.g. Annual Leave" className={inputClass} />
        </Field>
        <Field label="Days a year (default)" hint="Leave blank for no limit. Leave Policies can set different days for groups of staff.">
          <input name="defaultDays" type="number" min={0} max={366} step="0.5" defaultValue={type?.defaultDays ?? ""} className={inputClass} />
        </Field>
      </div>
      <Field label="Description (optional)">
        <input name="description" defaultValue={type?.description} className={inputClass} />
      </Field>
      <fieldset>
        <legend className="text-sm font-medium">Colour</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {LEAVE_COLORS.map((c) => (
            <label key={c} className="cursor-pointer">
              <input type="radio" name="color" value={c} defaultChecked={(type?.color ?? "teal") === c} className="peer sr-only" />
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-admin-text peer-focus-visible:ring-2 ${LEAVE_COLOR_STYLE[c].dot}`}>
                <span className="sr-only">{c}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="paid" defaultChecked={type?.paid ?? true} /> Paid leave
        </label>
      </div>
      {type && (
        <Field label="Status">
          <select name="active" defaultValue={type.active ? "true" : "false"} className={`${inputClass} sm:w-1/2`}>
            <option value="true">Open (staff can request it)</option>
            <option value="false">Retired (kept for history)</option>
          </select>
        </Field>
      )}
    </div>
  );
}

export default async function LeaveTypesPage() {
  const ctx = await requireHrPage(["leave.view_all", "leave.manage"]);
  const [leave, policies] = await Promise.all([readStore("hrLeave"), readStore("hrLeavePolicies")]);
  // Active policies set the real allowance; the type's own days are only the starting default.
  const policyDays = (typeId: string) => [...new Set(policies.filter((p) => p.active && p.typeId === typeId).map((p) => (p.days === null ? "no limit" : `${p.days} days`)))];
  const canManage = has(ctx.permissions, "leave.manage");
  const types = [...ctx.leaveTypes].sort((a, b) => Number(b.active) - Number(a.active));

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/leave/types" crumbs={[{ label: "Leave Management", href: "/hrportal/hr/leave" }, { label: "Leave Types" }]}>
      <PageTitle
        title="Leave Types"
        subtitle="The kinds of leave staff can request, their colour on the calendar and their default yearly allowance."
        actions={
          canManage && (
            <Modal label="Add Leave Type" title="Add a leave type" wide>
              <ActionForm action={saveLeaveTypeAction} submitLabel="Create leave type" resetOnSuccess className="space-y-4">
                <TypeFields />
              </ActionForm>
            </Modal>
          )
        }
      />
      <section className="overflow-hidden hr-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                <th scope="col" className="px-4 py-3">Leave Type</th>
                <th scope="col" className="px-4 py-3">Days a Year</th>
                <th scope="col" className="px-4 py-3">Paid</th>
                <th scope="col" className="px-4 py-3">Requests</th>
                <th scope="col" className="px-4 py-3">Status</th>
                {canManage && <th scope="col" className="px-4 py-3"><span className="sr-only">Edit</span></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {types.map((t) => (
                <tr key={t.id} className="align-top">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span className={`h-3 w-3 rounded-full ${LEAVE_COLOR_STYLE[t.color].dot}`} aria-hidden="true" />
                      {t.name}
                    </span>
                    {t.description && <span className="mt-0.5 block text-xs text-admin-muted">{t.description}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {t.defaultDays === null ? <span className="text-admin-muted">No limit</span> : `${t.defaultDays} days`}
                    {policyDays(t.id).length > 0 && policyDays(t.id).join() !== (t.defaultDays === null ? "no limit" : `${t.defaultDays} days`) && (
                      <span className="block text-xs text-admin-warning">Policy sets {policyDays(t.id).join(" / ")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{t.paid ? "Paid" : "Unpaid"}</td>
                  <td className="px-4 py-3">{leave.filter((l) => l.type === t.id).length}</td>
                  <td className="px-4 py-3">
                    <Badge status={t.active ? "active" : "cancelled"} label={t.active ? "Open" : "Retired"} />
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      <Modal label="Edit" outline title={`Edit ${t.name}`} wide>
                        <ActionForm action={saveLeaveTypeAction} submitLabel="Save leave type" className="space-y-4 text-left">
                          <TypeFields type={t} />
                        </ActionForm>
                      </Modal>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="mt-4 text-xs text-admin-muted">Leave types aren&apos;t deleted, so past requests keep their meaning; retire a type to stop new requests.</p>
    </PortalShell>
  );
}
