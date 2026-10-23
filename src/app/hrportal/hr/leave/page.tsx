import { LeaveTable } from "@/components/hr/leave-parts";
import { PortalShell } from "@/components/hr/portal-shell";
import { Card, inputClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { canDecideLeave } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";
import { employeeName } from "@/lib/hr/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leave" };

const STATUSES = ["pending", "approved", "rejected", "cancelled", "all"] as const;

export default async function AllLeavePage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const ctx = await requireHrPage(["leave.view_all", "leave.manage"]);
  const raw = (await searchParams).status ?? "pending";
  const status = (STATUSES as readonly string[]).includes(raw) ? raw : "pending";
  const [employees, leave] = await Promise.all([readStore("hrEmployees"), readStore("hrLeave")]);
  const rows = leave
    .filter((l) => status === "all" || l.status === status)
    .sort((a, b) => (status === "pending" ? a.startDate.localeCompare(b.startDate) : b.startDate.localeCompare(a.startDate)))
    .slice(0, 300);
  const nameOf = (id: string) => employeeName(employees.find((e) => e.id === id));

  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/leave">
      <PageTitle title="Leave" subtitle="Leave requests across LHI" />
      <form className="mb-4 flex gap-2">
        <select name="status" defaultValue={status} aria-label="Status" className={`${inputClass} mt-0 w-auto capitalize`}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold">Show</button>
      </form>
      <Card>
        <LeaveTable rows={rows} who={nameOf} canDecide={(l) => canDecideLeave(ctx.actor, l, employees)} empty="No requests." />
      </Card>
    </PortalShell>
  );
}
