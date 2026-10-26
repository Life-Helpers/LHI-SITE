import { redirect } from "next/navigation";

import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";

export default async function PayrollHome() {
  await requireHrPage("payroll.manage");
  redirect("/hrportal/payroll/runs");
}
