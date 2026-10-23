import type { HrLeaveType, LeaveColor } from "@/lib/hr/types";

type Style = { dot: string; bar: string; pill: string };

/** Classes per leave colour (literal names so Tailwind generates them). */
export const LEAVE_COLOR_STYLE: Record<LeaveColor, Style> = {
  emerald: {
    dot: "bg-emerald-500",
    bar: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
    pill: "border-emerald-300 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300",
  },
  rose: {
    dot: "bg-rose-500",
    bar: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
    pill: "border-rose-300 text-rose-700 dark:border-rose-500/40 dark:text-rose-300",
  },
  slate: {
    dot: "bg-slate-500",
    bar: "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-300",
    pill: "border-slate-300 text-slate-700 dark:border-slate-500/40 dark:text-slate-300",
  },
  pink: {
    dot: "bg-pink-500",
    bar: "border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-300",
    pill: "border-pink-300 text-pink-700 dark:border-pink-500/40 dark:text-pink-300",
  },
  blue: {
    dot: "bg-blue-500",
    bar: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300",
    pill: "border-blue-300 text-blue-700 dark:border-blue-500/40 dark:text-blue-300",
  },
  violet: {
    dot: "bg-violet-500",
    bar: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300",
    pill: "border-violet-300 text-violet-700 dark:border-violet-500/40 dark:text-violet-300",
  },
  orange: {
    dot: "bg-orange-500",
    bar: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300",
    pill: "border-orange-300 text-orange-700 dark:border-orange-500/40 dark:text-orange-300",
  },
  cyan: {
    dot: "bg-cyan-500",
    bar: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300",
    pill: "border-cyan-300 text-cyan-700 dark:border-cyan-500/40 dark:text-cyan-300",
  },
  amber: {
    dot: "bg-amber-500",
    bar: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
    pill: "border-amber-300 text-amber-700 dark:border-amber-500/40 dark:text-amber-300",
  },
  teal: {
    dot: "bg-teal-500",
    bar: "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-300",
    pill: "border-teal-300 text-teal-700 dark:border-teal-500/40 dark:text-teal-300",
  },
  indigo: {
    dot: "bg-indigo-500",
    bar: "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300",
    pill: "border-indigo-300 text-indigo-700 dark:border-indigo-500/40 dark:text-indigo-300",
  },
  lime: {
    dot: "bg-lime-500",
    bar: "border-lime-300 bg-lime-50 text-lime-700 dark:border-lime-500/40 dark:bg-lime-500/10 dark:text-lime-300",
    pill: "border-lime-300 text-lime-700 dark:border-lime-500/40 dark:text-lime-300",
  },
};

/** Style for a leave type id (grey if the type no longer exists). */
export function leaveStyle(typeId: string, types: HrLeaveType[]): Style {
  const type = types.find((t) => t.id === typeId);
  return LEAVE_COLOR_STYLE[type?.color ?? "slate"] ?? LEAVE_COLOR_STYLE.slate;
}

/** Display name for a leave type id. */
export function leaveName(typeId: string, types: HrLeaveType[]): string {
  return types.find((t) => t.id === typeId)?.name ?? `${typeId} Leave`;
}
