"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Trash2 } from "lucide-react";

import { deleteLearnerAction, resetLearnerPasswordAction } from "@/app/admin/actions";
import { buttonClass } from "@/components/cms/ui";

export function LearnerActions({ id, email, canDelete }: { id: string; email: string; canDelete: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [temp, setTemp] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          className={buttonClass.secondary}
          onClick={() => {
            if (!confirm(`Reset the password for ${email}?`)) return;
            startTransition(async () => {
              const res = await resetLearnerPasswordAction(id);
              if (res.ok && res.password) setTemp(res.password);
              else setError(res.error ?? "Could not reset password.");
            });
          }}
        >
          <KeyRound className="h-4 w-4" /> Reset password
        </button>
        {canDelete && (
          <button
            type="button"
            disabled={pending}
            className={buttonClass.danger}
            onClick={() => {
              if (!confirm(`Delete the learner account for ${email}? Their certificates stay valid.`)) return;
              startTransition(async () => {
                await deleteLearnerAction(id);
                router.refresh();
              });
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        )}
      </div>
      {temp && (
        <p className="rounded-lg bg-admin-primary-soft px-3 py-2 text-xs">
          Temporary password: <span className="select-all font-mono font-semibold">{temp}</span>. Send it to {email}; it is not shown again.
        </p>
      )}
      {error && <p className="text-xs text-admin-danger">{error}</p>}
    </div>
  );
}
