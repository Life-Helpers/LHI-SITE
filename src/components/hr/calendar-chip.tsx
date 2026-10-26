"use client";

import { useRef } from "react";
import { X } from "lucide-react";

import { deleteCalendarEventAction, restoreOccurrenceAction, saveCalendarEventAction, saveOccurrenceAction, skipOccurrenceAction } from "@/app/hrportal/actions";
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
          {item.repeatLabel && <p className="text-admin-muted">{item.repeatLabel}.{item.overridden ? " This date was changed on its own." : ""}</p>}
          {item.detail && <p className="text-admin-muted">{item.detail}</p>}
          {personHref && (
            <a href={personHref} className="inline-block font-semibold text-admin-primary hover:underline">
              View their record
            </a>
          )}
          {event && canEdit && item.occurrenceDate && (
            <OccurrenceControls item={item} event={event} isHr={isHr} />
          )}
          {event && canEdit && !item.occurrenceDate && (
            <div className="space-y-4 border-t border-admin-border pt-4">
              <SeriesForms event={event} isHr={isHr} />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}

function SeriesForms({ event, isHr }: { event: HrCalendarEvent; isHr: boolean }) {
  return (
    <>
      <ActionForm action={saveCalendarEventAction} submitLabel="Save event" className="space-y-4">
        <EventFields event={event} isHr={isHr} />
      </ActionForm>
      <ActionForm action={deleteCalendarEventAction} submitLabel={event.repeat && event.repeat !== "none" ? "Delete every occurrence" : "Delete event"} danger confirmText={`Remove ${event.title} from the calendar${event.repeat && event.repeat !== "none" ? " (every occurrence)" : ""}?`}>
        <input type="hidden" name="eventId" value={event.id} />
      </ActionForm>
    </>
  );
}

/** For one date of a repeating entry: change it, skip it, or reset it; or edit the whole series. */
function OccurrenceControls({ item, event, isHr }: { item: CalendarItem; event: HrCalendarEvent; isHr: boolean }) {
  const date = item.occurrenceDate!;
  const override = event.overrides?.find((o) => o.date === date);
  const keys = (
    <>
      <input type="hidden" name="eventId" value={event.id} />
      <input type="hidden" name="occurrenceDate" value={date} />
    </>
  );
  return (
    <div className="space-y-5 border-t border-admin-border pt-4">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">
          This occurrence only <span className="font-normal text-admin-muted">({fmt(date)}{item.overridden ? ", changed" : ""})</span>
        </h3>
        <ActionForm action={saveOccurrenceAction} submitLabel="Save this occurrence" className="space-y-3">
          {keys}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input name="title" required maxLength={120} defaultValue={override?.title ?? event.title} className={inputClass} />
            </Field>
            <Field label="Date">
              <input name="startDate" type="date" required defaultValue={override?.startDate ?? item.start} className={inputClass} />
            </Field>
            {item.end !== item.start && <input type="hidden" name="endDate" value={override?.endDate ?? item.end} />}
            <Field label="Time (optional)">
              <input name="time" type="time" defaultValue={override?.time ?? event.time} className={inputClass} />
            </Field>
            <Field label="Location (optional)">
              <input name="location" maxLength={120} defaultValue={override?.location ?? event.location} className={inputClass} />
            </Field>
          </div>
          <Field label="Details (optional)">
            <textarea name="description" rows={2} maxLength={500} defaultValue={override?.description ?? event.description} className={inputClass} />
          </Field>
        </ActionForm>
        <div className="flex flex-wrap gap-3">
          <ActionForm action={skipOccurrenceAction} submitLabel="Skip this date" danger confirmText={`Skip ${item.title} on ${fmt(date)}? The rest of the series stays.`}>
            {keys}
          </ActionForm>
          {item.overridden && (
            <ActionForm action={restoreOccurrenceAction} submitLabel="Reset to the series">
              {keys}
            </ActionForm>
          )}
        </div>
      </section>
      <details className="rounded-lg border border-admin-border">
        <summary className="cursor-pointer px-3 py-2 text-sm font-semibold">All occurrences (the whole series)</summary>
        <div className="space-y-4 border-t border-admin-border p-3">
          {(event.skipDates?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs font-medium text-admin-muted">Skipped dates</p>
              <ul className="mt-1 space-y-1">
                {event.skipDates!.map((d) => (
                  <li key={d} className="flex items-center justify-between gap-3 text-sm">
                    {fmt(d)}
                    <ActionForm action={restoreOccurrenceAction} submitLabel="Restore" submitClassName="px-3 py-1 text-xs" className="flex">
                      <input type="hidden" name="eventId" value={event.id} />
                      <input type="hidden" name="occurrenceDate" value={d} />
                    </ActionForm>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <SeriesForms event={event} isHr={isHr} />
        </div>
      </details>
    </div>
  );
}

