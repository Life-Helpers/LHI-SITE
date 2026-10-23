"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";

/** A button that opens a native dialog with a form inside (e.g. "Add employee"). */
export function Modal({
  label,
  title,
  description,
  children,
  wide = false,
}: {
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
      >
        <Plus className="h-4 w-4" aria-hidden="true" /> {label}
      </button>
      <dialog
        ref={ref}
        aria-label={title}
        className={`m-auto w-[calc(100%-2rem)] rounded-xl border border-admin-border bg-admin-card p-0 text-admin-text shadow-2xl backdrop:bg-black/40 ${wide ? "max-w-3xl" : "max-w-lg"}`}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-admin-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-admin-muted">{description}</p>}
          </div>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="rounded-lg p-1 text-admin-muted hover:bg-admin-bg">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </dialog>
    </>
  );
}
