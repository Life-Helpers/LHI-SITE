import { deletePayrollRuleAction, savePayrollRuleAction, setPayrollRuleActiveAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Modal } from "@/components/hr/modal";
import { RuleFields } from "@/components/hr/payslip";
import { PortalShell } from "@/components/hr/portal-shell";
import { QuickAction } from "@/components/hr/quick-action";
import { Badge, PageTitle } from "@/components/hr/ui";
import { readStore } from "@/lib/cms/store";
import { describeRule, payrollRules } from "@/lib/hr/payroll";
import { requireHrPage } from "@/lib/hr/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Salary components" };

/** Taxes and deductions taken from pay: add, edit, switch off or remove. */
export default async function ComponentsPage() {
  const ctx = await requireHrPage("payroll.components.manage");
  const settings = (await readStore("hrPayrollSettings"))[0];
  const rules = payrollRules(settings);

  return (
    <PortalShell ctx={ctx} current="/hrportal/payroll/components" crumbs={[{ label: "Payroll Management" }, { label: "Salary Components" }]}>
      <PageTitle
        title="Salary Components"
        subtitle={`Taxes and deductions worked out on every payslip. ${settings?.updatedAt ? `Last changed ${settings.updatedAt.slice(0, 10)} by ${settings.updatedByName}.` : "Starting rates: please confirm them with your tax adviser."}`}
        actions={
          <Modal label="Add tax or deduction" title="Add a tax or deduction" description="It applies to payslips prepared from now on. Published payslips never change." wide>
            <ActionForm action={savePayrollRuleAction} submitLabel="Add" className="space-y-4">
              <RuleFields />
            </ActionForm>
          </Modal>
        }
      />
      <section className="hr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="bg-admin-bg text-xs font-semibold text-admin-muted">
                <th scope="col" className="px-4 py-3">#</th>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Calculation</th>
                <th scope="col" className="px-4 py-3">Before tax</th>
                <th scope="col" className="px-4 py-3">Applies to</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {rules.map((r, i) => (
                <tr key={r.id} className={r.active ? "" : "text-admin-muted"}>
                  <td className="px-4 py-3 text-admin-muted">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">{describeRule(r)}</td>
                  <td className="px-4 py-3">{r.beforeTax ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{r.defaultOn ? "Everyone (unless unticked)" : "Only people ticked"}</td>
                  <td className="px-4 py-3">
                    <Badge status={r.active ? "approved" : "rejected"} label={r.active ? "In use" : "Switched off"} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center justify-center gap-1">
                      <Modal label="Edit" iconOnly icon="edit" title={`Edit ${r.name}`} wide>
                        <ActionForm action={savePayrollRuleAction} submitLabel="Save" className="space-y-4 text-left">
                          <RuleFields rule={r} />
                        </ActionForm>
                      </Modal>
                      <QuickAction
                        action={setPayrollRuleActiveAction}
                        fields={{ ruleId: r.id, active: String(!r.active) }}
                        kind={r.active ? "lock" : "unlock"}
                        label={r.active ? `Switch off ${r.name}` : `Switch on ${r.name}`}
                        tip={r.active ? "Switch off" : "Switch on"}
                      />
                      <QuickAction action={deletePayrollRuleAction} fields={{ ruleId: r.id }} kind="delete" label={`Remove ${r.name}`} tip="Remove" confirmText={`Remove ${r.name}? Published payslips keep it.`} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rules.length === 0 && <p className="px-5 py-10 text-center text-sm text-admin-muted">No taxes or deductions yet.</p>}
      </section>
    </PortalShell>
  );
}
