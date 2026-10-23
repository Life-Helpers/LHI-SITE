import { leaveLabel } from "@/components/hr/leave-style";
import { Field, inputClass } from "@/components/hr/ui";
import { LEAVE_TYPES } from "@/lib/hr/types";

/** Leave type, dates and reason; shared by self-service and HR forms. */
export function LeaveFields() {
  return (
    <>
      <Field label="Leave type">
        <select name="type" className={inputClass} defaultValue="Annual">
          {LEAVE_TYPES.map((t) => (
            <option key={t} value={t}>
              {leaveLabel(t)}
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
      <Field label="Reason (optional)">
        <textarea name="reason" maxLength={500} rows={3} className={inputClass} />
      </Field>
    </>
  );
}
