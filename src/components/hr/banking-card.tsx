import { updateBankingAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Card, Field, inputClass } from "@/components/hr/ui";
import type { HrEmployee } from "@/lib/hr/types";

/** Label/value grid used on the employee pages. */
export function Info({ items }: { items: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-admin-muted">{k}</dt>
          <dd className="mt-1 text-sm font-medium">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Bank account number with all but the last four digits hidden. */
const masked = (n?: string) => (n ? `${"•".repeat(Math.max(0, n.length - 4))}${n.slice(-4)}` : "");

/** Salary account details. Callers decide who may see it; the action checks who may change it. */
export function BankingCard({ person, editable }: { person: HrEmployee; editable: boolean }) {
  return (
    <Card title="Banking" subtitle="Salary account. Visible only to this person and to HR staff who manage records.">
      <Info
        items={[
          ["Bank", person.bankName],
          ["Account Name", person.bankAccountName],
          ["Account Number", masked(person.bankAccountNumber)],
        ]}
      />
      {editable && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-semibold text-admin-primary">Update bank details</summary>
          <ActionForm action={updateBankingAction} submitLabel="Save bank details" className="mt-4 grid gap-3 sm:grid-cols-3">
            <input type="hidden" name="employeeId" value={person.id} />
            <Field label="Bank">
              <input name="bankName" defaultValue={person.bankName} className={inputClass} />
            </Field>
            <Field label="Account name">
              <input name="bankAccountName" defaultValue={person.bankAccountName} className={inputClass} />
            </Field>
            <Field label="Account number">
              <input name="bankAccountNumber" inputMode="numeric" autoComplete="off" pattern="\d{10}" maxLength={10} placeholder={person.bankAccountNumber ? `Ends ${person.bankAccountNumber.slice(-4)}; blank keeps it` : "10-digit NUBAN"} aria-describedby="bank-number-hint" className={inputClass} />
            </Field>
            <p id="bank-number-hint" className="text-xs text-admin-muted sm:col-span-3">
              For your security the full account number isn&apos;t shown. Type the new 10-digit number only if it&apos;s changing. HR is told about changes before payroll.
            </p>
          </ActionForm>
        </details>
      )}
    </Card>
  );
}
