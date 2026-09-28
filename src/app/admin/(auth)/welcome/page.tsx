import { redirect } from "next/navigation";

import { FirstLoginForm } from "@/components/cms/auth-forms";
import { getCurrentUser } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Secure your account" };

/** Shown after the default Admin / Admin sign-in until a real email and password are set. */
export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.mustChangePassword) redirect("/admin");
  return <FirstLoginForm />;
}
