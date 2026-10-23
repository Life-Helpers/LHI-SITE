import { redirect } from "next/navigation";

import { changeOwnPasswordAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { PortalAuthCard, PortalShell } from "@/components/hr/portal-shell";
import { Card, Field, inputClass, PageTitle } from "@/components/hr/ui";
import { loadHrSession } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Change password" };

function PasswordForm() {
  return (
    <ActionForm action={changeOwnPasswordAction} submitLabel="Change password" className="space-y-4">
      <Field label="Current password">
        <input name="current" type="password" autoComplete="current-password" required className={inputClass} />
      </Field>
      <Field label="New password" hint="At least 10 characters, with letters and numbers.">
        <input name="password" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
      </Field>
      <Field label="Repeat the new password">
        <input name="confirm" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
      </Field>
    </ActionForm>
  );
}

/** Change your own password. Required first when HR set it. */
export default async function PasswordPage() {
  const state = await loadHrSession();
  if (state.status === "signed-out") redirect("/hrportal");
  if (state.status === "problem") redirect("/hrportal/no-access");
  const { ctx } = state;
  if (ctx.account.mustChangePassword) {
    return (
      <PortalAuthCard title="Choose your own password" subtitle="The HR team set a temporary password for you. Choose your own to continue.">
        <PasswordForm />
      </PortalAuthCard>
    );
  }
  return (
    <PortalShell ctx={ctx} current="/hrportal/password" crumbs={[{ label: "Change password" }]}>
      <PageTitle title="Change password" subtitle="You'll stay signed in here; other devices are signed out." />
      <div className="max-w-lg">
        <Card>
          <PasswordForm />
        </Card>
      </div>
    </PortalShell>
  );
}
