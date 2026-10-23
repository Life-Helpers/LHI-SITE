import { ALL_HR_PERMISSIONS, HR_PERMISSION_GROUPS, type HrPermission } from "@/lib/hr/types";

/**
 * Permission checkboxes, grouped. Permissions the signed-in person doesn't hold are disabled,
 * mirroring the server rule that nobody can hand out access they don't have.
 */
export function PermissionChecks({ selected, grantable, name = "permissions" }: { selected: readonly HrPermission[]; grantable: readonly HrPermission[]; name?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {HR_PERMISSION_GROUPS.map((g) => (
        <fieldset key={g.label} className="rounded-lg border border-admin-border p-3">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-admin-muted">{g.label}</legend>
          {g.items.map((item) => {
            const allowed = grantable.includes(item.id) || selected.includes(item.id);
            return (
              <label key={item.id} className={`mt-1.5 flex gap-2 text-sm ${allowed ? "" : "opacity-50"}`}>
                <input type="checkbox" name={name} value={item.id} defaultChecked={selected.includes(item.id)} disabled={!allowed} className="mt-1" />
                <span>
                  <span className="font-medium">{item.label}</span>
                  <span className="block text-xs text-admin-muted">{item.help}</span>
                </span>
              </label>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}

export const permissionLabel = (p: HrPermission) => HR_PERMISSION_GROUPS.flatMap((g) => [...g.items]).find((i) => i.id === p)?.label ?? p;

export const sortPerms = (perms: readonly HrPermission[]) => ALL_HR_PERMISSIONS.filter((p) => perms.includes(p));
