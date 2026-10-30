"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, Loader2, Lock, LockOpen, SquarePen, Trash2, X } from "lucide-react";

import { deleteUserAction, setUserDisabledAction, setUserPasswordAction } from "@/app/admin/actions";
import { buttonClass, inputClass } from "@/components/cms/ui";

/** Small grey icon button with a hover/focus label, as in the HR portal tables. */
function IconAction({ label, tip, onClick, href, tone = "", disabled, children }: { label: string; tip: string; onClick?: () => void; href?: string; tone?: string; disabled?: boolean; children: React.ReactNode }) {
  const cls = `group relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-admin-muted transition-colors hover:bg-admin-bg disabled:opacity-40 ${tone || "hover:text-admin-text"}`;
  const bubble = (
    <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-admin-text px-2 py-1 text-[11px] font-medium text-admin-card opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      {tip}
    </span>
  );
  return href ? (
    <a href={href} aria-label={label} className={cls}>
      {children}
      {bubble}
    </a>
  ) : (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className={cls}>
      {children}
      {bubble}
    </button>
  );
}

/** Edit, set password, disable/enable and delete for one row of the Users list. */
export function UserRowActions({ id, name, disabled, isMe }: { id: string; name: string; disabled: boolean; isMe: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError("");
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Failed.");
      else router.refresh();
    });
  };

  if (isMe) {
    return (
      <div className="flex justify-end">
        <IconAction href="/admin/profile" label="Edit my profile" tip="My profile">
          <SquarePen className="h-[18px] w-[18px]" />
        </IconAction>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-end gap-0.5" data-user-actions={name}>
      <IconAction href={`/admin/users/${id}`} label={`Edit ${name}`} tip="Edit">
        <SquarePen className="h-[18px] w-[18px]" />
      </IconAction>
      <IconAction label={`Set a new password for ${name}`} tip="Set password" onClick={() => setOpen(true)}>
        <KeyRound className="h-[18px] w-[18px]" />
      </IconAction>
      <IconAction
        label={`${disabled ? "Enable" : "Disable"} ${name}`}
        tip={disabled ? "Enable" : "Disable"}
        disabled={pending}
        tone={disabled ? "text-admin-warning hover:text-admin-success" : "hover:text-admin-warning"}
        onClick={() => {
          if (!disabled && !confirm(`Disable ${name}? They will be signed out and can't sign in until you enable them again.`)) return;
          run(() => setUserDisabledAction(id, !disabled));
        }}
      >
        {pending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : disabled ? <LockOpen className="h-[18px] w-[18px]" /> : <Lock className="h-[18px] w-[18px]" />}
      </IconAction>
      <IconAction
        label={`Delete ${name}`}
        tip="Delete"
        disabled={pending}
        tone="hover:text-admin-danger"
        onClick={() => confirm(`Delete ${name}'s account? This can't be undone. (To stop them signing in for now, use Disable instead.)`) && run(() => deleteUserAction(id))}
      >
        <Trash2 className="h-[18px] w-[18px]" />
      </IconAction>
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
