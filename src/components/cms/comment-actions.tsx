"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2, Undo2 } from "lucide-react";

import { deleteCommentAction, setCommentStatusAction } from "@/app/admin/actions";
import { buttonClass } from "@/components/cms/ui";

export function CommentActions({ id, status }: { id: string; status: "pending" | "approved" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  return (
    <div className="flex flex-wrap gap-2">
      {status === "pending" ? (
        <button type="button" disabled={pending} onClick={() => run(() => setCommentStatusAction(id, "approved"))} className={buttonClass.primary}>
          <Check className="h-4 w-4" /> Approve
        </button>
      ) : (
        <button type="button" disabled={pending} onClick={() => run(() => setCommentStatusAction(id, "pending"))} className={buttonClass.secondary}>
          <Undo2 className="h-4 w-4" /> Unapprove
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this comment permanently?")) run(() => deleteCommentAction(id));
        }}
        className={buttonClass.danger}
      >
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  );
}
