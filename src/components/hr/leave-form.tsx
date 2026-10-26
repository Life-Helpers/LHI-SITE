import { Field, inputClass } from "@/components/hr/ui";
import type { HrLeaveType } from "@/lib/hr/types";

/** Leave type, dates, reliever and reason; shared by self-service and HR forms. */
export function LeaveFields({
  types,
  relievers,
  relieverRequired = false,
}: {
  types: HrLeaveType[];
  /** Colleagues who can cover; omit to leave the reliever out of the form. */
  relievers?: { id: string; label: string }[];
  relieverRequired?: boolean;
}) {
  const open = types.filter((t) => t.active);
  return (
    <>
      <Field label="Leave type">
        <select name="type" className={inputClass} defaultValue={open[0]?.id}>
          {open.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From">
          <input name="startDate" type="date" required className={inputClass} />
        </Field>
        <Field label="To">
          <input name="endDate" type="date" required className={inputClass} />
        </Field>
      </div>
      {relievers && (
        <Field
          label={relieverRequired ? "Reliever" : "Reliever (optional)"}
          hint="The colleague who will cover your work. They'll be asked to confirm before your leave can be approved."
        >
          <select name="relieverId" required={relieverRequired && relievers.length > 0} defaultValue="" className={inputClass}>
            <option value="">{relievers.length ? "Choose a colleague…" : "No colleagues with a portal login yet"}</option>
            {relievers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Reason (optional)">
        <textarea name="reason" maxLength={500} rows={3} className={inputClass} />
      </Field>
    </>
  );
}
