import { redirect } from "next/navigation";

import { TwoFactorLoginForm } from "@/components/cms/auth-forms";
import { getCurrentUser, readPendingTwoFactor } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Two-step verification", robots: { index: false } };

export default async function VerifyTwoFactorPage() {
  if (await getCurrentUser()) redirect("/admin");
  if (!(await readPendingTwoFactor())) redirect("/admin/login");
  return <TwoFactorLoginForm />;
}
