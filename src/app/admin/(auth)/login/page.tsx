import { redirect } from "next/navigation";

import { LoginForm } from "@/components/cms/auth-forms";
import { getCurrentUser } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  // The Team login link lands here directly. With no accounts yet, sign in with the default
  // Admin / Admin login, which then asks for a real email and password.
  const user = await getCurrentUser();
  if (user) redirect(user.mustChangePassword ? "/admin/welcome" : "/admin");
  return <LoginForm />;
}
