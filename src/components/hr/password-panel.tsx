import { issueResetLinkAction, setPasswordAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Modal } from "@/components/hr/modal";
import { Field, inputClass } from "@/components/hr/ui";
import type { HrAccount } from "@/lib/hr/types";

/** "Change Password" for HR: set one now, or send the person a one-time link to choose it. */
export function ChangePasswordModal({ account, name }: { account: HrAccount; name: string }) {
  return (
    <Modal label="Change Password" icon="key" iconOnly title={`Change password for ${name}`} description={account.email}>
      <div className="space-y-6">
        <ActionForm action={setPasswordAction} submitLabel="Set password" resetOnSuccess className="space-y-3">
          <input type="hidden" name="accountId" value={account.id} />
          <Field label="New password" hint="At least 10 characters, with letters and numbers.">
            <input name="password" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
          </Field>
          <Field label="Repeat the password">
            <input name="confirm" type="password" autoComplete="new-password" required minLength={10} className={inputClass} />
          </Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="mustChange" defaultChecked className="mt-1" />
            <span>Ask them to choose their own password when they next sign in (recommended, so HR doesn&apos;t keep knowing it)</span>
          </label>
        </ActionForm>
        <div className="border-t border-admin-border pt-5">
          <p className="mb-3 text-sm text-admin-muted">Or give them a one-time link to choose a password themselves:</p>
          <ActionForm action={issueResetLinkAction} submitLabel={account.passwordHash ? "Get password reset link" : "Get new invite link"}>
            <input type="hidden" name="accountId" value={account.id} />
          </ActionForm>
        </div>
      </div>
    </Modal>
  );
}
