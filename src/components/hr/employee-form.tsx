import { inputClass, Field } from "@/components/hr/ui";
import { EMPLOYMENT_TYPES, employeeName, GENDERS, type HrDepartment, type HrEmployee, isCurrentStaff } from "@/lib/hr/types";


/** Employee record fields, shared by the create and edit forms. */
export function EmployeeFields({ employee, managers, departments }: { employee?: HrEmployee; managers: HrEmployee[]; departments: HrDepartment[] }) {
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
      <Field label="Phone" hint="For two numbers, separate them with /">
        <input name="phone" defaultValue={e?.phone} placeholder="e.g. 0803 123 4567" className={inputClass} />
      </Field>
      <Field label="Staff number">
        <input name="staffNumber" defaultValue={e?.staffNumber} className={inputClass} />
      </Field>
      <Field label="Job title">
        <input name="jobTitle" defaultValue={e?.jobTitle} className={inputClass} />
      </Field>
      {departments.length > 0 ? (
        <Field label="Department" hint="Its head and approvers receive this person's leave requests.">
          <select name="departmentId" defaultValue={e?.departmentId ?? ""} className={inputClass}>
            <option value="">— Not set —</option>
            {departments
              .filter((d) => d.active || d.id === e?.departmentId)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>
        </Field>
      ) : (
        <Field label="Department" hint="Set up departments under Departments to route leave to their heads.">
          <input name="department" defaultValue={e?.department} className={inputClass} />
        </Field>
      )}
      <Field label="Duty station">
        <input name="location" defaultValue={e?.location} className={inputClass} />
      </Field>
      <Field label="Line manager" hint="Who this person reports to.">
        <select name="managerId" defaultValue={e?.managerId ?? ""} className={inputClass}>
          <option value="">No line manager</option>
          {managers
            .filter((m) => m.id !== e?.id && isCurrentStaff(m))
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
      <Field label="Gender (optional)">
        <select name="gender" defaultValue={e?.gender ?? ""} className={inputClass}>
          <option value="">—</option>
          {GENDERS.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </Field>
      <Field label="Employment type">
        <select name="employmentType" defaultValue={e?.employmentType ?? ""} className={inputClass}>
          <option value="">—</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Date of birth (optional)" hint="Only HR sees it; used for birthday wishes.">
        <input name="dateOfBirth" type="date" defaultValue={e?.dateOfBirth} className={inputClass} />
      </Field>
    </div>
  );
}
