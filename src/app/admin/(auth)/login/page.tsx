import { redirect } from "next/navigation";

import { LoginForm } from "@/components/cms/auth-forms";
import { getCurrentUser } from "@/lib/cms/auth";
import { databaseRecentlyDown, readStore } from "@/lib/cms/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  // The Team login link lands here directly. With no accounts yet, sign in with the default
  // Admin / Admin login, which then asks for a real email and password.
  const user = await getCurrentUser();
  if (user) redirect(user.mustChangePassword ? "/admin/welcome" : "/admin");
  // A quick read tells us whether the database is reachable before anyone types a password.
  await readStore("users").catch(() => []);
  return <LoginForm databaseDown={databaseRecentlyDown()} />;
}
