import { OrgAnalytics } from "@/components/hr/analytics-panels";
import { PortalShell } from "@/components/hr/portal-shell";
import { Notice, PageTitle, todayLagos } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { holidayDates } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reports" };

/** Organisation-wide figures for management. Totals only: no individual's details. */
export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const ctx = await requireHrPage("reports.view");
  const { denied } = await searchParams;
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const today = todayLagos();
  const year = today.slice(0, 4);
  const holidays = holidayDates(await readStore("hrEvents"), Number(today.slice(0, 4)) - 1, Number(today.slice(0, 4)) + 1);

  return (
    <PortalShell ctx={ctx} current="/hrportal/reports" crumbs={[{ label: "Reports" }]}>
      {denied && <Notice tone="danger">You don&apos;t have access to that page.</Notice>}
      <PageTitle title="Reports" subtitle={`LHI-wide workforce and leave analytics, ${year}. Totals only: no one's personal details.`} />
      <OrgAnalytics holidays={holidays} employees={employees} leave={leave} types={ctx.leaveTypes} departments={ctx.departments} today={today} showPeople showLeave />
    </PortalShell>
  );
}
