import Link from "next/link";
import { redirect } from "next/navigation";

import { hrSignInAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PortalAuthCard } from "@/components/hr/portal-shell";
import { Field, inputClass } from "@/components/hr/ui";
import { homePath } from "@/lib/hr/access";
import { hasAnyHrAccounts } from "@/lib/hr/data";
import { microsoftConfig } from "@/lib/hr/microsoft-sso";
import { loadHrSession } from "@/lib/hr/session";

export const dynamic = "force-dynamic";

/**
 * The one entry point for all LHI staff. Signed in: straight to the dashboard their role
 * allows. Signed out: the sign-in form.
 */
/** Why a Microsoft sign-in came back without signing the person in. */
const SSO_MESSAGES: Record<string, string> = {
  "no-account": "Your Microsoft account isn't linked to an HR portal account yet. Ask the HR team to add you, using your LHI work email.",
  inactive: "Your HR portal account has been deactivated. If you think this is a mistake, contact the HR team.",
  cancelled: "Microsoft sign-in was cancelled.",
  expired: "That sign-in took too long or was already used. Please try again.",
  failed: "Microsoft sign-in couldn't be completed. Please try again, or use your email and password.",
};

export default async function HrPortalEntry({ searchParams }: { searchParams: Promise<{ sso?: string }> }) {
  const { sso } = await searchParams;
  const microsoft = microsoftConfig() !== null;
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
      {sso && SSO_MESSAGES[sso] && (
        <p role="alert" className="mb-4 rounded-lg bg-admin-danger-soft px-3 py-2 text-sm text-admin-danger">
          {SSO_MESSAGES[sso]}
        </p>
      )}
      {microsoft && (
        <>
          {/* A plain link, not <Link>: prefetching it would start a sign-in. The server sends the person to Microsoft and back. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/hrportal/sso/microsoft"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-admin-border bg-admin-card px-4 py-2.5 text-sm font-semibold text-admin-text hover:bg-admin-bg"
          >
            <svg viewBox="0 0 21 21" className="h-5 w-5" aria-hidden="true">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            Sign in with Microsoft
          </a>
          <p className="mt-2 text-center text-xs text-admin-muted">Use your LHI work account. No portal password needed.</p>
          <div className="my-5 flex items-center gap-3 text-xs text-admin-muted">
            <span className="h-px flex-1 bg-admin-border" />
            or use your email and password
            <span className="h-px flex-1 bg-admin-border" />
          </div>
        </>
      )}
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
