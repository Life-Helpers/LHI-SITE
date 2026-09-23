import { redirect } from "next/navigation";

import { LoginForm } from "@/components/cms/auth-forms";
import { getCurrentUser, hasAnyUsers } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (!(await hasAnyUsers())) redirect("/admin/setup");
  if (await getCurrentUser()) redirect("/admin");
  return <LoginForm />;
}
