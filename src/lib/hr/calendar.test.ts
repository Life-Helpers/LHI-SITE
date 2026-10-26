import { describe, expect, it } from "vitest";

import { holidayDates, workingDays } from "@/lib/hr/access";
import { calendarItems, monthWeeks, occurrences, resumptionDate, weekSegments, workingRuns } from "@/lib/hr/calendar";
import { DEFAULT_LEAVE_TYPES, type HrEmployee, type HrLeaveRequest } from "@/lib/hr/types";

const person = (id: string, dob?: string) => ({ id, firstName: id, lastName: "Bello", dateOfBirth: dob, status: "active" }) as HrEmployee;
const leave = (id: string, start: string, end: string, status: HrLeaveRequest["status"] = "approved"): HrLeaveRequest => ({
  id,
  employeeId: "amina",
  type: "Annual",
  startDate: start,
  endDate: end,
  days: 3,
  reason: "secret",
  status,
  createdAt: "",
});

describe("calendar items", () => {
  const people = [person("amina", "1990-10-25"), person("leap", "2000-02-29")];
  it("gathers events, public holidays, visible leave and birthdays in the range", () => {
    const items = calendarItems({
      from: "2026-10-01",
      to: "2026-10-31",
      events: [{ id: "e1", title: "Team Meeting", kind: "meeting", startDate: "2026-10-05", endDate: "2026-10-05", time: "10:00", location: "Sokoto office", description: "", createdByName: "HR", createdAt: "" }],
      leave: [leave("l1", "2026-10-03", "2026-10-06"), leave("l2", "2026-10-20", "2026-10-21", "pending"), leave("l3", "2026-10-12", "2026-10-12", "rejected"), leave("l4", "2026-11-02", "2026-11-03")],
      employees: people,
      types: DEFAULT_LEAVE_TYPES,
      birthdaysOf: people,
    });
    expect(items.map((i) => [i.kind, i.title, i.start])).toEqual([
      ["holiday", "Independence Day", "2026-10-01"],
      ["leave", "amina Bello - Annual Leave", "2026-10-03"],
      ["meeting", "Team Meeting", "2026-10-05"],
      ["leave", "amina Bello - Annual Leave", "2026-10-20"],
      ["birthday", "amina Bello's Birthday", "2026-10-25"],
    ]);
    expect(items.find((i) => i.start === "2026-10-20")?.pending).toBe(true);
    // Never the leave reason, and never the birth year.
    expect(JSON.stringify(items)).not.toContain("secret");
    expect(JSON.stringify(items)).not.toContain("1990");
  });

  it("shows a 29 February birthday on the 28th in other years", () => {
    const items = calendarItems({ from: "2027-02-01", to: "2027-02-28", events: [], leave: [], employees: [], types: [], birthdaysOf: people });
    expect(items.map((i) => i.start)).toEqual(["2027-02-28"]);
  });
});

describe("colleagues' leave", () => {
  it("shows only who is away and when they're back, for approved leave", () => {
    const items = calendarItems({
      from: "2026-12-01",
      to: "2026-12-31",
      events: [],
      leave: [],
      colleagueLeave: [{ ...leave("c1", "2026-12-21", "2026-12-24"), type: "Sick" }, leave("c2", "2026-12-07", "2026-12-08", "pending")],
      employees: [person("amina")],
      types: DEFAULT_LEAVE_TYPES,
      birthdaysOf: [],
    });
    const away = items.filter((i) => i.kind === "leave");
    expect(away.map((i) => [i.title, i.detail])).toEqual([["amina Bello - On leave", "Back on Mon 28 Dec"]]);
    expect(JSON.stringify(away)).not.toMatch(/Sick|secret/);
  });

  it("works out the return date, skipping weekends and fixed public holidays", () => {
    expect(resumptionDate("2026-10-30")).toBe("2026-11-02"); // Fri -> Mon
    expect(resumptionDate("2026-12-24")).toBe("2026-12-28"); // Christmas, Boxing Day, weekend
    expect(resumptionDate("2026-09-30")).toBe("2026-10-02"); // Independence Day
  });
});

describe("month layout", () => {
  it("covers the month in Sunday-first weeks", () => {
    const weeks = monthWeeks("2026-10-15");
    expect(weeks[0][0]).toBe("2026-09-27");
    expect(weeks.at(-1)![6]).toBe("2026-10-31");
    expect(weeks).toHaveLength(5);
  });

  it("puts overlapping items in separate lanes and cuts items at the week's edges", () => {
    const week = monthWeeks("2026-10-15")[2]; // 11-17 Oct
    const items = [
      { id: "a", kind: "leave" as const, title: "A", start: "2026-10-08", end: "2026-10-12" },
      { id: "b", kind: "meeting" as const, title: "B", start: "2026-10-12", end: "2026-10-12" },
      { id: "c", kind: "holiday" as const, title: "C", start: "2026-10-15", end: "2026-10-20" },
    ];
    const segs = weekSegments(week, items);
    expect(segs.map((s) => [s.item.id, s.col, s.span, s.lane, s.cutStart, s.cutEnd])).toEqual([
      ["a", 0, 2, 0, true, false],
      ["b", 1, 1, 1, false, false],
      ["c", 4, 3, 0, false, true],
    ]);
  });
});

describe("leave counts working days only", () => {
  const eid = { kind: "holiday" as const, startDate: "2027-03-10", endDate: "2027-03-11" };
  const holidays = holidayDates([eid], 2026, 2027);

  it("skips weekends, fixed public holidays and holidays HR adds", () => {
    // Mon 21 - Fri 25 Dec 2026: Christmas Day is a holiday.
    expect(workingDays("2026-12-21", "2026-12-25", holidays)).toBe(4);
    // Thu 24 Dec - Mon 28 Dec: only the 24th and 28th count.
    expect(workingDays("2026-12-24", "2026-12-28", holidays)).toBe(2);
    // HR's two-day holiday (Wed 10 - Thu 11 Mar 2027) is free too.
    expect(workingDays("2027-03-08", "2027-03-12", holidays)).toBe(3);
    expect(resumptionDate("2027-03-09", holidays)).toBe("2027-03-12");
  });

  it("draws leave on the calendar only on working days", () => {
    const runs = workingRuns([{ id: "l", kind: "leave", title: "A", start: "2026-12-24", end: "2026-12-29" }, { id: "h", kind: "holiday", title: "H", start: "2026-12-25", end: "2026-12-25" }], holidays);
    expect(runs.map((r) => [r.id, r.start, r.end])).toEqual([
      ["l-0", "2026-12-24", "2026-12-24"],
      ["l-1", "2026-12-28", "2026-12-29"],
      ["h", "2026-12-25", "2026-12-25"],
    ]);
  });
});

describe("repeating meetings", () => {
  const base = { startDate: "2026-10-05", endDate: "2026-10-05" };
  const starts = (o: { start: string }[]) => o.map((x) => x.start);

  it("repeat daily on working days, weekly on the same weekday, and monthly on the same date", () => {
    expect(starts(occurrences({ ...base, repeat: "daily", repeatUntil: "2026-10-12" }, "2026-10-01", "2026-10-31"))).toEqual([
      "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-12",
    ]);
    expect(starts(occurrences({ ...base, repeat: "weekly", repeatUntil: "2026-10-31" }, "2026-10-01", "2026-10-31"))).toEqual(["2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26"]);
    expect(starts(occurrences({ ...base, repeat: "monthly", repeatUntil: "2027-01-31" }, "2026-10-01", "2027-03-31"))).toEqual(["2026-10-05", "2026-11-05", "2026-12-05", "2027-01-05"]);
  });

  it("uses the last day of shorter months, keeps multi-day lengths, and only returns dates in view", () => {
    expect(starts(occurrences({ startDate: "2027-01-31", endDate: "2027-01-31", repeat: "monthly", repeatUntil: "2027-04-30" }, "2027-01-01", "2027-04-30"))).toEqual(["2027-01-31", "2027-02-28", "2027-03-31", "2027-04-30"]);
    expect(occurrences({ startDate: "2026-10-05", endDate: "2026-10-06", repeat: "weekly", repeatUntil: "2026-12-31" }, "2026-12-01", "2026-12-10")).toEqual([
      { start: "2026-11-30", end: "2026-12-01" },
      { start: "2026-12-07", end: "2026-12-08" },
    ]);
    expect(occurrences({ ...base, repeat: "none" }, "2026-11-01", "2026-11-30")).toEqual([]);
  });
});

