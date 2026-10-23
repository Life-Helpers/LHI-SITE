import {
  createAccountAction,
  issueResetLinkAction,
  relinkAccountAction,
  setAccountActiveAction,
  setAccountRoleAction,
  setExtraPermissionsAction,
} from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PermissionChecks, permissionLabel, sortPerms } from "@/components/hr/leave-parts";
import { Modal } from "@/components/hr/modal";
import { PortalShell } from "@/components/hr/portal-shell";
import { Avatar, Badge, Field, fmtDateTime, inputClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { allRoles, canGrant, canManageAccount, findRole, has } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName, isCurrentStaff } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Accounts" };

export default async function AccountsPage() {
  const ctx = await requireHrPage("accounts.manage");
  const [accounts, employees, customRoles] = await Promise.all([readStore("hrAccounts"), readStore("hrEmployees"), readStore("hrRoles")]);
  const roles = allRoles(customRoles);
  const canPerms = has(ctx.permissions, "roles.manage");
  // Only roles the signed-in person could hand out are offered (the server checks again).
  const assignable = roles.filter((r) => canGrant(ctx.actor, r.permissions));
  const employeeOf = (id: string) => employees.find((e) => e.id === id);
  const unlinked = employees
    .filter((e) => isCurrentStaff(e) && !accounts.some((a) => a.employeeId === e.id))
    .sort((a, b) => employeeName(a).localeCompare(employeeName(b)));
  const sorted = [...accounts].sort((a, b) => employeeName(employeeOf(a.employeeId)).localeCompare(employeeName(employeeOf(b.employeeId))));

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/accounts" crumbs={[{ label: "Administration" }, { label: "Accounts" }]}>
      <PageTitle
        title="Portal accounts"
        subtitle="Every staff member signs in at /hrportal. Their role decides what they see."
        actions={
          <Modal label="Create Account" title="Create a portal account" description="Link an employee record to a sign-in, choose a role, and get a one-time invite link." wide>
            {/* Always rendered, so the invite link stays on screen after the last employee gets an account. */}
            {unlinked.length === 0 && <p className="mb-3 text-sm text-admin-muted">Every active employee has an account. Add employees first under Employees.</p>}
            <ActionForm action={createAccountAction} submitLabel="Create account and get invite link" resetOnSuccess className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Employee">
                  <select name="employeeId" required className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Choose…
                    </option>
                    {unlinked.map((e) => (
                      <option key={e.id} value={e.id}>
                        {employeeName(e)}
                        {e.jobTitle ? ` — ${e.jobTitle}` : ""}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Sign-in email" hint="Leave blank to use their work email.">
                  <input name="email" type="email" className={inputClass} />
                </Field>
                <Field label="Role">
                  <select name="roleId" required className={inputClass} defaultValue="employee">
                    {assignable.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              {canPerms && (
                <details>
                  <summary className="cursor-pointer text-sm font-semibold text-admin-primary">Extra permissions (optional)</summary>
                  <p className="my-2 text-xs text-admin-muted">Only add what this person needs beyond their role.</p>
                  <PermissionChecks selected={[]} grantable={ctx.permissions} />
                </details>
              )}
              </ActionForm>
          </Modal>
        }
      />

      <div className="space-y-3">
        {sorted.map((a) => {
          const person = employeeOf(a.employeeId);
          const role = findRole(a.roleId, customRoles);
          const manageable = canManageAccount(ctx.actor, a);
          const state = !a.active ? "inactive" : a.passwordHash ? "active" : "invited";
          return (
            <details key={a.id} id={`account-${a.id}`} className="hr-card">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 px-5 py-4">
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar name={person ? employeeName(person) : a.email} />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{person ? employeeName(person) : "Unlinked account"}</span>
                    <span className="block truncate text-sm text-admin-muted">{a.email}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <span>{role?.name ?? "No valid role"}</span>
                  <Badge status={state} />
                </span>
              </summary>
              <div className="space-y-5 border-t border-admin-border px-5 py-5">
                <p className="text-xs text-admin-muted">
                  Created {fmtDateTime(a.createdAt)} by {a.createdBy} · Last sign-in {fmtDateTime(a.lastLoginAt)}
                  {a.deactivatedAt ? ` · Deactivated ${fmtDateTime(a.deactivatedAt)}` : ""}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Effective access:</span>{" "}
                  {sortPerms([...(role?.permissions ?? []), ...a.extraPermissions]).map(permissionLabel).join(", ") || "none"}
                </p>
                {!manageable ? (
                  <p className="rounded-lg bg-admin-bg px-3 py-2 text-sm text-admin-muted">This is your own account. Another HR administrator must change it.</p>
                ) : (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <ActionForm action={setAccountRoleAction} submitLabel="Change role" className="space-y-2">
                      <input type="hidden" name="accountId" value={a.id} />
                      <Field label="Role">
                        <select name="roleId" defaultValue={a.roleId} className={inputClass}>
                          {!role && <option value={a.roleId}>No valid role</option>}
                          {roles.map((r) => (
                            <option key={r.id} value={r.id} disabled={!canGrant(ctx.actor, r.permissions)}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </ActionForm>
                    <div className="space-y-3">
                      <ActionForm
                        action={setAccountActiveAction}
                        submitLabel={a.active ? "Deactivate account" : "Reactivate account"}
                        danger={a.active}
                        confirmText={a.active ? "Deactivate this account? They will be signed out everywhere." : undefined}
                      >
                        <input type="hidden" name="accountId" value={a.id} />
                        <input type="hidden" name="active" value={a.active ? "false" : "true"} />
                      </ActionForm>
                      {a.active && (
                        <ActionForm action={issueResetLinkAction} submitLabel={a.passwordHash ? "Get password reset link" : "Get new invite link"}>
                          <input type="hidden" name="accountId" value={a.id} />
                        </ActionForm>
                      )}
                    </div>
                    {canPerms && (
                      <div className="lg:col-span-2">
                        <ActionForm action={setExtraPermissionsAction} submitLabel="Save extra permissions" className="space-y-3">
                          <input type="hidden" name="accountId" value={a.id} />
                          <p className="text-sm font-medium">Extra permissions on top of the role</p>
                          <PermissionChecks selected={a.extraPermissions} grantable={ctx.permissions} />
                        </ActionForm>
                      </div>
                    )}
                    {unlinked.length > 0 && (
                      <ActionForm action={relinkAccountAction} submitLabel="Link to this employee" className="space-y-2 lg:col-span-2">
                        <input type="hidden" name="accountId" value={a.id} />
                        <Field label="Linked employee record" hint={`Currently: ${person ? employeeName(person) : "none"}`}>
                          <select name="employeeId" defaultValue="" className={`${inputClass} sm:w-1/2`}>
                            <option value="" disabled>
                              Choose another employee…
                            </option>
                            {unlinked.map((e) => (
                              <option key={e.id} value={e.id}>
                                {employeeName(e)}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </ActionForm>
                    )}
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </PortalShell>
  );
}
