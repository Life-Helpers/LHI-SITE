"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, CircleCheck, CircleX, Copy, KeyRound, Loader2, Lock, LockOpen, Trash2 } from "lucide-react";

import type { HrResult } from "@/app/hrportal/actions";
import { announce } from "@/components/hr/notice-host";
import { Tip } from "@/components/hr/tooltip";

const ICONS = { approve: CircleCheck, reject: CircleX, cancel: Trash2, delete: Trash2, key: KeyRound, lock: Lock, unlock: LockOpen } as const;
const TONES = {
  approve: "text-admin-success hover:bg-admin-success-soft",
  reject: "text-admin-danger hover:bg-admin-danger-soft",
  cancel: "text-admin-muted hover:bg-admin-bg hover:text-admin-danger",
  key: "text-admin-muted hover:bg-admin-bg hover:text-admin-text",
  delete: "text-admin-muted hover:bg-admin-danger-soft hover:text-admin-danger",
  lock: "text-admin-muted hover:bg-admin-danger-soft hover:text-admin-danger",
  unlock: "text-admin-danger hover:bg-admin-success-soft hover:text-admin-success",
} as const;

/**
 * One-click row action (approve, reject, cancel, login link, lock). Only a shortcut: the server action checks
 * the signed-in person's permission and the record again.
 */
export function QuickAction({
  action,
  fields,
  kind,
  label,
  tip,
  confirmText,
  askNote,
}: {
  action: (prev: HrResult | null, form: FormData) => Promise<HrResult>;
  fields: Record<string, string>;
  kind: keyof typeof ICONS;
  label: string;
  /** Short hover label (defaults to none; `label` is always the accessible name). */
  tip?: string;
  confirmText?: string;
  /** Ask for an optional note (e.g. reason for rejecting). */
  askNote?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState<HrResult | null>(null);
  const noteDialog = useRef<HTMLDialogElement>(null);
  const Icon = ICONS[kind];
  // The row often disappears once it's done (e.g. an approved request), so the confirmation is shown on the page.
  useEffect(() => {
    if (state?.ok && !state.link && state.message) announce(state.message);
  }, [state]);
  return (
    <form
      action={formAction}
      className="relative inline-flex"
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) {
          e.preventDefault();
          return;
        }
        noteDialog.current?.close();
      }}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {askNote && (
        <dialog
          ref={noteDialog}
          aria-label={label}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-admin-border bg-admin-card p-0 text-left text-admin-text shadow-2xl backdrop:bg-black/40"
        >
          <div className="space-y-3 p-5">
            <h2 className="text-base font-semibold">{label}</h2>
            <label className="block text-sm">
              {askNote}
              <textarea name="note" rows={3} maxLength={300} className="mt-1 block w-full rounded-lg border border-admin-border bg-admin-card px-3 py-2 text-sm outline-none focus:border-admin-primary" />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => noteDialog.current?.close()} className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold hover:bg-admin-bg">
                Back
              </button>
              <button type="submit" disabled={pending} className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${kind === "approve" ? "bg-admin-primary" : "bg-admin-danger"}`}>
                {kind === "cancel" ? "Cancel leave" : label.split(" ")[0]}
              </button>
            </div>
          </div>
        </dialog>
      )}
      {(() => {
        const button = (
          <button
            type={askNote ? "button" : "submit"}
            onClick={askNote ? () => noteDialog.current?.showModal() : undefined}
            disabled={pending} title={tip ? undefined : label} aria-label={label} className={`rounded-lg p-1.5 disabled:opacity-50 ${TONES[kind]}`}>
            {pending ? <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" /> : <Icon className="h-[18px] w-[18px]" aria-hidden="true" />}
          </button>
        );
        return tip ? <Tip label={tip}>{button}</Tip> : button;
      })()}
      {state?.ok && state.link && dismissed !== state && (
        <span role="status" className="absolute right-0 top-full z-20 mt-1 w-80 space-y-2 rounded-lg border border-admin-border bg-admin-card p-3 text-left text-xs text-admin-text shadow-lg">
          <span className="block">{state.message}</span>
          <span className="flex gap-2">
            <input readOnly value={state.link} aria-label="One-time link" className="min-w-0 flex-1 rounded border border-admin-border bg-admin-bg px-2 py-1 font-mono text-[11px]" />
            <button type="button" onClick={() => void navigator.clipboard?.writeText(state.link!).then(() => setCopied(true))} className="inline-flex items-center gap-1 rounded border border-admin-border px-2 py-1 font-semibold">
              {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </span>
          <button type="button" onClick={() => setDismissed(state)} className="font-semibold text-admin-primary">
            Close
          </button>
        </span>
      )}
      {state && !state.ok && (
        <span role="alert" className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-admin-danger/30 bg-admin-danger-soft px-2 py-1 text-xs text-admin-danger shadow">
          {state.error}
        </span>
      )}
    </form>
  );
}
