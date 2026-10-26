import { HandHelping } from "lucide-react";

import { changeRelieverAction, respondReliefAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Modal } from "@/components/hr/modal";
import { QuickAction } from "@/components/hr/quick-action";
import { Badge, Card, Field, fmtDate, inputClass, Person } from "@/components/hr/ui";
import { employeeName, type HrEmployee, type HrLeaveRequest } from "@/lib/hr/types";

export const RELIEVER_STATUS = {
  pending: { badge: "pending", label: "Awaiting reliever" },
  accepted: { badge: "approved", label: "Reliever accepted" },
  declined: { badge: "rejected", label: "Reliever declined" },
} as const;

const range = (l: HrLeaveRequest) => `${fmtDate(l.startDate)} – ${fmtDate(l.endDate)} · ${l.days} working day${l.days === 1 ? "" : "s"}`;

/**
 * On My record: relief requests waiting for this person's answer, and the relievers on their own
 * pending leave (with a way to choose someone else). Relievers see who and when, never the leave
 * type or reason.
 */
export function ReliefPanel({
  me,
  leave,
  employees,
  options,
}: {
  me: HrEmployee;
  leave: HrLeaveRequest[];
  employees: HrEmployee[];
  /** Colleagues this person may choose as reliever. */
  options: HrEmployee[];
}) {
  const nameOf = (id?: string) => employeeName(employees.find((e) => e.id === id));
  const asked = leave.filter((l) => l.relieverId === me.id && l.status === "pending" && l.relieverStatus === "pending").sort((a, b) => a.startDate.localeCompare(b.startDate));
  const mine = leave.filter((l) => l.employeeId === me.id && l.status === "pending" && l.relieverId).sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (!asked.length && !mine.length) return null;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {asked.length > 0 && (
        <Card title="Relief requests for you" subtitle="Colleagues who've asked you to cover their work while they're on leave" flush>
          <ul className="divide-y divide-admin-border">
            {asked.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="min-w-0">
                  <Person name={nameOf(l.employeeId)} sub={range(l)} />
                </span>
                <span className="flex shrink-0 gap-1">
                  <QuickAction action={respondReliefAction} kind="approve" label={`Accept relief for ${nameOf(l.employeeId)}`} tip="Accept" fields={{ leaveId: l.id, answer: "accept" }} />
                  <QuickAction action={respondReliefAction} kind="reject" label={`Decline relief for ${nameOf(l.employeeId)}`} tip="Decline" fields={{ leaveId: l.id, answer: "decline" }} askNote="Reason for declining (optional):" />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
      {mine.length > 0 && (
        <Card title="My relievers" subtitle="Your pending leave can be approved once your reliever accepts" flush>
          <ul className="divide-y divide-admin-border">
            {mine.map((l) => {
              const st = RELIEVER_STATUS[l.relieverStatus ?? "pending"];
              return (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-admin-primary-soft text-admin-primary">
                      <HandHelping className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{nameOf(l.relieverId)}</span>
                      <span className="block text-xs text-admin-muted">{range(l)}</span>
                      {l.relieverStatus === "declined" && l.relieverNote && <span className="block text-xs text-admin-muted">“{l.relieverNote}”</span>}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge status={st.badge} label={st.label} />
                    <Modal label={l.relieverStatus === "declined" ? "Choose another" : "Change"} outline icon="edit" title="Choose a reliever" description={`For your leave ${range(l)}.`}>
                      <ActionForm action={changeRelieverAction} submitLabel="Ask to relieve me" className="space-y-4">
                        <input type="hidden" name="leaveId" value={l.id} />
                        <Field label="Reliever">
                          <select name="relieverId" required defaultValue="" className={inputClass}>
                            <option value="">Choose a colleague…</option>
                            {options
                              .filter((o) => o.id !== l.relieverId || l.relieverStatus !== "declined")
                              .map((o) => (
                                <option key={o.id} value={o.id}>
                                  {relieverLabel(o)}
                                </option>
                              ))}
                          </select>
                        </Field>
                      </ActionForm>
                    </Modal>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}

/** "Name — Job title, Department" for reliever lists. */
export const relieverLabel = (e: HrEmployee) => [employeeName(e), [e.jobTitle, e.department].filter(Boolean).join(", ")].filter(Boolean).join(" — ");
