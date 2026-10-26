import Link from "next/link";
import { Download, Eye, ReceiptText } from "lucide-react";

import { PortalShell } from "@/components/hr/portal-shell";
import { outlineButtonClass, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { naira, payMonthLabel } from "@/lib/hr/payroll";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "My payslips" };

/** The signed-in person's published payslips only. */
export default async function MyPayslipsPage() {
  const ctx = await requireHrPage("self.view");
  const slips = (await readStore("hrPayslips")).filter((p) => p.employeeId === ctx.employee.id && p.status === "published").sort((a, b) => b.month.localeCompare(a.month));
  return (
    <PortalShell ctx={ctx} current="/hrportal/payslips" crumbs={[{ label: "My payslips" }]}>
      <PageTitle title="My payslips" subtitle="Your monthly payslips from HR and Finance. View, print or download each one as a PDF." />
      <section className="hr-card overflow-hidden">
        <ul className="divide-y divide-admin-border">
          {slips.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-primary-soft text-admin-primary">
                  <ReceiptText className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{payMonthLabel(p.month)}</span>
                  <span className="block text-xs text-admin-muted">
                    Issued {p.publishedAt?.slice(0, 10)}
                    {p.payDate ? ` · paid ${p.payDate}` : ""}
                  </span>
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-3">
                <span className="mr-2 text-right">
                  <span className="block text-xs text-admin-muted">Net pay</span>
                  <span className="block font-semibold tabular-nums">{naira(p.net)}</span>
                </span>
                <Link href={`/hrportal/payslips/${p.id}`} aria-label={`View ${payMonthLabel(p.month)} payslip`} className={outlineButtonClass}>
                  <Eye className="h-4 w-4" aria-hidden="true" /> View
                </Link>
                <a href={`/hrportal/payslips/${p.id}/pdf`} download aria-label={`Download ${payMonthLabel(p.month)} payslip as PDF`} className={outlineButtonClass}>
                  <Download className="h-4 w-4" aria-hidden="true" /> PDF
                </a>
              </span>
            </li>
          ))}
        </ul>
        {slips.length === 0 && <p className="px-5 py-12 text-center text-sm text-admin-muted">No payslips yet. They appear here once HR or Finance publishes them.</p>}
      </section>
    </PortalShell>
  );
}
