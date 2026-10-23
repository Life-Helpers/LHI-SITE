import { deleteRoleAction, saveRoleAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PermissionChecks, permissionLabel, sortPerms } from "@/components/hr/leave-parts";
import { PortalShell } from "@/components/hr/portal-shell";
import { Card, Field, inputClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { requireHrPage } from "@/lib/hr/session";
import { BUILT_IN_HR_ROLES } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Roles" };

export default async function RolesPage() {
  const ctx = await requireHrPage("roles.manage");
  const [customRoles, accounts] = await Promise.all([readStore("hrRoles"), readStore("hrAccounts")]);
  const count = (id: string) => accounts.filter((a) => a.roleId === id).length;

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/roles" crumbs={[{ label: "Administration" }, { label: "Roles & permissions" }]}>
      <PageTitle title="Roles & permissions" subtitle="Give each person the smallest role that lets them do their job; add single extra permissions on their account if needed." />

      <Card title="Built-in roles">
        <ul className="divide-y divide-admin-border">
          {BUILT_IN_HR_ROLES.map((r) => (
            <li key={r.id} className="py-3">
              <p className="font-semibold">
                {r.name} <span className="text-xs font-normal text-admin-muted">· {count(r.id)} account{count(r.id) === 1 ? "" : "s"}</span>
              </p>
              <p className="text-sm text-admin-muted">{r.description}</p>
              <p className="mt-1 text-xs">{sortPerms(r.permissions).map(permissionLabel).join(" · ")}</p>
            </li>
          ))}
        </ul>
      </Card>

      {customRoles.map((r) => (
        <div key={r.id} className="mt-6">
          <Card title={`${r.name} · ${count(r.id)} account${count(r.id) === 1 ? "" : "s"}`}>
            <ActionForm action={saveRoleAction} submitLabel="Save role" className="space-y-4">
              <input type="hidden" name="roleId" value={r.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input name="name" required defaultValue={r.name} className={inputClass} />
                </Field>
                <Field label="Description">
                  <input name="description" defaultValue={r.description} className={inputClass} />
                </Field>
              </div>
              <PermissionChecks selected={r.permissions} grantable={ctx.permissions} />
            </ActionForm>
            <div className="mt-3">
              <ActionForm action={deleteRoleAction} submitLabel="Delete role" danger confirmText={`Delete the role ${r.name}?`}>
                <input type="hidden" name="roleId" value={r.id} />
              </ActionForm>
            </div>
          </Card>
        </div>
      ))}

      <div className="mt-6">
        <Card title="Create a custom role">
          <ActionForm action={saveRoleAction} submitLabel="Create role" resetOnSuccess className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" required placeholder="e.g. Field Coordinator" className={inputClass} />
              </Field>
              <Field label="Description">
                <input name="description" className={inputClass} />
              </Field>
            </div>
            <PermissionChecks selected={["self.view", "self.update", "leave.request"]} grantable={ctx.permissions} />
          </ActionForm>
        </Card>
      </div>
    </PortalShell>
  );
}
