"use client";

import { useActionState } from "react";
import { CircleCheck, CircleX, Loader2, Trash2 } from "lucide-react";

import type { HrResult } from "@/app/hrportal/actions";

const ICONS = { approve: CircleCheck, reject: CircleX, cancel: Trash2 } as const;
const TONES = {
  approve: "text-admin-success hover:bg-admin-success-soft",
  reject: "text-admin-danger hover:bg-admin-danger-soft",
  cancel: "text-admin-muted hover:bg-admin-bg hover:text-admin-danger",
} as const;

/**
 * One-click row action (approve, reject, cancel). Only a shortcut: the server action checks
 * the signed-in person's permission and the record again.
 */
export function QuickAction({
  action,
  fields,
  kind,
  label,
  confirmText,
  askNote,
}: {
  action: (prev: HrResult | null, form: FormData) => Promise<HrResult>;
  fields: Record<string, string>;
  kind: keyof typeof ICONS;
  label: string;
  confirmText?: string;
  /** Ask for an optional note (e.g. reason for rejecting). */
  askNote?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const Icon = ICONS[kind];
  return (
    <form
      action={formAction}
      className="relative inline-flex"
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) {
          e.preventDefault();
          return;
        }
        if (askNote) {
          const note = window.prompt(askNote) ?? null;
          if (note === null) {
            e.preventDefault();
            return;
          }
          const input = e.currentTarget.elements.namedItem("note") as HTMLInputElement | null;
          if (input) input.value = note;
        }
      }}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {askNote && <input type="hidden" name="note" defaultValue="" />}
      <button type="submit" disabled={pending} title={label} aria-label={label} className={`rounded-lg p-1.5 disabled:opacity-50 ${TONES[kind]}`}>
        {pending ? <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" /> : <Icon className="h-[18px] w-[18px]" aria-hidden="true" />}
      </button>
      {state && !state.ok && (
        <span role="alert" className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-admin-danger/30 bg-admin-danger-soft px-2 py-1 text-xs text-admin-danger shadow">
          {state.error}
        </span>
      )}
    </form>
  );
}
