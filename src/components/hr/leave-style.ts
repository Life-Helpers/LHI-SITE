import type { LeaveType } from "@/lib/hr/types";

/** Colours per leave type (literal class names so Tailwind generates them). */
export const LEAVE_STYLE: Record<LeaveType, { dot: string; bar: string; pill: string }> = {
  Annual: {
    dot: "bg-emerald-500",
    bar: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
    pill: "border-emerald-300 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300",
  },
  Sick: {
    dot: "bg-rose-500",
    bar: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
    pill: "border-rose-300 text-rose-700 dark:border-rose-500/40 dark:text-rose-300",
  },
  Compassionate: {
    dot: "bg-slate-500",
    bar: "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-300",
    pill: "border-slate-300 text-slate-700 dark:border-slate-500/40 dark:text-slate-300",
  },
  Maternity: {
    dot: "bg-pink-500",
    bar: "border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-500/40 dark:bg-pink-500/10 dark:text-pink-300",
    pill: "border-pink-300 text-pink-700 dark:border-pink-500/40 dark:text-pink-300",
  },
  Paternity: {
    dot: "bg-blue-500",
    bar: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300",
    pill: "border-blue-300 text-blue-700 dark:border-blue-500/40 dark:text-blue-300",
  },
  Study: {
    dot: "bg-violet-500",
    bar: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300",
    pill: "border-violet-300 text-violet-700 dark:border-violet-500/40 dark:text-violet-300",
  },
  Unpaid: {
    dot: "bg-orange-500",
    bar: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-300",
    pill: "border-orange-300 text-orange-700 dark:border-orange-500/40 dark:text-orange-300",
  },
  Other: {
    dot: "bg-cyan-500",
    bar: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300",
    pill: "border-cyan-300 text-cyan-700 dark:border-cyan-500/40 dark:text-cyan-300",
  },
};

export const leaveLabel = (type: LeaveType) => `${type} Leave`;
