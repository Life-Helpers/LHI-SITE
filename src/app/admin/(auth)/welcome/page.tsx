import { redirect } from "next/navigation";

import { ChoosePasswordForm, FirstLoginForm } from "@/components/cms/auth-forms";
import { DEFAULT_ADMIN, getCurrentUser } from "@/lib/cms/auth";
import { PERMISSION_ITEMS } from "@/lib/cms/schema";

export const dynamic = "force-dynamic";
export const metadata = { title: "Secure your account" };

/**
 * Until the person has their own password: after the default Admin / Admin sign-in they set a real
 * email and password; with a password an administrator gave them, they see their role and choose
 * their own.
 */
export default async function WelcomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.mustChangePassword) redirect("/admin");
  if (user.email === DEFAULT_ADMIN.username) return <FirstLoginForm />;
  const functions = PERMISSION_ITEMS.filter((i) => user.permissions.includes(i.id));
  return <ChoosePasswordForm name={user.name} roleName={user.roleName} functions={functions.map((f) => ({ label: f.label, help: f.help }))} />;
}
