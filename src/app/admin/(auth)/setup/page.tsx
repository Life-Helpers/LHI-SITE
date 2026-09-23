import { redirect } from "next/navigation";

import { SetupForm } from "@/components/cms/auth-forms";
import { hasAnyUsers, setupTokenRequired } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Setup" };

export default async function SetupPage() {
  if (await hasAnyUsers()) redirect("/admin/login");
  return <SetupForm tokenRequired={setupTokenRequired()} />;
}
