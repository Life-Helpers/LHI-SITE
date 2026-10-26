"use client";

import { Fragment, useActionState, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Copy, Loader2, X } from "lucide-react";

import type { HrResult } from "@/app/hrportal/actions";

type Action = (prev: HrResult | null, form: FormData) => Promise<HrResult>;

/**
 * A form posting to an HR portal server action. Shows the result (error, confirmation, or a
 * one-time link with a copy button). The server decides everything; this is only display.
 */
export function ActionForm({
  action,
  children,
  submitLabel,
  className = "space-y-3",
  submitClassName = "",
  danger = false,
  resetOnSuccess = false,
  closeOnSuccess = false,
  confirmText,
}: {
  action: Action;
  children?: React.ReactNode;
  submitLabel: string;
  className?: string;
  submitClassName?: string;
  danger?: boolean;
  resetOnSuccess?: boolean;
  /**
   * In a pop-up: on success, close it, start the form afresh (fields and their live hints), and
   * show the confirmation as a notice on the page instead.
   */
  closeOnSuccess?: boolean;
  confirmText?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [round, setRound] = useState(0);
  const [notice, setNotice] = useState<HrResult | null>(null);
  useEffect(() => {
    if (!state?.ok) return;
    if (resetOnSuccess) formRef.current?.reset();
    if (closeOnSuccess) {
      formRef.current?.closest("dialog")?.close();
      setRound((n) => n + 1);
      setNotice(state);
    }
  }, [state, resetOnSuccess, closeOnSuccess]);
  useEffect(() => {
    if (!notice || notice.link) return;
    const t = setTimeout(() => setNotice(null), 8000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <Fragment key={round}>{children}</Fragment>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
            danger ? "bg-admin-danger hover:opacity-90" : "bg-admin-primary hover:opacity-90"
          } ${submitClassName}`}
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {submitLabel}
        </button>
      </div>
      {closeOnSuccess && state?.ok ? null : <Result state={state} />}
      {notice &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-50 w-[min(26rem,calc(100%-2rem))] rounded-xl border border-admin-border bg-admin-card p-1 shadow-xl">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <Result state={notice} />
              </div>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="rounded p-1 text-admin-muted hover:bg-admin-bg">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </form>
  );
}

function Result({ state }: { state: HrResult | null }) {
  const [copied, setCopied] = useState(false);
  if (!state) return null;
  if (!state.ok) {
    return (
      <p role="alert" className="rounded-lg bg-admin-danger-soft px-3 py-2 text-sm text-admin-danger">
        {state.error}
      </p>
    );
  }
  return (
    <div role="status" className="space-y-2 rounded-lg bg-admin-success-soft px-3 py-2 text-sm text-admin-success">
      <p>{state.message}</p>
      {state.link && (
        <div className="flex items-center gap-2">
          <input readOnly value={state.link} aria-label="One-time link" className="min-w-0 flex-1 rounded border border-admin-border bg-admin-card px-2 py-1 font-mono text-xs text-admin-text" />
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(state.link!).then(() => setCopied(true));
            }}
            className="inline-flex items-center gap-1 rounded border border-admin-border bg-admin-card px-2 py-1 text-xs font-semibold text-admin-text"
          >
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
