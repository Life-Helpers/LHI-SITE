"use client";

import { useRef } from "react";
import { X } from "lucide-react";

import { deleteCalendarEventAction, saveCalendarEventAction } from "@/app/hrportal/actions";
import { ActionForm } from "@/components/hr/action-form";
import { Field, inputClass } from "@/components/hr/ui";
import { KIND_STYLE } from "@/components/hr/calendar-style";
import type { CalendarItem } from "@/lib/hr/calendar";
import type { HrCalendarEvent } from "@/lib/hr/types";

const DATE = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const fmt = (iso: string) => DATE.format(new Date(`${iso}T12:00:00Z`));

/** Title, type, dates, time and place of an HR calendar event. */
/** `isHr`: HR chooses the type and who sees it; managers add meetings for their team. */
export function EventFields({ event, isHr = true }: { event?: HrCalendarEvent; isHr?: boolean }) {
  return (
    <div className="space-y-4">
      {event && <input type="hidden" name="eventId" value={event.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title">
          <input name="title" required maxLength={120} defaultValue={event?.title} placeholder="e.g. Team Meeting" className={inputClass} />
        </Field>
        {isHr ? (
          <Field label="Type">
            <select name="kind" defaultValue={event?.kind ?? "meeting"} className={inputClass}>
              <option value="meeting">Meeting</option>
              <option value="holiday">Holiday</option>
              <option value="event">Event</option>
            </select>
          </Field>
        ) : (
          <Field label="Who sees it">
            <p className="mt-1 rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-muted">You and your team</p>
          </Field>
        )}
        <Field label="Starts">
          <input name="startDate" type="date" required defaultValue={event?.startDate} className={inputClass} />
        </Field>
        <Field label="Ends" hint="Leave blank for a one-day event.">
          <input name="endDate" type="date" defaultValue={event?.endDate} className={inputClass} />
        </Field>
        <Field label="Time (optional)">
          <input name="time" type="time" defaultValue={event?.time} className={inputClass} />
        </Field>
        <Field label="Location (optional)">
          <input name="location" maxLength={120} defaultValue={event?.location} placeholder="e.g. Sokoto office" className={inputClass} />
        </Field>
        <Field label="Repeats">
          <select name="repeat" defaultValue={event?.repeat ?? "none"} className={inputClass}>
            <option value="none">Does not repeat</option>
            <option value="daily">Daily (Monday to Friday)</option>
            <option value="weekly">Weekly (same day each week)</option>
            <option value="monthly">Monthly (same date each month)</option>
          </select>
        </Field>
        <Field label="Repeat until" hint="Needed when it repeats (up to two years).">
          <input name="repeatUntil" type="date" defaultValue={event?.repeatUntil} className={inputClass} />
        </Field>
        {isHr && (
          <Field label="Who sees it">
            <select name="audience" defaultValue={event?.audience ?? "all"} className={inputClass}>
              <option value="all">All staff</option>
              <option value="team">Me and my team</option>
            </select>
          </Field>
        )}
      </div>
      <Field label="Details (optional)">
        <textarea name="description" rows={3} maxLength={500} defaultValue={event?.description} className={inputClass} />
      </Field>
    </div>
  );
}

/** A calendar entry; opens its details, and for HR events lets HR edit or delete it. */
export function CalendarChip({
  item,
  event,
  canEdit = false,
  isHr = true,
  personHref,
  full = false,
  cutStart = false,
  cutEnd = false,
}: {
  item: CalendarItem;
  /** The HR event behind this item, when there is one. */
  event?: HrCalendarEvent;
  canEdit?: boolean;
  isHr?: boolean;
  personHref?: string;
  /** Show the time and details inline (week and day views). */
  full?: boolean;
  cutStart?: boolean;
  cutEnd?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const style = KIND_STYLE[item.kind];
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-label={`${style.label}: ${item.title}${item.pending ? " (pending)" : ""}`}
        title={`${item.title}${item.time ? ` · ${item.time}` : ""}${item.detail ? ` · ${item.detail}` : ""}`}
        className={`block w-full truncate border px-1.5 text-left text-xs leading-5 hover:brightness-95 ${style.chip} ${item.pending ? "border-dashed" : ""} ${cutStart ? "rounded-l-none border-l-0" : "rounded-l-md"} ${cutEnd ? "rounded-r-none border-r-0" : "rounded-r-md"} ${full ? "py-1" : ""}`}
      >
        {item.time && <span className="mr-1 font-semibold">{item.time}</span>}
        {item.title}
        {full && item.detail && <span className="block truncate opacity-75">{item.detail}</span>}
      </button>
      <dialog
        ref={ref}
        aria-label={item.title}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border border-admin-border bg-admin-card p-0 text-admin-text shadow-2xl backdrop:bg-black/40"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-admin-border px-6 py-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-admin-muted">
              <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} aria-hidden="true" />
              {style.label}
              {item.pending && " · pending approval"}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
          </div>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="rounded-lg p-1 text-admin-muted hover:bg-admin-bg">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[75vh] space-y-3 overflow-y-auto px-6 py-5 text-sm">
          <p>
            {fmt(item.start)}
            {item.end !== item.start && ` – ${fmt(item.end)}`}
            {item.time && ` · ${item.time}`}
          </p>
          {item.repeatLabel && <p className="text-admin-muted">{item.repeatLabel}. Changes apply to every occurrence.</p>}
          {item.detail && <p className="text-admin-muted">{item.detail}</p>}
          {personHref && (
            <a href={personHref} className="inline-block font-semibold text-admin-primary hover:underline">
              View their record
            </a>
          )}
          {event && canEdit && (
            <div className="space-y-4 border-t border-admin-border pt-4">
              <ActionForm action={saveCalendarEventAction} submitLabel="Save event" className="space-y-4">
                <EventFields event={event} isHr={isHr} />
              </ActionForm>
              <ActionForm action={deleteCalendarEventAction} submitLabel="Delete event" danger confirmText={`Remove ${event.title} from the calendar?`}>
                <input type="hidden" name="eventId" value={event.id} />
              </ActionForm>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
