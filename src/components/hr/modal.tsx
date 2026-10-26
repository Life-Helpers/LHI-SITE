"use client";

import { useRef } from "react";
import { Eye, FileUp, KeyRound, LogIn, Plus, SquarePen, Undo2, X } from "lucide-react";

import { Tip } from "@/components/hr/tooltip";

/** A button that opens a native dialog with a form inside (e.g. "Add employee"). */
export function Modal({
  label,
  title,
  description,
  children,
  wide = false,
  outline = false,
  icon = "plus",
  iconOnly = false,
}: {
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  wide?: boolean;
  /** Secondary (outlined) button instead of the green one. */
  outline?: boolean;
  icon?: "plus" | "upload" | "key" | "edit" | "view" | "return" | "recall";
  /** Show just the icon (with a tooltip), e.g. in a table row. */
  iconOnly?: boolean;
}) {
  const Icon = { plus: Plus, upload: FileUp, key: KeyRound, edit: SquarePen, view: Eye, return: LogIn, recall: Undo2 }[icon];
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      {iconOnly ? (
        <Tip label={label}>
          <button type="button" onClick={() => ref.current?.showModal()} aria-label={title} className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-text">
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </Tip>
      ) : (
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className={
          outline
            ? "inline-flex items-center justify-center gap-2 rounded-lg border border-admin-border bg-admin-card px-4 py-2 text-sm font-semibold text-admin-text hover:bg-admin-bg"
            : "inline-flex items-center justify-center gap-2 rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
        }
      >
        <Icon className="h-4 w-4" aria-hidden="true" /> {label}
      </button>
      )}
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
