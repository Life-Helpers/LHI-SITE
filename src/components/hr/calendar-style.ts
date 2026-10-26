import type { CalendarKind } from "@/lib/hr/calendar";

/** Category colours (always shown with a text label and the legend, never colour alone). */
export const KIND_STYLE: Record<CalendarKind, { label: string; dot: string; chip: string }> = {
  meeting: { label: "Meeting", dot: "bg-blue-600", chip: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200" },
  holiday: { label: "Holiday", dot: "bg-emerald-600", chip: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200" },
  leave: { label: "Leave", dot: "bg-amber-600", chip: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200" },
  birthday: { label: "Birthday", dot: "bg-pink-600", chip: "border-pink-300 bg-pink-50 text-pink-800 dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-200" },
  event: { label: "Event", dot: "bg-violet-600", chip: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200" },
};
