import Link from "next/link";

import { hrBootstrapAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PortalAuthCard } from "@/components/hr/portal-shell";
import { Field, inputClass } from "@/components/hr/ui";
import { getCurrentUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { hasAnyHrAccounts } from "@/lib/hr/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Set up" };

/** First-time setup, open only while the portal has no accounts, and only to a website administrator. */
export default async function SetupPage() {
  if (await hasAnyHrAccounts()) {
    return (
      <PortalAuthCard title="Already set up">
        <p className="text-sm text-admin-text">The HR portal is set up. HR administrators create staff accounts from inside the portal.</p>
        <Link href="/hrportal" className="mt-5 inline-flex text-sm font-semibold text-admin-primary hover:underline">
          Go to sign-in
        </Link>
      </PortalAuthCard>
    );
  }
  const cmsUser = await getCurrentUser();
  if (!cmsUser || cmsUser.mustChangePassword || !can(cmsUser, "users")) {
    return (
      <PortalAuthCard title="Set up the HR portal" subtitle="Website administrators only">
        <p className="text-sm text-admin-text">
          To create the first HR Administrator, first sign in to the website admin with an account that can manage users and roles, then come back to this page.
        </p>
        <Link href="/admin/login" className="mt-5 inline-flex rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Sign in to the website admin
        </Link>
      </PortalAuthCard>
    );
  }
  return (
    <PortalAuthCard title="Create the first HR Administrator" subtitle={`Signed in to the website admin as ${cmsUser.email}`}>
      <ActionForm action={hrBootstrapAction} submitLabel="Create HR Administrator" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <input name="firstName" required className={inputClass} />
          </Field>
          <Field label="Last name">
            <input name="lastName" required className={inputClass} />
          </Field>
        </div>
        <Field label="Work email" hint="They sign in with this.">
          <input name="email" type="email" required className={inputClass} />
        </Field>
        <Field label="Job title">
          <input name="jobTitle" placeholder="HR Administrator" className={inputClass} />
        </Field>
        <Field label="Duty station">
          <input name="location" placeholder="Sokoto" className={inputClass} />
        </Field>
      </ActionForm>
      <p className="mt-5 text-xs text-admin-muted">
        You&apos;ll get a one-time link to give them. After this, only HR administrators can create portal accounts, and this page closes.
      </p>
    </PortalAuthCard>
  );
}
