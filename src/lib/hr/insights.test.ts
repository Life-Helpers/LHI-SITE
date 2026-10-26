import { describe, expect, it } from "vitest";

import { accountInsights, byUrgency, leaveInsights, myInsights, payrollInsights, peopleInsights } from "@/lib/hr/insights";
import type { HrAccount, HrEmployee, HrLeaveRequest, HrPayslip, HrSalary } from "@/lib/hr/types";

const TODAY = "2026-10-26"; // Monday
const person = (id: string, extra: Partial<HrEmployee> = {}) =>
  ({ id, firstName: id, lastName: "Bello", status: "active", department: "Programmes", departmentId: "prog", managerId: "boss", startDate: "2024-01-01", ...extra }) as HrEmployee;
const leave = (id: string, employeeId: string, start: string, end: string, extra: Partial<HrLeaveRequest> = {}): HrLeaveRequest => ({
  id,
  employeeId,
  type: "Annual",
  startDate: start,
  endDate: end,
  days: 1,
  reason: "",
  status: "pending",
  createdAt: TODAY,
  ...extra,
});
const ids = (items: { id: string }[]) => items.map((i) => i.id);

describe("leave insights", () => {
  const staff = ["a", "b", "c", "d", "e"].map((id) => person(id));
  const run = (rows: HrLeaveRequest[]) => leaveInsights({ leave: rows, employees: staff, today: TODAY, href: "/x", groupOf: (e) => e.department });

  it("flags undecided leave starting within three working days as urgent, and old requests as waiting", () => {
    const out = run([leave("soon", "a", "2026-10-28", "2026-10-29"), leave("old", "b", "2026-11-20", "2026-11-20", { createdAt: "2026-10-19" }), leave("fresh", "c", "2026-11-20", "2026-11-20")]);
    expect(ids(out)).toEqual(["leave-urgent", "leave-stale"]);
    expect(out[0]).toMatchObject({ tone: "critical", detail: "a Bello (Wed 28 Oct)" });
    expect(out[1].detail).toBe("The oldest has waited 7 days.");
  });

  it("spots stuck and declined relievers and early returns to confirm", () => {
    const out = run([
      leave("r1", "a", "2026-12-01", "2026-12-02", { relieverId: "b", relieverStatus: "pending", createdAt: "2026-10-23" }),
      leave("r2", "c", "2026-12-01", "2026-12-02", { relieverId: "d", relieverStatus: "declined" }),
      leave("back", "e", "2026-10-20", "2026-10-30", { status: "approved", returnRequest: { resumeDate: "2026-10-28", reason: "", at: TODAY } }),
    ]);
    expect(ids(out)).toEqual(["leave-reliever", "leave-declined", "leave-return"]);
  });

  it("warns when 40% or more of a team of three or more is away on one day", () => {
    const off = (id: string, who: string) => leave(id, who, "2026-11-03", "2026-11-04", { status: "approved" });
    expect(ids(run([off("1", "a")]))).toEqual([]);
    const out = run([off("1", "a"), off("2", "b")]);
    expect(out[0]).toMatchObject({ id: "leave-cover", detail: "Programmes: 2 of 5 away on Tue 3 Nov" });
  });
});

describe("people, accounts and payroll insights", () => {
  it("finds staff with no department, long probation and new starters", () => {
    const out = peopleInsights({
      today: TODAY,
      employees: [person("a", { department: "", departmentId: undefined }), person("b", { status: "probation", startDate: "2026-01-05" }), person("c", { startDate: "2026-11-02" }), person("gone", { status: "inactive", department: "" })],
    });
    expect(ids(out)).toEqual(["people-dept", "people-probation", "people-joining"]);
  });

  it("finds staff without a login and invites unused for a week", () => {
    const acct = (employeeId: string, extra: Partial<HrAccount> = {}) => ({ id: employeeId, employeeId, active: true, passwordHash: "x", createdAt: "2026-10-01", ...extra }) as HrAccount;
    const out = accountInsights({ today: TODAY, employees: [person("a"), person("b"), person("c")], accounts: [acct("a"), acct("b", { passwordHash: undefined })] });
    expect(out.map((i) => [i.id, i.title])).toEqual([
      ["accounts-none", "1 employee without a portal login"],
      ["accounts-unused", "1 invite unused for over a week"],
    ]);
  });

  it("reminds about missing salaries, an unprepared run near pay day, and drafts to publish", () => {
    const employees = [person("a"), person("b")];
    const salaries = [{ employeeId: "a" }] as HrSalary[];
    const none = payrollInsights({ employees, salaries, payslips: [], today: TODAY });
    expect(none.map((i) => [i.id, i.tone])).toEqual([
      ["payroll-salary", "warning"],
      ["payroll-run", "warning"],
    ]);
    expect(none[1].detail).toBe("Pay day is Fri 30 Oct, in 4 days.");
    expect(payrollInsights({ employees, salaries, payslips: [], today: "2026-10-05" }).map((i) => i.id)).toEqual(["payroll-salary"]);
    const drafts = [{ month: "2026-10", status: "draft", payDate: "2026-10-27" }] as HrPayslip[];
    expect(payrollInsights({ employees, salaries: [{ employeeId: "a" }, { employeeId: "b" }] as HrSalary[], payslips: drafts, today: TODAY })).toMatchObject([{ id: "payroll-drafts", tone: "critical" }]);
  });
});

describe("ordering and personal insights", () => {
  it("puts urgent items first", () => {
    expect(ids(byUrgency([{ id: "i", tone: "info", title: "" }, { id: "c", tone: "critical", title: "" }, { id: "w", tone: "warning", title: "" }]))).toEqual(["c", "w", "i"]);
  });

  it("nudges people with leave left late in the year", () => {
    expect(myInsights({ today: TODAY, annualLeft: 6, annualName: "Annual Leave" })[0].title).toBe("6 Annual Leave days left, with 10 weeks of the year to go");
    expect(myInsights({ today: "2026-05-01", annualLeft: 6, annualName: "Annual Leave" })).toEqual([]);
    expect(myInsights({ today: TODAY, annualLeft: null, annualName: "Annual Leave" })).toEqual([]);
  });
});
