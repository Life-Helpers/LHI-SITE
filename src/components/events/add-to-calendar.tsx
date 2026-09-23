"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarPlus, ChevronDown } from "lucide-react";

import type { CalendarEvent } from "@/data/observances";
import { googleCalendarUrl, icsPath, outlookCalendarUrl } from "@/lib/calendar";

/** "Add to calendar" menu: Google, Outlook, or an .ics file for Apple Calendar and others. */
export function AddToCalendar({ event, variant = "outline", className = "" }: { event: CalendarEvent; variant?: "outline" | "solid" | "light"; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const styles = {
    outline: "border border-border bg-background text-foreground hover:border-primary hover:text-primary",
    solid: "bg-primary text-primary-foreground hover:bg-primary/90",
    light: "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20",
  }[variant];
  const item = "block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none";

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${styles}`}
      >
        <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
        Add to calendar
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        <span className="sr-only">: {event.title}</span>
      </button>
      {open && (
        <div id={menuId} className="absolute left-0 z-30 mt-2 w-56 rounded-xl border border-border bg-popover p-1.5 shadow-xl">
          <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            Google Calendar
          </a>
          <a href={outlookCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={item} onClick={() => setOpen(false)}>
            Outlook.com
          </a>
          <a href={icsPath(event.id)} download className={item} onClick={() => setOpen(false)}>
            Apple / other (.ics)
          </a>
          {event.yearly && <p className="px-3 pb-1 pt-1.5 text-[11px] text-muted-foreground">Repeats every year.</p>}
        </div>
      )}
    </div>
  );
}
