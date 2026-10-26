import Link from "next/link";
import { ArrowUpDown, CalendarDays, CircleCheck, CircleX, LayoutGrid, Search } from "lucide-react";

import { deleteLeavePolicyAction, saveLeavePolicyAction, setLeavePolicyActiveAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { AutoSubmitSelect } from "@/components/hr/filters";
import { leaveName, leaveStyle } from "@/components/hr/leave-style";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { hrefWith } from "@/components/hr/query";
import { QuickAction } from "@/components/hr/quick-action";
import { Badge, Field, inputClass, outlineButtonClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { requireHrPage, type HrContext } from "@/lib/hr/session";
import { EMPLOYMENT_TYPES, isCurrentStaff, type HrLeavePolicy } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave policies" };

type Params = { q?: string; type?: string; tab?: string; sort?: string; dir?: string };

function PolicyFields({ policy, ctx }: { policy?: HrLeavePolicy; ctx: HrContext }) {
  return (
    <div className="space-y-4">
      {policy && <input type="hidden" name="policyId" value={policy.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Policy name">
          <input name="name" required defaultValue={policy?.name} placeholder="e.g. Annual Leave Policy" className={inputClass} />
        </Field>
        <Field label="Leave type">
          <select name="typeId" required defaultValue={policy?.typeId ?? ""} className={inputClass}>
            <option value="" disabled>
              Choose…
            </option>
            {ctx.leaveTypes
              .filter((t) => t.active || t.id === policy?.typeId)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Days a year" hint="Leave blank for no limit.">
          <input name="days" type="number" min={0} max={366} step="0.5" defaultValue={policy?.days ?? ""} placeholder="No limit" className={inputClass} />
        </Field>
        <Field label="Carry forward (days)" hint="Most unused days that roll into next year. 0 = none.">
          <input name="carryForward" type="number" min={0} max={366} defaultValue={policy?.carryForward ?? 0} className={inputClass} />
        </Field>
        <Field label="Approval" hint="Not required: requests are approved as soon as they're sent.">
          <select name="approvalRequired" defaultValue={policy?.approvalRequired === false ? "false" : "true"} className={inputClass}>
            <option value="true">Required</option>
            <option value="false">Not required</option>
          </select>
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
      {policy && (
        <Field label="Status">
          <select name="active" defaultValue={policy.active ? "true" : "false"} className={`${inputClass} sm:w-1/2`}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </Field>
      )}
    </div>
  );
}

const TABS = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "active", label: "Active", icon: CircleCheck },
  { id: "inactive", label: "Inactive", icon: CircleX },
] as const;

export default async function LeavePoliciesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const ctx = await requireHrPage(["leave.view_all", "leave.manage"]);
  const params = await searchParams;
  const [policies, employees] = await Promise.all([readStore("hrLeavePolicies"), readStore("hrEmployees")]);
  const canManage = has(ctx.permissions, "leave.manage");
  const types = ctx.leaveTypes;
  const base = "/hrportal/hr/leave/policies";
  const link = (changes: Record<string, string | undefined>) => hrefWith(base, params as Record<string, string | undefined>, changes);

  const q = (params.q ?? "").trim().toLowerCase();
  const typeFilter = types.some((t) => t.id === params.type) ? params.type! : "";
  const tab = TABS.some((t) => t.id === params.tab) ? params.tab! : "all";
  const filtered = policies.filter(
    (p) => (!typeFilter || p.typeId === typeFilter) && (!q || `${p.name} ${leaveName(p.typeId, types)} ${p.description}`.toLowerCase().includes(q)),
  );
  const counts = { all: filtered.length, active: filtered.filter((p) => p.active).length, inactive: filtered.filter((p) => !p.active).length };
  const typeOrder = (id: string) => {
    const i = types.findIndex((t) => t.id === id);
    return i === -1 ? types.length : i;
  };
  const sort = params.sort === "name" || params.sort === "created" ? params.sort : "";
  const dir = params.dir === "desc" ? -1 : 1;
  const rows = filtered
    .filter((p) => tab === "all" || (tab === "active" ? p.active : !p.active))
    .sort((a, b) =>
      sort === "name"
        ? dir * a.name.localeCompare(b.name)
        : sort === "created"
          ? dir * a.createdAt.localeCompare(b.createdAt)
          : b.createdAt.localeCompare(a.createdAt) || typeOrder(a.typeId) - typeOrder(b.typeId),
    );

  const scopeLabel = (p: HrLeavePolicy) =>
    p.scope === "all" ? "All staff" : p.scope === "department" ? `Department: ${ctx.departments.find((d) => d.id === p.scopeValue)?.name ?? "removed department"}` : `Employment type: ${p.scopeValue}`;
  const covered = (p: HrLeavePolicy) =>
    employees.filter((e) => isCurrentStaff(e) && (p.scope === "all" || (p.scope === "department" ? e.departmentId === p.scopeValue : e.employmentType === p.scopeValue))).length;
  const sortLink = (key: "name" | "created") => link({ sort: key, dir: sort === key && dir === 1 ? "desc" : undefined });

  return (
    <PortalShell ctx={ctx} current={base} crumbs={[{ label: "Leave Management", href: "/hrportal/hr/leave" }, { label: "Leave Policies" }]}>
      <PageTitle
        title="Leave Policies"
        subtitle="Manage leave policies for your organization."
        actions={
          canManage && (
            <Modal label="Add Leave Policy" title="Add a leave policy" description="A department's policy beats an employment-type policy, which beats the all-staff policy." wide>
              <ActionForm action={saveLeavePolicyAction} submitLabel="Create policy" resetOnSuccess className="space-y-4">
                <PolicyFields ctx={ctx} />
              </ActionForm>
            </Modal>
          )
        }
      />

      <section className="hr-card mb-5">
        <form method="get" action={base} className="flex flex-wrap items-center gap-3 px-4 pb-3 pt-4">
          {tab !== "all" && <input type="hidden" name="tab" value={tab} />}
          <div className="relative w-full max-w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted" aria-hidden="true" />
            <input name="q" defaultValue={params.q ?? ""} placeholder="Search..." aria-label="Search policies" className={`${inputClass} mt-0 pl-9`} />
          </div>
          <AutoSubmitSelect name="type" defaultValue={typeFilter} aria-label="Leave type" className={`${inputClass} mt-0 max-w-48`}>
            <option value="">All Leave Types</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </AutoSubmitSelect>
          <button type="submit" className={`${outlineButtonClass} ml-auto`}>
            Filters
          </button>
        </form>
        <nav aria-label="Policy status" className="flex gap-1 overflow-x-auto border-t border-admin-border px-2">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={link({ tab: t.id === "all" ? undefined : t.id })}
              aria-current={tab === t.id ? "page" : undefined}
              className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${tab === t.id ? "border-admin-primary text-admin-primary" : "border-transparent text-admin-muted hover:text-admin-text"}`}
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${tab === t.id ? "bg-admin-primary text-white" : "bg-admin-bg text-admin-muted"}`}>{counts[t.id]}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="hr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                <th scope="col" className="px-4 py-3">#</th>
                <th scope="col" className="px-4 py-3">
                  <Link href={sortLink("name")} className="inline-flex items-center gap-1 hover:text-admin-text">
                    Policy Name <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </th>
                <th scope="col" className="px-4 py-3">Leave Type</th>
                <th scope="col" className="px-4 py-3">Days a Year</th>
                <th scope="col" className="px-4 py-3">Carry Forward</th>
                <th scope="col" className="px-4 py-3">Approval</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">
                  <Link href={sortLink("created")} className="inline-flex items-center gap-1 hover:text-admin-text">
                    Created At <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </th>
                <th scope="col" className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {rows.map((p, i) => (
                <tr key={p.id} className="hover:bg-admin-bg/60">
                  <td className="px-4 py-3 text-admin-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <span className="block font-medium">{p.name}</span>
                    {p.scope !== "all" && <span className="block text-xs text-admin-muted">{scopeLabel(p)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${leaveStyle(p.typeId, types).dot}`} aria-hidden="true" />
                      {leaveName(p.typeId, types)}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{p.days === null ? "No limit" : `${p.days} days`}</td>
                  <td className="px-4 py-3 tabular-nums">{p.carryForward} days</td>
                  <td className="px-4 py-3">
                    <Badge status={p.approvalRequired ? "pending" : "approved"} label={p.approvalRequired ? "Required" : "Not Required"} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={p.active ? "active" : "inactive"} label={p.active ? "Active" : "Inactive"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-admin-muted">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {p.createdAt.slice(0, 10)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Modal label="View" iconOnly icon="view" title={p.name}>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                          {(
                            [
                              ["Leave type", leaveName(p.typeId, types)],
                              ["Applies to", `${scopeLabel(p)} (${covered(p)} staff)`],
                              ["Days a year", p.days === null ? "No limit" : `${p.days} days`],
                              ["Carry forward", `${p.carryForward} days`],
                              ["Approval", p.approvalRequired ? "Required" : "Not required (approved when sent)"],
                              ["Status", p.active ? "Active" : "Inactive"],
                              ["Created", p.createdAt.slice(0, 10)],
                              ["Last changed", p.updatedAt.slice(0, 10)],
                            ] as const
                          ).map(([k, v]) => (
                            <div key={k}>
                              <dt className="text-xs text-admin-muted">{k}</dt>
                              <dd className="font-medium">{v}</dd>
                            </div>
                          ))}
                        </dl>
                        {p.description && <p className="mt-4 text-sm text-admin-muted">{p.description}</p>}
                      </Modal>
                      {canManage && (
                        <>
                          <Modal label="Edit" iconOnly icon="edit" title={`Edit ${p.name}`} wide>
                            <ActionForm action={saveLeavePolicyAction} submitLabel="Save policy" className="space-y-4 text-left">
                              <PolicyFields policy={p} ctx={ctx} />
                            </ActionForm>
                          </Modal>
                          <QuickAction
                            action={setLeavePolicyActiveAction}
                            fields={{ policyId: p.id, active: p.active ? "false" : "true" }}
                            kind={p.active ? "lock" : "unlock"}
                            label={p.active ? `Lock ${p.name}` : `Unlock ${p.name}`}
                            tip={p.active ? "Lock (make inactive)" : "Unlock (make active)"}
                          />
                          <QuickAction
                            action={deleteLeavePolicyAction}
                            fields={{ policyId: p.id }}
                            kind="delete"
                            label={`Delete ${p.name}`}
                            tip="Delete"
                            confirmText={`Delete ${p.name}? Staff it covers fall back to a broader policy or the leave type's default.`}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No policies match.</p>}
      </section>
      <p className="mt-3 text-xs text-admin-muted">
        Without an active policy, a leave type uses its default days from{" "}
        <Link href="/hrportal/hr/leave/types" className="font-medium text-admin-primary hover:underline">
          Leave Types
        </Link>
        . Locked policies stay on record but don&apos;t apply.
      </p>
    </PortalShell>
  );
}
