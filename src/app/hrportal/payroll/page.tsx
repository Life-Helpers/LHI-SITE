import { redirect } from "next/navigation";

import { payrollHome } from "@/lib/hr/access";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";

/** The first payroll page this person's access opens. */
export default async function PayrollHome() {
  const ctx = await requireHrPage(["payroll.salaries.view", "payroll.components.manage", "payroll.runs", "payroll.payslips.view"]);
  redirect(payrollHome(ctx.permissions)!);
}
