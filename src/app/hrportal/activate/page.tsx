import Link from "next/link";

import { hrActivateAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PortalAuthCard } from "@/components/hr/portal-shell";
import { Field, inputClass } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { peekHrToken } from "@/lib/hr/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Set your password" };

/** Invite and password-reset links from HR land here. */
export default async function ActivatePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = String((await searchParams).token ?? "");
  const record = await peekHrToken(token);
  const account = record ? (await readStore("hrAccounts")).find((a) => a.id === record.accountId && a.active) : undefined;
  if (!record || !account) {
    return (
      <PortalAuthCard title="Link not valid">
        <p className="text-sm text-admin-text">This link is invalid, has expired or was already used. Ask the HR team for a new one.</p>
        <Link href="/hrportal" className="mt-5 inline-flex text-sm font-semibold text-admin-primary hover:underline">
          Go to sign-in
        </Link>
      </PortalAuthCard>
    );
  }
  return (
    <PortalAuthCard title={record.purpose === "invite" ? "Welcome to the LHI HR Portal" : "Choose a new password"} subtitle={`For ${account.email}`}>
      <ActionForm action={hrActivateAction} submitLabel="Save password and sign in" className="space-y-4" submitClassName="w-full">
        <input type="hidden" name="token" value={token} />
        <Field label="New password" hint="At least 10 characters, with letters and numbers.">
          <input name="password" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
        </Field>
        <Field label="Repeat the password">
          <input name="confirm" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
        </Field>
      </ActionForm>
    </PortalAuthCard>
  );
}
