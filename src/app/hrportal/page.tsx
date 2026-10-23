import Link from "next/link";
import { redirect } from "next/navigation";

import { hrSignInAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PortalAuthCard } from "@/components/hr/portal-shell";
import { Field, inputClass } from "@/components/hr/ui";
import { homePath } from "@/lib/hr/access";
import { hasAnyHrAccounts } from "@/lib/hr/data";
import { loadHrSession } from "@/lib/hr/session";

export const dynamic = "force-dynamic";

/**
 * The one entry point for all LHI staff. Signed in: straight to the dashboard their role
 * allows. Signed out: the sign-in form.
 */
export default async function HrPortalEntry() {
  const state = await loadHrSession();
  if (state.status === "ok") redirect(homePath(state.ctx.permissions));
  if (state.status === "problem") redirect("/hrportal/no-access");

  if (!(await hasAnyHrAccounts())) {
    return (
      <PortalAuthCard title="LHI HR Portal" subtitle="Not set up yet">
        <p className="text-sm text-admin-muted">
          The HR portal has no accounts yet. A website administrator needs to create the first HR Administrator, who then
          creates accounts for all staff.
        </p>
        <Link href="/hrportal/setup" className="mt-5 inline-flex rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Set up the HR portal
        </Link>
      </PortalAuthCard>
    );
  }

  return (
    <PortalAuthCard title="LHI HR Portal" subtitle="Sign in with your LHI staff account">
      <ActionForm action={hrSignInAction} submitLabel="Sign in" className="space-y-4" submitClassName="w-full">
        <Field label="Email">
          <input name="email" type="email" autoComplete="username" required className={inputClass} />
        </Field>
        <Field label="Password">
          <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
        </Field>
      </ActionForm>
      <p className="mt-5 text-xs text-admin-muted">
        New staff receive a one-time link from HR to set their password. Forgotten your password? Ask the HR team for a reset link.
      </p>
    </PortalAuthCard>
  );
}
