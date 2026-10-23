import { cancelMyLeaveAction, decideLeaveAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Badge, fmtDate, inputClass, Table } from "@/components/hr/ui";
import { ALL_HR_PERMISSIONS, HR_PERMISSION_GROUPS, type HrLeaveRequest, type HrPermission } from "@/lib/hr/types";

/** Leave requests table. `who` names the employee; `canDecide`/`canCancel` are decided on the server. */
export function LeaveTable({
  rows,
  who,
  canDecide,
  canCancel,
  empty = "No leave requests.",
}: {
  rows: HrLeaveRequest[];
  who?: (employeeId: string) => string;
  canDecide?: (l: HrLeaveRequest) => boolean;
  canCancel?: (l: HrLeaveRequest) => boolean;
  empty?: string;
}) {
  const head = [...(who ? ["Employee"] : []), "Type", "Dates", "Days", "Status", "Details", ""];
  return (
    <Table head={head} empty={rows.length === 0 && empty}>
      {rows.map((l) => (
        <tr key={l.id} className="align-top">
          {who && <td className="px-3 py-3 font-medium">{who(l.employeeId)}</td>}
          <td className="px-3 py-3">{l.type}</td>
          <td className="px-3 py-3 whitespace-nowrap">
            {fmtDate(l.startDate)} – {fmtDate(l.endDate)}
          </td>
          <td className="px-3 py-3">{l.days}</td>
          <td className="px-3 py-3">
            <Badge status={l.status} />
          </td>
          <td className="px-3 py-3 text-xs text-admin-muted">
            {l.reason && <p>“{l.reason}”</p>}
            {l.decidedByName && (
              <p className="mt-1">
                {l.status} by {l.decidedByName} on {fmtDate(l.decidedAt)}
                {l.decisionNote ? `: ${l.decisionNote}` : ""}
              </p>
            )}
          </td>
          <td className="px-3 py-3">
            {canDecide?.(l) && (
              <ActionForm action={decideLeaveAction} submitLabel="Save" className="flex min-w-[220px] flex-col gap-2">
                <input type="hidden" name="leaveId" value={l.id} />
                <select name="decision" aria-label="Decision" className={inputClass} defaultValue="approve">
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                </select>
                <input name="note" placeholder="Note (optional)" aria-label="Note" className={inputClass} />
              </ActionForm>
            )}
            {canCancel?.(l) && (
              <ActionForm action={cancelMyLeaveAction} submitLabel="Cancel request" danger confirmText="Cancel this leave request?">
                <input type="hidden" name="leaveId" value={l.id} />
              </ActionForm>
            )}
          </td>
        </tr>
      ))}
    </Table>
  );
}

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
