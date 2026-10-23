import Link from "next/link";

import { hrBootstrapAction, setAuditAccessAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PortalAuthCard } from "@/components/hr/portal-shell";
import { Field, inputClass } from "@/components/hr/ui";
import { getCurrentUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { hasAnyHrAccounts } from "@/lib/hr/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Set up" };

/** First-time setup, open only while the portal has no accounts, and only to a website administrator. */
export default async function SetupPage() {
  const cmsUser = await getCurrentUser();
  const websiteAdmin = Boolean(cmsUser && !cmsUser.mustChangePassword && can(cmsUser, "users"));
  if (await hasAnyHrAccounts()) {
    if (!websiteAdmin) {
      return (
        <PortalAuthCard title="Already set up">
          <p className="text-sm text-admin-text">The HR portal is set up. HR administrators create staff accounts from inside the portal.</p>
          <Link href="/hrportal" className="mt-5 inline-flex text-sm font-semibold text-admin-primary hover:underline">
            Go to sign-in
          </Link>
        </PortalAuthCard>
      );
    }
    return <AuditAccess websiteAdminEmail={cmsUser!.email} />;
  }
  if (!websiteAdmin || !cmsUser) {
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

/** Website administrators decide who in the IT team can open the HR audit trail. */
async function AuditAccess({ websiteAdminEmail }: { websiteAdminEmail: string }) {
  const accounts = (await readStore("hrAccounts")).filter((a) => a.active);
  const it = accounts.filter((a) => a.extraPermissions.includes("audit.view"));
  const others = accounts.filter((a) => !a.extraPermissions.includes("audit.view"));
  return (
    <PortalAuthCard title="Already set up" subtitle={`Signed in to the website admin as ${websiteAdminEmail}`}>
      <h2 className="text-sm font-semibold">IT team: audit trail access</h2>
      <p className="mt-1 text-xs text-admin-muted">
        Only the IT team can open the HR audit trail. HR administrators can&apos;t grant or remove this. The person needs a portal account first.
      </p>
      <ul className="mt-4 divide-y divide-admin-border rounded-lg border border-admin-border">
        {it.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
            <span className="min-w-0 truncate">{a.email}</span>
            <ActionForm action={setAuditAccessAction} submitLabel="Remove" danger submitClassName="px-3 py-1 text-xs" className="flex">
              <input type="hidden" name="accountId" value={a.id} />
              <input type="hidden" name="grant" value="false" />
            </ActionForm>
          </li>
        ))}
        {it.length === 0 && <li className="px-3 py-3 text-sm text-admin-muted">Nobody has audit trail access yet.</li>}
      </ul>
      {others.length > 0 && (
        <ActionForm action={setAuditAccessAction} submitLabel="Give audit trail access" className="mt-4 space-y-3">
          <input type="hidden" name="grant" value="true" />
          <Field label="IT team member's portal account">
            <select name="accountId" required className={inputClass}>
              {others.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.email}
                </option>
              ))}
            </select>
          </Field>
        </ActionForm>
      )}
      <Link href="/hrportal" className="mt-5 inline-flex text-sm font-semibold text-admin-primary hover:underline">
        Go to sign-in
      </Link>
    </PortalAuthCard>
  );
}
