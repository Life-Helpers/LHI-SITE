import { requestLeaveAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { LeaveFields } from "@/components/hr/leave-form";
import { Modal } from "@/components/hr/modal";
import { relieverLabel } from "@/components/hr/relief-panel";
import { readStore } from "@/lib/cms/store";
import { has, holidayDates, relieverOptions } from "@/lib/hr/access";
import { availableByType, balanceFor } from "@/lib/hr/leave-balance";
import type { HrContext } from "@/lib/hr/session";

/**
 * The signed-in person's own leave request, as a button and form. Used on My record and on HR
 * pages so HR staff can apply for their own leave from where they work. It goes to their own
 * approvers like anyone else's: nobody approves their own leave.
 */
export async function MyLeaveButton({ ctx, label = "Request Leave", outline = false }: { ctx: HrContext; label?: string; outline?: boolean }) {
  if (!has(ctx.permissions, "leave.request")) return null;
  const [employees, leave, policies, adjustments, accounts, events] = await Promise.all([
    readStore("hrEmployees"),
    readStore("hrLeave"),
    readStore("hrLeavePolicies"),
    readStore("hrLeaveAdjustments"),
    readStore("hrAccounts"),
    readStore("hrEvents"),
  ]);
  const me = ctx.employee;
  const year = new Date().getFullYear();
  const balances = balanceFor(me, year, ctx.leaveTypes, policies, leave, adjustments);
  const annual = balances.find((r) => r.type.id === "Annual") ?? balances.find((r) => r.total !== null);
  const left = Math.max(0, annual?.available ?? 0);
  const relievers = relieverOptions(me, employees, accounts, ctx.departments);
  return (
    <Modal label={label} outline={outline} title="Request leave" description={annual ? `You have ${left} ${annual.type.name.toLowerCase()} days left this year.` : undefined}>
      <ActionForm action={requestLeaveAction} submitLabel="Send request" closeOnSuccess className="space-y-4">
        <LeaveFields
          types={ctx.leaveTypes}
          holidays={[...holidayDates(events, year, year + 1)]}
          relievers={relievers.map((e) => ({ id: e.id, label: relieverLabel(e) }))}
          relieverRequired
          available={availableByType(balances)}
          year={year}
        />
      </ActionForm>
    </Modal>
  );
}
