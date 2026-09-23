import Link from "next/link";

import { ResetPasswordForm } from "@/components/cms/auth-forms";
import { peekResetToken } from "@/lib/email/reset";

export const dynamic = "force-dynamic";
export const metadata = { title: "Choose a new password", robots: { index: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  if (!token || !(await peekResetToken("team", token))) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16 text-center">
        <div className="max-w-sm space-y-3">
          <h1 className="text-xl font-bold">This link has expired</h1>
          <p className="text-sm text-admin-muted">Reset links work once and expire after one hour.</p>
          <Link href="/admin/forgot" className="inline-block text-sm font-medium text-admin-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </main>
    );
  }
  return <ResetPasswordForm token={token} />;
}
