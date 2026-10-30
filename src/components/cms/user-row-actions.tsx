"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, KeyRound, Loader2, Pencil, X } from "lucide-react";

import { setUserDisabledAction, setUserPasswordAction } from "@/app/admin/actions";
import { buttonClass, inputClass } from "@/components/cms/ui";

const iconBtn = "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:bg-admin-bg disabled:opacity-50";

/** Edit, set password and disable/enable for one row of the Users list. */
export function UserRowActions({ id, name, disabled, isMe }: { id: string; name: string; disabled: boolean; isMe: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  if (isMe) {
    return (
      <div className="flex justify-end">
        <a href="/admin/profile" className={`${iconBtn} text-admin-primary`}>
          <Pencil className="h-3.5 w-3.5" /> Edit my profile
        </a>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-end gap-1" data-user-actions={name}>
      <a href={`/admin/users/${id}`} className={`${iconBtn} text-admin-text`} aria-label={`Edit ${name}`}>
        <Pencil className="h-3.5 w-3.5" /> Edit
      </a>
      <button type="button" onClick={() => setOpen(true)} className={`${iconBtn} text-admin-text`} aria-label={`Set a new password for ${name}`}>
        <KeyRound className="h-3.5 w-3.5" /> Password
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!disabled && !confirm(`Disable ${name}? They will be signed out and can't sign in until you enable them again.`)) return;
          setError("");
          start(async () => {
            const res = await setUserDisabledAction(id, !disabled);
            if (!res.ok) setError(res.error ?? "Failed.");
            else router.refresh();
          });
        }}
        className={`${iconBtn} ${disabled ? "text-admin-success" : "text-admin-danger"}`}
        aria-label={`${disabled ? "Enable" : "Disable"} ${name}`}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : disabled ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
        {disabled ? "Enable" : "Disable"}
      </button>
      {error && <p role="alert" className="w-full text-right text-xs text-admin-danger">{error}</p>}
      {open && <PasswordDialog id={id} name={name} onClose={() => setOpen(false)} />}
    </div>
  );
}

function PasswordDialog({ id, name, onClose }: { id: string; name: string; onClose: () => void }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [mustChange, setMustChange] = useState(true);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={`New password for ${name}`} onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-admin-border bg-admin-card p-5 text-left shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">New password for {name}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        {done ? (
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-admin-success">
              <CheckCircle2 className="mr-1 inline h-4 w-4" /> Password changed. Give it to {name} privately{mustChange ? "; they will choose their own when they next sign in" : ""}.
            </p>
            <button type="button" onClick={onClose} className={buttonClass.primary}>Done</button>
          </div>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              start(async () => {
                const res = await setUserPasswordAction(id, password, mustChange);
                if (!res.ok) return setError(res.errors?.password ?? res.error ?? "Failed.");
                setDone(true);
                router.refresh();
              });
            }}
          >
            <label className="block text-sm font-semibold">
              New password
              <input type="text" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} mt-1.5 font-mono`} placeholder="At least 10 characters, letters and numbers" autoFocus />
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={mustChange} onChange={(e) => setMustChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--a-primary)]" />
              Ask them to choose their own password when they next sign in
            </label>
            {error && <p role="alert" className="text-sm text-admin-danger">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className={buttonClass.secondary}>Cancel</button>
              <button type="submit" disabled={pending || !password} className={buttonClass.primary}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Set password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
