import { ForgotPasswordForm } from "@/components/cms/auth-forms";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reset password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
