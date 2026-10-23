import { ScrollText } from "lucide-react";

import { deleteLeavePolicyAction, saveLeavePolicyAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { LEAVE_COLOR_STYLE } from "@/components/hr/leave-style";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { Badge, Card, Field, inputClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { requireHrPage, type HrContext } from "@/lib/hr/session";
import { EMPLOYMENT_TYPES, type HrLeavePolicy } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave policies" };

function PolicyFields({ policy, ctx }: { policy?: HrLeavePolicy; ctx: HrContext }) {
  return (
    <div className="space-y-4">
      {policy && <input type="hidden" name="policyId" value={policy.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Policy name">
          <input name="name" required defaultValue={policy?.name} placeholder="e.g. Standard staff leave" className={inputClass} />
        </Field>
        <Field label="Applies to">
          <select name="scope" defaultValue={policy?.scope ?? "all"} className={inputClass}>
            <option value="all">All staff</option>
            <option value="department">One department</option>
            <option value="employmentType">One employment type</option>
          </select>
        </Field>
        <Field label="Department (if one department)">
          <select name="departmentId" defaultValue={policy?.scope === "department" ? policy.scopeValue : ""} className={inputClass}>
            <option value="">—</option>
            {ctx.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Employment type (if one type)">
          <select name="employmentType" defaultValue={policy?.scope === "employmentType" ? policy.scopeValue : ""} className={inputClass}>
            <option value="">—</option>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Description (optional)">
        <input name="description" defaultValue={policy?.description} className={inputClass} />
      </Field>
      <fieldset className="rounded-lg border border-admin-border p-3">
        <legend className="px-1 text-sm font-medium">Days a year per leave type</legend>
        <p className="mb-3 text-xs text-admin-muted">Leave a box blank to use a broader policy or the leave type&apos;s default.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ctx.leaveTypes
            .filter((t) => t.active || policy?.entitlements[t.id] !== undefined)
            .map((t) => (
              <label key={t.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${LEAVE_COLOR_STYLE[t.color].dot}`} aria-hidden="true" />
                  {t.name}
                </span>
                <input name={`days_${t.id}`} type="number" min={0} max={366} step="0.5" defaultValue={policy?.entitlements[t.id] ?? ""} placeholder={t.defaultDays === null ? "No limit" : String(t.defaultDays)} aria-label={`${t.name} days a year`} className={`${inputClass} mt-0 max-w-28`} />
              </label>
            ))}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Carry-over limit (days)" hint="Most unused days that roll into next year, for leave types set to carry over.">
          <input name="carryOverMax" type="number" min={0} max={366} defaultValue={policy?.carryOverMax ?? 0} className={inputClass} />
        </Field>
        {policy && (
          <Field label="Status">
            <select name="active" defaultValue={policy.active ? "true" : "false"} className={inputClass}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </Field>
        )}
      </div>
    </div>
  );
}

export default async function LeavePoliciesPage() {
  const ctx = await requireHrPage(["leave.view_all", "leave.manage"]);
  const [policies, employees] = await Promise.all([readStore("hrLeavePolicies"), readStore("hrEmployees")]);
  const canManage = has(ctx.permissions, "leave.manage");
  const scopeLabel = (p: HrLeavePolicy) =>
    p.scope === "all" ? "All staff" : p.scope === "department" ? `Department: ${ctx.departments.find((d) => d.id === p.scopeValue)?.name ?? "removed department"}` : `Employment type: ${p.scopeValue}`;
  const covered = (p: HrLeavePolicy) =>
    employees.filter((e) => (e.status === "active" || e.status === "probation") && (p.scope === "all" || (p.scope === "department" ? e.departmentId === p.scopeValue : e.employmentType === p.scopeValue))).length;
  const order = { department: 0, employmentType: 1, all: 2 } as const;
  const sorted = [...policies].sort((a, b) => Number(b.active) - Number(a.active) || order[a.scope] - order[b.scope] || a.name.localeCompare(b.name));
  const typeName = (id: string) => ctx.leaveTypes.find((t) => t.id === id)?.name ?? id;

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/leave/policies" crumbs={[{ label: "Leave Management", href: "/hrportal/hr/leave" }, { label: "Leave Policies" }]}>
      <PageTitle
        title="Leave Policies"
        subtitle="Yearly leave allowances for groups of staff. A department's policy beats an employment-type policy, which beats the all-staff policy."
        actions={
          canManage && (
            <Modal label="Add Leave Policy" title="Add a leave policy" wide>
              <ActionForm action={saveLeavePolicyAction} submitLabel="Create policy" resetOnSuccess className="space-y-4">
                <PolicyFields ctx={ctx} />
              </ActionForm>
            </Modal>
          )
        }
      />
      {sorted.length === 0 && (
        <Card>
          <p className="py-6 text-center text-sm text-admin-muted">
            No policies yet, so everyone gets each leave type&apos;s default allowance. Add an all-staff policy with LHI&apos;s allowances to get started.
          </p>
        </Card>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        {sorted.map((p) => (
          <section key={p.id} className="hr-card">
            <div className="flex items-start justify-between gap-3 border-b border-admin-border px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-admin-primary-soft text-admin-primary">
                  <ScrollText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-xs text-admin-muted">
                    {scopeLabel(p)} · {covered(p)} staff
                  </p>
                </div>
              </div>
              <Badge status={p.active ? "active" : "cancelled"} label={p.active ? "Active" : "Inactive"} />
            </div>
            <div className="px-5 py-4 text-sm">
              {p.description && <p className="mb-3 text-admin-muted">{p.description}</p>}
              <ul className="divide-y divide-admin-border">
                {Object.entries(p.entitlements).map(([id, d]) => (
                  <li key={id} className="flex justify-between py-1.5">
                    <span>{typeName(id)}</span>
                    <span className="font-mono font-semibold">{d} days</span>
                  </li>
                ))}
              </ul>
              {Object.keys(p.entitlements).length === 0 && <p className="text-admin-muted">No allowances set.</p>}
              <p className="mt-3 text-xs text-admin-muted">Carry-over limit: {p.carryOverMax} days</p>
              {canManage && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Modal label="Edit" outline title={`Edit ${p.name}`} wide>
                    <ActionForm action={saveLeavePolicyAction} submitLabel="Save policy" className="space-y-4">
                      <PolicyFields policy={p} ctx={ctx} />
                    </ActionForm>
                  </Modal>
                  <ActionForm action={deleteLeavePolicyAction} submitLabel="Delete" danger confirmText={`Delete the policy ${p.name}? Staff it covers fall back to broader policies.`}>
                    <input type="hidden" name="policyId" value={p.id} />
                  </ActionForm>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </PortalShell>
  );
}
