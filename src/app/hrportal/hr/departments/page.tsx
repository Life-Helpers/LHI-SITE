import { Building2 } from "lucide-react";

import { addStandardDepartmentsAction, deleteDepartmentAction, saveDepartmentAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { Badge, Card, Field, inputClass, PageTitle, Person } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, isCurrentStaff, type HrDepartment, type HrEmployee } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Departments" };

/** Name, description, head and approvers: shared by the create and edit forms. */
function DepartmentFields({ dept, staff }: { dept?: HrDepartment; staff: HrEmployee[] }) {
  return (
    <div className="space-y-4">
      {dept && <input type="hidden" name="departmentId" value={dept.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Department name">
          <input name="name" required defaultValue={dept?.name} className={inputClass} />
        </Field>
        <Field label="Head of department (director)" hint="Receives leave requests from this department's staff.">
          <select name="headEmployeeId" defaultValue={dept?.headEmployeeId ?? ""} className={inputClass}>
            <option value="">— Not set —</option>
            {staff.map((e) => (
              <option key={e.id} value={e.id}>
                {employeeName(e)}
                {e.jobTitle ? ` — ${e.jobTitle}` : ""}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Description (optional)">
        <input name="description" defaultValue={dept?.description} className={inputClass} />
      </Field>
      <fieldset className="rounded-lg border border-admin-border p-3">
        <legend className="px-1 text-sm font-medium">Other leave approvers (optional)</legend>
        <p className="mb-2 text-xs text-admin-muted">For example a deputy director or programme manager. They also receive and can decide this department&apos;s leave requests.</p>
        <div className="grid max-h-48 gap-1.5 overflow-y-auto sm:grid-cols-2">
          {staff.map((e) => (
            <label key={e.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="approverIds" value={e.id} defaultChecked={dept?.approverIds.includes(e.id)} />
              {employeeName(e)}
            </label>
          ))}
        </div>
      </fieldset>
      {dept && (
        <Field label="Status">
          <select name="active" defaultValue={dept.active ? "true" : "false"} className={`${inputClass} sm:w-1/2`}>
            <option value="true">Open (staff can choose it)</option>
            <option value="false">Closed</option>
          </select>
        </Field>
      )}
    </div>
  );
}

export default async function DepartmentsPage() {
  const ctx = await requireHrPage(["employees.view", "employees.manage"]);
  const employees = await readStore("hrEmployees");
  const departments = [...ctx.departments].sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));
  const staff = employees.filter(isCurrentStaff).sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const canEdit = has(ctx.permissions, "employees.manage");
  const nameOf = (id: string | null) => (id ? employeeName(employees.find((e) => e.id === id)) : "");
  const unassigned = staff.filter((e) => !e.departmentId).length;

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/departments" crumbs={[{ label: "HR" }, { label: "Departments" }]}>
      <PageTitle
        title="Departments"
        subtitle="Each department's head and approvers receive leave requests from its staff, alongside each person's line manager."
        actions={
          canEdit && (
            <>
              <ActionForm action={addStandardDepartmentsAction} submitLabel="Add LHI's standard departments" className="flex flex-col items-end gap-2" submitClassName="!bg-admin-card !text-admin-text border border-admin-border" />
              <Modal label="Add Department" title="Add a department" wide>
                <ActionForm action={saveDepartmentAction} submitLabel="Create department" resetOnSuccess className="space-y-4">
                  <DepartmentFields staff={staff} />
                </ActionForm>
              </Modal>
            </>
          )
        }
      />
      {unassigned > 0 && departments.length > 0 && (
        <p className="mb-4 text-sm text-admin-muted">
          {unassigned} current staff member{unassigned === 1 ? " hasn't" : "s haven't"} chosen a department yet. They can choose it under My record, or HR can set it on their employee record.
        </p>
      )}
      {departments.length === 0 && (
        <Card>
          <p className="py-6 text-center text-sm text-admin-muted">No departments yet. Add LHI&apos;s standard departments, or add your own.</p>
        </Card>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {departments.map((d) => {
          const members = staff.filter((e) => e.departmentId === d.id);
          return (
            <section key={d.id} className="hr-card">
              <div className="flex items-start justify-between gap-3 border-b border-admin-border px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-admin-primary-soft text-admin-primary">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{d.name}</h2>
                    <p className="text-xs text-admin-muted">
                      {members.length} staff member{members.length === 1 ? "" : "s"}
                      {d.description ? ` · ${d.description}` : ""}
                    </p>
                  </div>
                </div>
                <Badge status={d.active ? "active" : "cancelled"} label={d.active ? "Open" : "Closed"} />
              </div>
              <div className="space-y-3 px-5 py-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">Head of department</p>
                  {d.headEmployeeId ? <div className="mt-1.5"><Person name={nameOf(d.headEmployeeId)} sub="Receives leave requests" /></div> : <p className="mt-1 text-admin-warning">Not set: leave goes to line managers and HR only.</p>}
                </div>
                {d.approverIds.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">Other approvers</p>
                    <p className="mt-1">{d.approverIds.map(nameOf).join(", ")}</p>
                  </div>
                )}
                {canEdit && (
                  <details className="pt-1">
                    <summary className="cursor-pointer text-sm font-semibold text-admin-primary">Edit department</summary>
                    <div className="mt-3">
                      <ActionForm action={saveDepartmentAction} submitLabel="Save department" className="space-y-4">
                        <DepartmentFields dept={d} staff={staff} />
                      </ActionForm>
                      <div className="mt-4 border-t border-admin-border pt-4">
                        <ActionForm action={deleteDepartmentAction} submitLabel="Delete department" danger confirmText={`Delete ${d.name}? This can't be undone.`}>
                          <input type="hidden" name="departmentId" value={d.id} />
                          <p className="text-xs text-admin-muted">Only a department with no staff and no leave policies can be deleted; otherwise close it instead.</p>
                        </ActionForm>
                      </div>
                    </div>
                  </details>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </PortalShell>
  );
}
