"use client";

import { useEffect, useRef, useState } from "react";

import { Field, inputClass } from "@/components/hr/ui";
import { workingDays } from "@/lib/hr/access";
import type { HrLeaveType } from "@/lib/hr/types";

/** Leave type, dates, reliever and reason; shared by self-service and HR forms. */
export function LeaveFields({
  types,
  relievers,
  relieverRequired = false,
  available,
  year,
}: {
  types: HrLeaveType[];
  /** Colleagues who can cover; omit to leave the reliever out of the form. */
  relievers?: { id: string; label: string }[];
  relieverRequired?: boolean;
  /**
   * Days left this year per leave type id (null = no limit), for the person asking. When given,
   * the form counts working days as dates are picked and won't send more than is left. The
   * server checks again, whatever the browser does.
   */
  available?: Record<string, number | null>;
  /** The year `available` is for; leave in another year is checked by the server only. */
  year?: number;
}) {
  const open = types.filter((t) => t.active);
  const [type, setType] = useState(open[0]?.id ?? "");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const endRef = useRef<HTMLInputElement>(null);
  const days = start && end && end >= start ? workingDays(start, end) : 0;
  const sameYear = !start || !year || start.startsWith(String(year));
  const left = available && sameYear ? available[type] : undefined;
  const typeName = open.find((t) => t.id === type)?.name ?? "leave";
  const crossesYear = Boolean(start && end && start.slice(0, 4) !== end.slice(0, 4));
  const tooMany = typeof left === "number" && days > left;
  const problem = tooMany
    ? `That's ${days} working day${days === 1 ? "" : "s"}, but you have only ${left} ${typeName} day${left === 1 ? "" : "s"} left. ${left ? `Choose at most ${left}.` : "Choose another leave type."}`
    : crossesYear
      ? "Split leave that crosses into a new year into two requests."
      : start && end && end < start
        ? "The end date is before the start date."
        : "";

  // Stop the browser sending the form while the dates don't fit.
  useEffect(() => {
    endRef.current?.setCustomValidity(problem);
  }, [problem]);

  return (
    <>
      <Field label="Leave type">
        <select name="type" className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
          {open.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {available ? (available[t.id] === null ? " (no limit)" : ` (${available[t.id]} day${available[t.id] === 1 ? "" : "s"} left${year ? ` in ${year}` : ""})`) : ""}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From">
          <input name="startDate" type="date" required className={inputClass} value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="To">
          <input ref={endRef} name="endDate" type="date" required min={start || undefined} className={inputClass} value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>
      </div>
      {(days > 0 || problem) && available && (
        <p role={problem ? "alert" : undefined} aria-live="polite" className={`rounded-lg px-3 py-2 text-sm ${problem ? "bg-admin-danger-soft text-admin-danger" : "bg-admin-bg text-admin-muted"}`}>
          {problem ||
            `${days} working day${days === 1 ? "" : "s"}${typeof left === "number" ? ` · ${left - days} ${typeName} day${left - days === 1 ? "" : "s"} left after this` : ""}`}
        </p>
      )}
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
