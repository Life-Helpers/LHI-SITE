import { inputClass, Field } from "@/components/hr/ui";
import { employeeName, type HrEmployee } from "@/lib/hr/types";

const DEPARTMENTS = [
  "Programmes",
  "Health & Nutrition",
  "Education",
  "Livelihood & Agriculture",
  "Protection & Gender",
  "MEAL",
  "Finance & Grants",
  "Human Resources & Administration",
  "Logistics & Procurement",
  "Safeguarding & Accountability",
  "Communications",
];

/** Employee record fields, shared by the create and edit forms. */
export function EmployeeFields({ employee, managers }: { employee?: HrEmployee; managers: HrEmployee[] }) {
  const e = employee;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="First name">
        <input name="firstName" required defaultValue={e?.firstName} className={inputClass} />
      </Field>
      <Field label="Last name">
        <input name="lastName" required defaultValue={e?.lastName} className={inputClass} />
      </Field>
      <Field label="Work email">
        <input name="email" type="email" defaultValue={e?.email} className={inputClass} />
      </Field>
      <Field label="Phone">
        <input name="phone" defaultValue={e?.phone} className={inputClass} />
      </Field>
      <Field label="Staff number">
        <input name="staffNumber" defaultValue={e?.staffNumber} className={inputClass} />
      </Field>
      <Field label="Job title">
        <input name="jobTitle" defaultValue={e?.jobTitle} className={inputClass} />
      </Field>
      <Field label="Department">
        <select name="department" defaultValue={e?.department ?? ""} className={inputClass}>
          <option value="">—</option>
          {[...new Set([...DEPARTMENTS, ...(e?.department ? [e.department] : [])])].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </Field>
      <Field label="Duty station">
        <input name="location" defaultValue={e?.location} className={inputClass} />
      </Field>
      <Field label="Line manager" hint="Who this person reports to.">
        <select name="managerId" defaultValue={e?.managerId ?? ""} className={inputClass}>
          <option value="">No line manager</option>
          {managers
            .filter((m) => m.id !== e?.id && m.status === "active")
            .sort((a, b) => employeeName(a).localeCompare(employeeName(b)))
            .map((m) => (
              <option key={m.id} value={m.id}>
                {employeeName(m)}
                {m.jobTitle ? ` — ${m.jobTitle}` : ""}
              </option>
            ))}
        </select>
      </Field>
      <Field label="Start date">
        <input name="startDate" type="date" defaultValue={e?.startDate} className={inputClass} />
      </Field>
      <Field label="Date of birth (optional)" hint="Only HR sees it; used for birthday wishes.">
        <input name="dateOfBirth" type="date" defaultValue={e?.dateOfBirth} className={inputClass} />
      </Field>
      <Field label="Annual leave (days per year)">
        <input name="annualLeaveDays" type="number" min={0} max={365} defaultValue={e?.annualLeaveDays ?? 20} className={inputClass} />
      </Field>
    </div>
  );
}
