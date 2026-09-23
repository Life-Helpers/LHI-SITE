"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, Inbox, Mail, Trash2 } from "lucide-react";

import { deleteSubmissionAction, setSubmissionStatusAction } from "@/app/admin/actions";
import { buttonClass } from "@/components/cms/ui";
import type { SubmissionStatus } from "@/lib/cms/schema";

export function SubmissionActions({
  id,
  status,
  email,
  subject,
  canDelete,
}: {
  id: string;
  status: SubmissionStatus;
  email: string;
  subject: string;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Opening a new submission marks it as read, like an email client.
  useEffect(() => {
    if (status === "new") {
      setSubmissionStatusAction(id, "read").then(() => router.refresh());
    }
  }, [id, status, router]);

  const setStatus = (next: SubmissionStatus) =>
    startTransition(async () => {
      await setSubmissionStatusAction(id, next);
      router.refresh();
    });

  return (
    <div className="flex flex-wrap gap-2">
      {email && (
        <a href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`} className={buttonClass.primary}>
          <Mail className="h-4 w-4" /> Reply by email
        </a>
      )}
      {status === "archived" ? (
        <button type="button" className={buttonClass.secondary} disabled={pending} onClick={() => setStatus("read")}>
          <Inbox className="h-4 w-4" /> Move to inbox
        </button>
      ) : (
        <button type="button" className={buttonClass.secondary} disabled={pending} onClick={() => setStatus("archived")}>
          <Archive className="h-4 w-4" /> Archive
        </button>
      )}
      {canDelete && (
        <button
          type="button"
          className={buttonClass.danger}
          disabled={pending}
          onClick={() => {
            if (!window.confirm("Delete this submission permanently?")) return;
            startTransition(async () => {
              await deleteSubmissionAction(id);
              router.push("/admin/submissions");
              router.refresh();
            });
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      )}
    </div>
  );
}
