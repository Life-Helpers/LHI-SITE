import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PayslipView } from "@/components/hr/payslip";
import { PortalShell } from "@/components/hr/portal-shell";
import { PrintButton } from "@/components/hr/print-button";
import { outlineButtonClass } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { has } from "@/lib/hr/access";
import { payMonthLabel } from "@/lib/hr/payroll";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payslip" };

/** One payslip: its owner (once published), or HR and Finance. Anyone else gets "not found". */
export default async function PayslipPage({ params }: { params: Promise<{ payslipId: string }> }) {
  const ctx = await requireHrPage("self.view");
  const { payslipId } = await params;
  const slip = (await readStore("hrPayslips")).find((p) => p.id === payslipId);
  const isPayroll = has(ctx.permissions, "payroll.manage");
  if (!slip || !(isPayroll || (slip.employeeId === ctx.employee.id && slip.status === "published"))) notFound();
  const back = isPayroll && slip.employeeId !== ctx.employee.id ? `/hrportal/payroll/${slip.month}` : "/hrportal/payslips";
  return (
    <PortalShell ctx={ctx} current={isPayroll && slip.employeeId !== ctx.employee.id ? "/hrportal/payroll" : "/hrportal/payslips"} crumbs={[{ label: "Payslips", href: back }, { label: payMonthLabel(slip.month) }]}>
      <div className="mx-auto mb-5 flex max-w-3xl items-center justify-between gap-3 print:hidden">
        <Link href={back} className={outlineButtonClass}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
        </Link>
        <PrintButton />
      </div>
      <PayslipView slip={slip} />
    </PortalShell>
  );
}
