import { Field, inputClass } from "@/components/hr/ui";
import type { HrLeaveType } from "@/lib/hr/types";

/** Leave type, dates and reason; shared by self-service and HR forms. */
export function LeaveFields({ types }: { types: HrLeaveType[] }) {
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
      <Field label="Reason (optional)">
        <textarea name="reason" maxLength={500} rows={3} className={inputClass} />
      </Field>
    </>
  );
}
