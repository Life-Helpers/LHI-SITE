import { describe, expect, it } from "vitest";

import { approversFor, canDecideLeave, canViewEmployee, effectivePermissions, homePath, teamOf, type Actor } from "@/lib/hr/access";
import { mapEmployeeRows, parseCsv } from "@/lib/hr/csv-import";
import type { HrAccount, HrDepartment, HrEmployee, HrLeaveRequest } from "@/lib/hr/types";

const emp = (id: string, opts: Partial<HrEmployee> = {}): HrEmployee => ({
  id,
  staffNumber: "",
  firstName: id,
  lastName: "",
  email: "",
  phone: "",
  jobTitle: "",
  department: "",
  location: "",
  managerId: null,
  startDate: "",
  status: "active",
  annualLeaveDays: 20,
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  createdAt: "",
  updatedAt: "",
  ...opts,
});
const dept = (id: string, head: string | null, approvers: string[] = [], active = true): HrDepartment => ({
  id,
  name: id,
  description: "",
  headEmployeeId: head,
  approverIds: approvers,
  active,
  createdAt: "",
  updatedAt: "",
});
const acct = (employeeId: string, roleId = "employee"): HrAccount => ({
  id: `a-${employeeId}`,
  email: "",
  employeeId,
  roleId,
  extraPermissions: [],
  active: true,
  passwordHash: "x",
  sessionVersion: 1,
  createdAt: "",
  createdBy: "",
});
const pending = (employeeId: string): HrLeaveRequest => ({ id: `l-${employeeId}`, employeeId, type: "Annual", startDate: "2027-01-04", endDate: "2027-01-05", days: 2, reason: "", status: "pending", createdAt: "" });

// Director heads Programmes (deputy approves too); line manager is separate.
const employees = [
  emp("director", { departmentId: "programmes" }),
  emp("deputy", { departmentId: "programmes" }),
  emp("lineManager"),
  emp("officer", { departmentId: "programmes", managerId: "lineManager" }),
  emp("financeStaff", { departmentId: "finance" }),
  emp("probationer", { departmentId: "programmes", status: "probation" }),
  emp("suspended", { departmentId: "programmes", status: "inactive" }),
];
const departments = [dept("programmes", "director", ["deputy"]), dept("finance", null), dept("closed", "financeStaff", [], false)];
const actor = (id: string, roleId = "employee"): Actor => ({
  accountId: `a-${id}`,
  employeeId: id,
  permissions: effectivePermissions(acct(id, roleId), [], employees.find((e) => e.id === id), departments),
});

describe("department heads and approvers", () => {
  it("get team access for their department even with the Employee role", () => {
    expect(actor("director").permissions).toEqual(expect.arrayContaining(["team.view", "team.leave.approve"]));
    expect(actor("deputy").permissions).toEqual(expect.arrayContaining(["team.leave.approve"]));
    expect(actor("officer").permissions).not.toContain("team.view");
    // A closed department gives nothing.
    expect(actor("financeStaff").permissions).not.toContain("team.view");
    expect(homePath(actor("director").permissions)).toBe("/hrportal/team");
  });

  it("look after their department's staff, not other departments", () => {
    expect([...teamOf("director", employees, departments)].sort()).toEqual(["deputy", "officer", "probationer", "suspended"]);
    expect(canViewEmployee(actor("director"), "officer", employees, departments)).toBe(true);
    expect(canViewEmployee(actor("director"), "financeStaff", employees, departments)).toBe(false);
  });

  it("receive and decide the department's leave, alongside the line manager", () => {
    expect(canDecideLeave(actor("director"), pending("officer"), employees, departments)).toBe(true);
    expect(canDecideLeave(actor("deputy"), pending("officer"), employees, departments)).toBe(true);
    expect(canDecideLeave(actor("lineManager", "manager"), pending("officer"), employees, departments)).toBe(true);
    expect(canDecideLeave(actor("director"), pending("financeStaff"), employees, departments)).toBe(false);
    // Nobody decides their own: the deputy's leave goes to the director, not to themselves.
    expect(canDecideLeave(actor("deputy"), pending("deputy"), employees, departments)).toBe(false);
    expect(canDecideLeave(actor("director"), pending("deputy"), employees, departments)).toBe(true);
  });

  it("are listed as the approvers on a staff member's record", () => {
    const officer = employees.find((e) => e.id === "officer")!;
    expect(approversFor(officer, employees, departments).map((e) => e.id).sort()).toEqual(["deputy", "director", "lineManager"]);
    expect(approversFor(employees.find((e) => e.id === "director")!, employees, departments).map((e) => e.id)).toEqual(["deputy"]);
  });

  it("probation staff keep portal access; inactive staff lose it", () => {
    expect(actor("probationer").permissions).toContain("self.view");
    expect(actor("suspended").permissions).toEqual([]);
  });
});

describe("employee CSV import", () => {
  it("parses quotes, commas and line breaks", () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi"""\n\n1,2')).toEqual([
      ["a", "b"],
      ["x, y", 'say "hi"'],
      ["1", "2"],
    ]);
  });

  it("maps flexible column names and reports missing required ones", () => {
    const { records, missingColumns } = mapEmployeeRows(parseCsv("First Name,Surname,Designation,Branch\nAmina,Bello,Nurse,Sokoto"));
    expect(missingColumns).toEqual([]);
    expect(records[0]).toMatchObject({ firstName: "Amina", lastName: "Bello", jobTitle: "Nurse", location: "Sokoto" });
    expect(mapEmployeeRows(parseCsv("Email\nx@y.z")).missingColumns).toEqual(["First name", "Last name"]);
  });
});
