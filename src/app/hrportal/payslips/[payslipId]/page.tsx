import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

import { PayslipView } from "@/components/hr/payslip";
import { PortalShell } from "@/components/hr/portal-shell";
import { PrintButton } from "@/components/hr/print-button";
import { outlineButtonClass } from "@/components/hr/ui";
import { readStore, updateStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { payMonthLabel } from "@/lib/hr/payroll";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payslip" };

/** One payslip: its owner (once published), or someone who may see everyone's payslips. Anyone else gets "not found". */
export default async function PayslipPage({ params }: { params: Promise<{ payslipId: string }> }) {
  const ctx = await requireHrPage("self.view");
  const { payslipId } = await params;
  const slip = (await readStore("hrPayslips")).find((p) => p.id === payslipId);
  const isPayroll = has(ctx.permissions, "payroll.payslips.view");
  if (!slip || !(isPayroll || (slip.employeeId === ctx.employee.id && slip.status === "published"))) notFound();
  const own = slip.employeeId === ctx.employee.id;
  // Lets HR and Finance see who has opened their payslip.
  if (own && slip.status === "published" && !slip.viewedAt) {
    const at = new Date().toISOString();
    await updateStore("hrPayslips", (items) => ({ items: items.map((p) => (p.id === slip.id && !p.viewedAt ? { ...p, viewedAt: at } : p)) }));
  }
  const back = isPayroll && !own ? (has(ctx.permissions, "payroll.runs") ? `/hrportal/payroll/runs/${slip.month}` : "/hrportal/payroll/payslips") : "/hrportal/payslips";
  return (
    <PortalShell ctx={ctx} current={isPayroll && !own ? back.replace(/\/\d{4}-\d{2}$/, "") : "/hrportal/payslips"} crumbs={[{ label: "Payslips", href: back }, { label: payMonthLabel(slip.month) }]}>
      <div className="mx-auto mb-5 flex max-w-3xl items-center justify-between gap-3 print:hidden">
        <Link href={back} className={outlineButtonClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </Link>
        <span className="flex flex-wrap gap-2">
          <a href={`/hrportal/payslips/${slip.id}/pdf`} download className={outlineButtonClass}>
            <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
          </a>
          <PrintButton label="Print" />
        </span>
      </div>
      <PayslipView slip={slip} />
    </PortalShell>
  );
}
