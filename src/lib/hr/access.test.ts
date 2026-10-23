import { describe, expect, it } from "vitest";

import {
  accessProblem,
  canDecideLeave,
  canGrant,
  canManageAccount,
  canViewEmployee,
  createsReportingLoop,
  effectivePermissions,
  homePath,
  reportsOf,
  visibleLeaveEmployeeIds,
  workingDays,
  type Actor,
} from "@/lib/hr/access";
import { ALL_HR_PERMISSIONS, BUILT_IN_HR_ROLES, type HrAccount, type HrEmployee, type HrLeaveRequest, type HrPermission } from "@/lib/hr/types";

const emp = (id: string, managerId: string | null = null, status: HrEmployee["status"] = "active"): HrEmployee => ({
  id,
  staffNumber: "",
  firstName: id,
  lastName: "",
  email: `${id}@lhi.test`,
  phone: "",
  jobTitle: "",
  department: "",
  location: "",
  managerId,
  startDate: "",
  status,
  annualLeaveDays: 20,
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  createdAt: "",
  updatedAt: "",
});

const acct = (id: string, employeeId: string, roleId: string, extra: HrPermission[] = [], active = true): HrAccount => ({
  id,
  email: `${id}@lhi.test`,
  employeeId,
  roleId,
  extraPermissions: extra,
  active,
  passwordHash: "x",
  sessionVersion: 1,
  createdAt: "",
  createdBy: "",
});

const leaveOf = (id: string, employeeId: string, status: HrLeaveRequest["status"] = "pending"): HrLeaveRequest => ({
  id,
  employeeId,
  type: "Annual",
  startDate: "2026-11-02",
  endDate: "2026-11-06",
  days: 5,
  reason: "",
  status,
  createdAt: "",
});

// director → manager → staff1, staff2; staff2 → intern. other is outside the line.
const employees = [emp("director"), emp("manager", "director"), emp("staff1", "manager"), emp("staff2", "manager"), emp("intern", "staff2"), emp("other"), emp("gone", null, "left")];

const actorFor = (account: HrAccount): Actor => ({
  accountId: account.id,
  employeeId: account.employeeId,
  permissions: effectivePermissions(account, [], employees.find((e) => e.id === account.employeeId)),
});

const employee = actorFor(acct("a-staff1", "staff1", "employee"));
const manager = actorFor(acct("a-manager", "manager", "manager"));
const hrOfficer = actorFor(acct("a-hr", "other", "hr_officer"));
const hrAdmin = actorFor(acct("a-admin", "director", "hr_admin"));

describe("effective permissions", () => {
  it("come from the role plus extras, and only valid ones", () => {
    const a = acct("x", "staff1", "employee", ["reports.view", "nonsense" as HrPermission]);
    expect(effectivePermissions(a, [], employees[2])).toEqual(["self.view", "self.update", "leave.request", "reports.view"]);
  });

  it("are empty for inactive accounts, missing roles and employees who left or aren't linked", () => {
    expect(effectivePermissions(acct("x", "staff1", "employee", [], false), [], employees[2])).toEqual([]);
    expect(effectivePermissions(acct("x", "staff1", "deleted_role"), [], employees[2])).toEqual([]);
    expect(effectivePermissions(acct("x", "gone", "hr_admin"), [], employees[6])).toEqual([]);
    expect(effectivePermissions(acct("x", "nobody", "hr_admin"), [], undefined)).toEqual([]);
  });

  it("explain why there is no access", () => {
    expect(accessProblem(acct("x", "staff1", "employee", [], false), [], employees[2])).toBe("inactive");
    expect(accessProblem(acct("x", "staff1", "deleted_role"), [], employees[2])).toBe("no-role");
    expect(accessProblem(acct("x", "gone", "employee"), [], employees[6])).toBe("no-employee");
    expect(accessProblem(acct("x", "staff1", "employee"), [], employees[2])).toBeNull();
  });

  it("built-in roles follow least privilege", () => {
    const perms = Object.fromEntries(BUILT_IN_HR_ROLES.map((r) => [r.id, r.permissions]));
    expect(perms.employee).not.toContain("team.view");
    expect(perms.manager).not.toContain("employees.view");
    expect(perms.management).toContain("reports.view");
    expect(perms.management).not.toContain("employees.view");
    expect(perms.hr_officer).not.toContain("accounts.manage");
    // HR Administrators hold everything except the IT team's audit trail access.
    expect(perms.hr_admin).toEqual(ALL_HR_PERMISSIONS.filter((p) => p !== "audit.view"));
    for (const role of BUILT_IN_HR_ROLES) expect(role.permissions).not.toContain("audit.view");
  });
});

describe("dashboards", () => {
  it("send each role to its own dashboard", () => {
    expect(homePath(employee.permissions)).toBe("/hrportal/me");
    expect(homePath(manager.permissions)).toBe("/hrportal/team");
    expect(homePath(actorFor(acct("m", "director", "management")).permissions)).toBe("/hrportal/reports");
    expect(homePath(hrOfficer.permissions)).toBe("/hrportal/hr");
    expect(homePath(hrAdmin.permissions)).toBe("/hrportal/hr");
    expect(homePath([])).toBe("/hrportal/no-access");
  });
});

describe("record access (no reading other people's records by changing an id)", () => {
  it("reporting lines include indirect reports and survive loops", () => {
    expect([...reportsOf("manager", employees)].sort()).toEqual(["intern", "staff1", "staff2"]);
    const looped = [emp("a", "b"), emp("b", "a")];
    expect([...reportsOf("a", looped)]).toEqual(["b"]);
  });

  it("an employee sees only their own record", () => {
    expect(canViewEmployee(employee, "staff1", employees)).toBe(true);
    expect(canViewEmployee(employee, "staff2", employees)).toBe(false);
    expect(canViewEmployee(employee, "manager", employees)).toBe(false);
  });

  it("a manager sees their reporting line, not their peers or bosses", () => {
    expect(canViewEmployee(manager, "staff1", employees)).toBe(true);
    expect(canViewEmployee(manager, "intern", employees)).toBe(true);
    expect(canViewEmployee(manager, "other", employees)).toBe(false);
    expect(canViewEmployee(manager, "director", employees)).toBe(false);
  });

  it("HR sees everyone", () => {
    expect(canViewEmployee(hrOfficer, "intern", employees)).toBe(true);
  });

  it("leave visibility follows the same lines", () => {
    expect([...(visibleLeaveEmployeeIds(employee, employees) as Set<string>)]).toEqual(["staff1"]);
    expect([...(visibleLeaveEmployeeIds(manager, employees) as Set<string>)].sort()).toEqual(["intern", "manager", "staff1", "staff2"]);
    expect(visibleLeaveEmployeeIds(hrOfficer, employees)).toBe("all");
  });
});

describe("leave decisions", () => {
  it("managers decide their team's pending leave, never their own", () => {
    expect(canDecideLeave(manager, leaveOf("1", "staff1"), employees)).toBe(true);
    expect(canDecideLeave(manager, leaveOf("2", "intern"), employees)).toBe(true);
    expect(canDecideLeave(manager, leaveOf("3", "other"), employees)).toBe(false);
    expect(canDecideLeave(manager, leaveOf("4", "manager"), employees)).toBe(false);
    expect(canDecideLeave(manager, leaveOf("5", "staff1", "approved"), employees)).toBe(false);
  });

  it("employees can't decide anything; HR can decide anyone's but their own", () => {
    expect(canDecideLeave(employee, leaveOf("1", "staff2"), employees)).toBe(false);
    expect(canDecideLeave(hrOfficer, leaveOf("1", "director"), employees)).toBe(true);
    expect(canDecideLeave(hrOfficer, leaveOf("1", "other"), employees)).toBe(false);
  });
});

describe("no self-escalation", () => {
  const adminAccount = acct("a-admin", "director", "hr_admin");
  const someone = acct("a-staff1", "staff1", "employee");

  it("nobody can change their own account", () => {
    expect(canManageAccount(hrAdmin, adminAccount)).toBe(false);
    expect(canManageAccount(hrAdmin, someone)).toBe(true);
  });

  it("only account managers can change accounts", () => {
    expect(canManageAccount(hrOfficer, someone)).toBe(false);
    expect(canManageAccount(manager, someone)).toBe(false);
  });

  it("nobody can grant permissions they don't hold", () => {
    expect(canGrant(hrOfficer, ["employees.manage"])).toBe(true);
    expect(canGrant(hrOfficer, ["accounts.manage"])).toBe(false);
    expect(canGrant(manager, ["reports.view"])).toBe(false);
    expect(canGrant(hrAdmin, ALL_HR_PERMISSIONS.filter((p) => p !== "audit.view"))).toBe(true);
    expect(canGrant(hrAdmin, ["audit.view"])).toBe(false);
  });
});

describe("reporting lines", () => {
  it("rejects loops", () => {
    expect(createsReportingLoop("manager", "manager", employees)).toBe(true);
    expect(createsReportingLoop("manager", "intern", employees)).toBe(true);
    expect(createsReportingLoop("staff1", "director", employees)).toBe(false);
    expect(createsReportingLoop("staff1", null, employees)).toBe(false);
  });
});

describe("working days", () => {
  it("counts Monday to Friday only", () => {
    expect(workingDays("2026-11-02", "2026-11-06")).toBe(5);
    expect(workingDays("2026-11-06", "2026-11-09")).toBe(2);
    expect(workingDays("2026-11-07", "2026-11-08")).toBe(0);
    expect(workingDays("2026-11-09", "2026-11-02")).toBe(0);
  });
});
