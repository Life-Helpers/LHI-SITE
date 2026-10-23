import { PortalShell } from "@/components/hr/portal-shell";
import { Card, fmtDateTime, inputClass, PageTitle, Table } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audit trail" };

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const ctx = await requireHrPage("audit.view");
  const q = ((await searchParams).q ?? "").trim().toLowerCase();
  const entries = (await readStore("hrAudit"))
    .filter((e) => !q || [e.actorName, e.action, e.target, e.details].some((v) => v.toLowerCase().includes(q)))
    .slice(0, 500);
  return (
    <PortalShell ctx={ctx} current="/hrportal/hr/audit">
      <PageTitle title="Audit trail" subtitle="Account, role, permission, reporting-line and leave decisions, newest first" />
      <form className="mb-4 flex gap-2" role="search">
        <input name="q" defaultValue={q} placeholder="Search who, what or details…" aria-label="Search the audit trail" className={`${inputClass} mt-0 max-w-sm`} />
        <button className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold">Search</button>
      </form>
      <Card>
        <Table head={["When", "Who", "Action", "On", "Details"]} empty={entries.length === 0 && "No entries."}>
          {entries.map((e) => (
            <tr key={e.id} className="align-top">
              <td className="px-3 py-2 whitespace-nowrap text-xs">{fmtDateTime(e.at)}</td>
              <td className="px-3 py-2 text-xs">{e.actorName}</td>
              <td className="px-3 py-2 font-medium">{e.action}</td>
              <td className="px-3 py-2">{e.target}</td>
              <td className="px-3 py-2 text-xs text-admin-muted">{e.details}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </PortalShell>
  );
}
