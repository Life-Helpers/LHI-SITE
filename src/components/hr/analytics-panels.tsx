import { BarList, ColumnChart, Kpi, SplitBar, type Series } from "@/components/hr/charts";
import { Card } from "@/components/hr/ui";
import {
  absenceForecast,
  absenceRate,
  approvalRate,
  averageDecisionDays,
  countBy,
  foldOther,
  headcountByMonth,
  hiresByMonth,
  lastMonths,
  leaveDaysByMonth,
  leaversByMonth,
  monthLabel,
  monthYearLabel,
  num,
  pct,
  statusCounts,
  tenureBands,
  tenureYears,
  turnoverRate,
  upcomingLeave,
} from "@/lib/hr/analytics";
import type { BalanceRow } from "@/lib/hr/leave-balance";
import { employeeName, isCurrentStaff, statusLabel, EMPLOYEE_STATUSES, type HrEmployee, type HrLeaveRequest, type HrLeaveType } from "@/lib/hr/types";

const STATUS_LABEL = { approved: "Approved", pending: "Pending", rejected: "Rejected", cancelled: "Cancelled" } as const;
const DAY_LABEL = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", timeZone: "UTC" });
const DATE_LABEL = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3 mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-admin-muted">{subtitle}</p>
    </div>
  );
}

/** Leave days per month as stacked series, coloured by each type's fixed position in the type list. */
function leaveSeries(leave: HrLeaveRequest[], months: string[], types: HrLeaveType[]): Series[] {
  return leaveDaysByMonth(leave, months, types).map((s) => ({ name: s.type.name, values: s.values, slot: types.indexOf(s.type) }));
}

const days = (rows: HrLeaveRequest[]) => rows.reduce((n, l) => n + l.days, 0);

/**
 * Organisation-wide analytics (HR dashboard and Reports). Totals and breakdowns only; no
 * individual's details, so it is safe for Management.
 */
export function OrgAnalytics({
  employees,
  leave,
  types,
  departments,
  today,
  showPeople,
  showLeave,
  holidays,
  kpis = true,
}: {
  employees: HrEmployee[];
  leave: HrLeaveRequest[];
  types: HrLeaveType[];
  departments: { id: string; name: string }[];
  today: string;
  showPeople: boolean;
  showLeave: boolean;
  /** Public holidays (they aren't working days). */
  holidays?: ReadonlySet<string>;
  /** The headline figures; off where the page already shows them in its own tiles. */
  kpis?: boolean;
}) {
  const months = lastMonths(today, 12);
  const labels = months.map(monthLabel);
  const full = months.map(monthYearLabel);
  const active = employees.filter((e) => isCurrentStaff(e));
  const heads = headcountByMonth(employees, months);
  const year = today.slice(0, 4);
  const inWindow = leave.filter((l) => l.startDate.slice(0, 7) >= months[0] && l.startDate.slice(0, 7) <= months[months.length - 1]);
  const ytd = leave.filter((l) => l.status === "approved" && l.startDate.startsWith(year) && l.startDate <= today);
  const activeIds = new Set(active.map((e) => e.id));
  const deptOf = (id: string) => {
    const e = employees.find((x) => x.id === id);
    return departments.find((d) => d.id === e?.departmentId)?.name ?? e?.department ?? "";
  };
  const forecast = absenceForecast(leave.filter((l) => activeIds.has(l.employeeId)), today, 10, holidays);
  const avgTenure = active.length ? active.reduce((n, e) => n + tenureYears(e, today), 0) / active.length : null;
  const change = active.length - heads[0];

  return (
    <>
      {showPeople && (
        <section aria-labelledby="workforce-analytics">
          <SectionTitle title="Workforce analytics" subtitle="Headcount, joiners, leavers and how the team is made up, over the last 12 months." />
          {kpis && (
            <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi label="Current staff" value={String(active.length)} hint={`${change >= 0 ? "+" : ""}${change} since ${full[0]} · ${employees.filter((e) => e.status === "probation").length} on probation`} />
              <Kpi label="Turnover, 12 months" value={pct(turnoverRate(employees, months))} hint="Leavers ÷ average headcount" />
              <Kpi label="Average length of service" value={avgTenure === null ? "—" : `${num(avgTenure)} yrs`} hint="Current staff, from start date" />
              <Kpi label="Started this year" value={String(active.filter((e) => e.startDate.startsWith(year)).length)} hint="Current staff with a start date this year" />
            </div>
          )}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Headcount" subtitle="Staff on record at the end of each month">
              <ColumnChart labels={labels} fullLabels={full} series={[{ name: "Headcount", values: heads }]} unit="staff" />
            </Card>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Card title="New starters" subtitle="By start date">
                <ColumnChart labels={labels} fullLabels={full} series={[{ name: "New starters", values: hiresByMonth(employees, months) }]} unit="starters" height={150} />
              </Card>
              <Card title="Leavers" subtitle="Marked inactive or terminated">
                <ColumnChart labels={labels} fullLabels={full} series={[{ name: "Leavers", values: leaversByMonth(employees, months) }]} unit="leavers" height={150} />
              </Card>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Card title="By department">
              <BarList rows={foldOther(countBy(active, (e) => departments.find((d) => d.id === e.departmentId)?.name ?? e.department))} empty="No staff yet." />
            </Card>
            <Card title="By duty station">
              <BarList rows={foldOther(countBy(active, (e) => e.location))} empty="No staff yet." />
            </Card>
            <Card title="By employment type">
              <BarList rows={countBy(active, (e) => e.employmentType)} empty="No staff yet." />
            </Card>
            <Card title="By gender">
              <BarList rows={countBy(active, (e) => e.gender)} empty="No staff yet." />
            </Card>
            <Card title="Length of service">
              <BarList rows={tenureBands(active, today)} empty="No staff yet." />
            </Card>
            <Card title="Employee status" subtitle="All records, including former staff">
              <BarList rows={EMPLOYEE_STATUSES.map((s) => ({ label: statusLabel(s.id), value: employees.filter((e) => e.status === s.id).length }))} unit="records" empty="No records yet." />
            </Card>
          </div>
        </section>
      )}

      {showLeave && (
        <section aria-labelledby="leave-analytics">
          <SectionTitle title="Leave analytics" subtitle={`Leave taken, requests and decisions. Leave is counted in the month it starts.`} />
          <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis && <Kpi label={`Leave days taken, ${year}`} value={String(days(ytd))} hint={`${ytd.length} approved request${ytd.length === 1 ? "" : "s"} so far`} />}
            {kpis && <Kpi label={`Absence rate, ${year}`} value={pct(absenceRate(leave, active, today, holidays))} hint="Leave days ÷ working days available" />}
            <Kpi label="Approval rate, 12 months" value={pct(approvalRate(inWindow), 0)} hint="Approved ÷ decided requests" />
            <Kpi label="Average time to decide" value={(() => { const d = averageDecisionDays(inWindow); return d === null ? "—" : `${num(d)} days`; })()} hint="From request to approval or rejection" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card title="Leave days by month and type" subtitle="Approved working days, last 12 months">
              <ColumnChart labels={labels} fullLabels={full} series={leaveSeries(leave, months, types)} unit="days" height={220} />
            </Card>
            <Card title="Who's off in the next two weeks" subtitle="Staff on approved leave each working day">
              <ColumnChart labels={forecast.map((f) => DAY_LABEL.format(new Date(`${f.date}T12:00:00Z`)))} fullLabels={forecast.map((f) => DATE_LABEL.format(new Date(`${f.date}T12:00:00Z`)))} series={[{ name: "Staff off", values: forecast.map((f) => f.value) }]} unit="staff off" height={200} />
            </Card>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card title="Requests by status" subtitle="Requests starting in the last 12 months">
              <SplitBar parts={statusCounts(inWindow).map((s) => ({ key: s.status, label: STATUS_LABEL[s.status], value: s.value }))} unit="requests" />
            </Card>
            <Card title={`Leave days by department, ${year}`} subtitle="Approved, taken so far">
              <BarList rows={foldOther(Object.entries(ytd.reduce<Record<string, number>>((m, l) => ({ ...m, [deptOf(l.employeeId) || "Not recorded"]: (m[deptOf(l.employeeId) || "Not recorded"] ?? 0) + l.days }), {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value))} unit="days" empty="No leave taken yet this year." />
            </Card>
          </div>
        </section>
      )}
    </>
  );
}

/** A manager's view of their team's leave. */
export function TeamAnalytics({
  team,
  leave,
  types,
  balances,
  today,
  holidays,
}: {
  team: HrEmployee[];
  leave: HrLeaveRequest[];
  types: HrLeaveType[];
  /** Each current team member's balance rows for this year. */
  balances: { employee: HrEmployee; rows: BalanceRow[] }[];
  today: string;
  holidays?: ReadonlySet<string>;
}) {
  const months = lastMonths(today, 12);
  const year = today.slice(0, 4);
  const active = team.filter((e) => isCurrentStaff(e));
  const ytd = leave.filter((l) => l.status === "approved" && l.startDate.startsWith(year) && l.startDate <= today);
  const soon = upcomingLeave(leave, today, 30);
  const forecast = absenceForecast(leave, today, 10, holidays);
  const annual = types.find((t) => t.id === "Annual") ?? types.find((t) => t.defaultDays !== null);

  return (
    <section aria-labelledby="team-analytics">
      <SectionTitle title="Team analytics" subtitle="Your team's leave this year and what's coming up." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label={`Leave days taken, ${year}`} value={String(days(ytd))} hint={`${active.length ? num(days(ytd) / active.length) : "0"} per team member`} />
        <Kpi label={`Absence rate, ${year}`} value={pct(absenceRate(leave, active, today, holidays))} hint="Leave days ÷ working days available" />
        <Kpi label="Booked in the next 30 days" value={String(new Set(soon.map((l) => l.employeeId)).size)} hint={`${soon.filter((l) => l.status === "pending").length} still awaiting a decision`} />
        <Kpi label="Approval rate, 12 months" value={pct(approvalRate(leave.filter((l) => l.startDate.slice(0, 7) >= months[0])), 0)} hint="Approved ÷ decided requests" />
      </div>
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="Team leave by month and type" subtitle="Approved working days, last 12 months">
          <ColumnChart labels={months.map(monthLabel)} fullLabels={months.map(monthYearLabel)} series={leaveSeries(leave, months, types)} unit="days" height={220} />
        </Card>
        <Card title="Who's off in the next two weeks" subtitle="Team members on approved leave each working day">
          <ColumnChart labels={forecast.map((f) => DAY_LABEL.format(new Date(`${f.date}T12:00:00Z`)))} fullLabels={forecast.map((f) => DATE_LABEL.format(new Date(`${f.date}T12:00:00Z`)))} series={[{ name: "Off", values: forecast.map((f) => f.value) }]} unit="off" height={200} />
        </Card>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {annual && (
          <Card title={`${annual.name} used, ${year}`} subtitle="Approved days per team member, with their allowance">
            <BarList
              rows={balances
                .map(({ employee, rows }) => {
                  const r = rows.find((x) => x.type.id === annual.id);
                  return { label: employeeName(employee), value: r?.used ?? 0, note: r?.total === null || r?.total === undefined ? "no limit" : (r.available ?? 0) < 0 ? `0 of ${r.total} left, ${-(r.available ?? 0)} over` : `${r.available ?? 0} of ${r.total} left` };
                })
                .sort((a, b) => b.value - a.value)}
              unit="days"
              empty={`No ${annual.name.toLowerCase()} taken yet this year.`}
            />
          </Card>
        )}
        <Card title="Requests by status" subtitle="Requests starting in the last 12 months">
          <SplitBar parts={statusCounts(leave.filter((l) => l.startDate.slice(0, 7) >= months[0])).map((s) => ({ key: s.status, label: STATUS_LABEL[s.status], value: s.value }))} unit="requests" />
        </Card>
      </div>
    </section>
  );
}

/** One person's own leave, for My record. */
export function MyAnalytics({ leave, types, balances, today, skipType }: { leave: HrLeaveRequest[]; types: HrLeaveType[]; balances: BalanceRow[]; today: string; /** A type the page already shows in its own tiles. */ skipType?: string }) {
  const months = lastMonths(today, 12);
  const limited = balances.filter((r) => r.total !== null && r.type.id !== skipType);
  return (
    <section aria-labelledby="my-analytics">
      <SectionTitle title="My leave at a glance" subtitle="Where your allowance has gone, and your requests over the last 12 months." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card title="My leave by month" subtitle="Approved working days, by type">
          <ColumnChart labels={months.map(monthLabel)} fullLabels={months.map(monthYearLabel)} series={leaveSeries(leave, months, types)} unit="days" height={200} />
        </Card>
        <Card title="My requests by status" subtitle="Requests starting in the last 12 months">
          <SplitBar parts={statusCounts(leave.filter((l) => l.startDate.slice(0, 7) >= months[0])).map((s) => ({ key: s.status, label: STATUS_LABEL[s.status], value: s.value }))} unit="requests" />
        </Card>
      </div>
      {limited.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {limited.map((r) => (
            <Card key={r.type.id} title={`${r.type.name}, ${today.slice(0, 4)}`} subtitle={`${r.total} days in total`}>
              <SplitBar
                unit="days"
                parts={[
                  { key: "used", label: "Used", value: r.used, color: "var(--viz-1)" },
                  { key: "pending", label: "Pending", value: r.pending, color: "var(--viz-4)" },
                  { key: "left", label: "Left", value: Math.max(0, r.available ?? 0), color: "var(--viz-other)" },
                ]}
              />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
