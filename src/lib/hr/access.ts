/**
 * HR portal authorization rules. Pure functions over records loaded on the server, so every
 * page, server action and report applies exactly the same rules and they can be unit-tested.
 * Nothing here trusts anything sent by the browser: callers pass the signed-in account's
 * records as read from the store.
 */
import {
  ALL_HR_PERMISSIONS,
  BUILT_IN_HR_ROLES,
  isHrPermission,
  type HrAccount,
  type HrDepartment,
  type HrEmployee,
  type HrLeaveRequest,
  type HrPermission,
  type HrRole,
  isCurrentStaff,
} from "@/lib/hr/types";

export function allRoles(customRoles: HrRole[]): HrRole[] {
  return [...BUILT_IN_HR_ROLES, ...customRoles.filter((r) => !BUILT_IN_HR_ROLES.some((b) => b.id === r.id))];
}

export function findRole(roleId: string, customRoles: HrRole[]): HrRole | undefined {
  return allRoles(customRoles).find((r) => r.id === roleId);
}

/**
 * What an account may do right now. Inactive accounts, accounts whose role no longer exists,
 * and accounts not linked to an active employee get nothing.
 */
export function effectivePermissions(
  account: HrAccount | undefined,
  customRoles: HrRole[],
  employee: HrEmployee | undefined,
  departments: HrDepartment[] = [],
): HrPermission[] {
  if (!account || !account.active || !employee || !isCurrentStaff(employee)) return [];
  const role = findRole(account.roleId, customRoles);
  if (!role) return [];
  const granted = new Set<HrPermission>([...role.permissions, ...account.extraPermissions].filter(isHrPermission));
  // Heads and approvers HR has named for a department look after that department's staff.
  if (role.permissions.length && leadsDepartments(employee.id, departments).length) {
    granted.add("team.view");
    granted.add("team.leave.approve");
  }
  return ALL_HR_PERMISSIONS.filter((p) => granted.has(p));
}

/** Active departments this employee heads or approves leave for. */
export function leadsDepartments(employeeId: string, departments: HrDepartment[]): HrDepartment[] {
  return departments.filter((d) => d.active && (d.headEmployeeId === employeeId || d.approverIds.includes(employeeId)));
}

/** Staff in the departments this employee heads or approves for (never themselves). */
export function departmentStaffOf(employeeId: string, employees: HrEmployee[], departments: HrDepartment[]): Set<string> {
  const ids = new Set(leadsDepartments(employeeId, departments).map((d) => d.id));
  return new Set(employees.filter((e) => e.id !== employeeId && e.departmentId && ids.has(e.departmentId)).map((e) => e.id));
}

/** Everyone a manager or department head looks after: their reporting line plus their departments' staff. */
export function teamOf(employeeId: string, employees: HrEmployee[], departments: HrDepartment[] = []): Set<string> {
  return new Set([...reportsOf(employeeId, employees), ...departmentStaffOf(employeeId, employees, departments)]);
}

/** Who receives this person's leave requests: their line manager and their department's head and approvers. */
export function approversFor(employee: HrEmployee, employees: HrEmployee[], departments: HrDepartment[]): HrEmployee[] {
  const dept = departments.find((d) => d.active && d.id === employee.departmentId);
  const ids = new Set([employee.managerId, dept?.headEmployeeId, ...(dept?.approverIds ?? [])].filter((id): id is string => Boolean(id) && id !== employee.id));
  return employees.filter((e) => ids.has(e.id) && isCurrentStaff(e));
}

export type AccessProblem = "inactive" | "no-role" | "no-employee" | null;

/** Why an account has no access (shown to the person), or null when it has a valid role. */
export function accessProblem(account: HrAccount, customRoles: HrRole[], employee: HrEmployee | undefined): AccessProblem {
  if (!account.active) return "inactive";
  if (!employee || !isCurrentStaff(employee)) return "no-employee";
  if (!findRole(account.roleId, customRoles)) return "no-role";
  return null;
}

export const has = (perms: readonly HrPermission[], p: HrPermission) => perms.includes(p);

/** Everyone who reports to `managerId`, directly or through others. Safe against loops. */
export function reportsOf(managerId: string, employees: HrEmployee[]): Set<string> {
  const byManager = new Map<string, string[]>();
  for (const e of employees) {
    if (!e.managerId) continue;
    byManager.set(e.managerId, [...(byManager.get(e.managerId) ?? []), e.id]);
  }
  const found = new Set<string>();
  const queue = [...(byManager.get(managerId) ?? [])];
  while (queue.length) {
    const id = queue.shift()!;
    if (found.has(id) || id === managerId) continue;
    found.add(id);
    queue.push(...(byManager.get(id) ?? []));
  }
  return found;
}

/** Who the signed-in person is, as far as the rules are concerned. */
export interface Actor {
  accountId: string;
  employeeId: string;
  permissions: readonly HrPermission[];
}

/** May the actor see this employee's record? Own record, their reporting line, or HR. */
export function canViewEmployee(actor: Actor, employeeId: string, employees: HrEmployee[], departments: HrDepartment[] = []): boolean {
  if (employeeId === actor.employeeId) return has(actor.permissions, "self.view");
  if (has(actor.permissions, "employees.view") || has(actor.permissions, "employees.manage")) return true;
  return has(actor.permissions, "team.view") && teamOf(actor.employeeId, employees, departments).has(employeeId);
}

/** The employees whose leave the actor may see. */
export function visibleLeaveEmployeeIds(actor: Actor, employees: HrEmployee[], departments: HrDepartment[] = []): Set<string> | "all" {
  if (has(actor.permissions, "leave.view_all") || has(actor.permissions, "leave.manage")) return "all";
  const ids = new Set<string>();
  if (has(actor.permissions, "self.view")) ids.add(actor.employeeId);
  if (has(actor.permissions, "team.view") || has(actor.permissions, "team.leave.approve")) {
    for (const id of teamOf(actor.employeeId, employees, departments)) ids.add(id);
  }
  return ids;
}

/** May the actor approve or reject this request? Never their own. */
export function canDecideLeave(actor: Actor, leave: HrLeaveRequest, employees: HrEmployee[], departments: HrDepartment[] = []): boolean {
  if (leave.status !== "pending" || leave.employeeId === actor.employeeId) return false;
  if (has(actor.permissions, "leave.manage")) return true;
  return has(actor.permissions, "team.leave.approve") && teamOf(actor.employeeId, employees, departments).has(leave.employeeId);
}

/**
 * May the actor change this account (role, permissions, active state, linked employee)?
 * Nobody may change their own account, so nobody can raise their own access.
 */
export function canManageAccount(actor: Actor, target: HrAccount): boolean {
  return has(actor.permissions, "accounts.manage") && target.id !== actor.accountId;
}

/** Least privilege: the actor may only hand out permissions they hold themselves. */
export function canGrant(actor: Actor, permissions: readonly HrPermission[]): boolean {
  return permissions.every((p) => has(actor.permissions, p));
}

/** Would making `managerId` the manager of `employeeId` create a reporting loop? */
export function createsReportingLoop(employeeId: string, managerId: string | null, employees: HrEmployee[]): boolean {
  if (!managerId) return false;
  if (managerId === employeeId) return true;
  return reportsOf(employeeId, employees).has(managerId);
}

/** Where a signed-in person lands: the most senior dashboard their permissions allow. */
export function homePath(perms: readonly HrPermission[]): string {
  if (has(perms, "accounts.manage") || has(perms, "employees.manage") || has(perms, "employees.view")) return "/hrportal/hr";
  if (has(perms, "reports.view")) return "/hrportal/reports";
  if (has(perms, "team.view")) return "/hrportal/team";
  if (has(perms, "self.view")) return "/hrportal/me";
  return "/hrportal/no-access";
}

/** Working days (Mon–Fri) from start to end inclusive, for ISO dates. */
export function workingDays(start: string, end: string): number {
  const a = new Date(`${start}T12:00:00Z`);
  const b = new Date(`${end}T12:00:00Z`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return 0;
  let days = 0;
  for (const d = new Date(a); d <= b; d.setUTCDate(d.getUTCDate() + 1)) {
    const wd = d.getUTCDay();
    if (wd !== 0 && wd !== 6) days++;
    if (days > 366) break;
  }
  return days;
}
