"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquarePlus, Save } from "lucide-react";

import { addSubmissionNoteAction, updateSubmissionReviewAction } from "@/app/admin/actions";
import { buttonClass, formatDate, inputClass } from "@/components/cms/ui";
import type { SubmissionReview as Review } from "@/lib/cms/schema";

/** Stage, score and internal notes for an application, bid or feedback item. */
export function SubmissionReview({ id, stages, scored, review }: { id: string; stages: string[]; scored: boolean; review?: Review }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [stage, setStage] = useState(review?.stage ?? stages[0]);
  const [score, setScore] = useState(review?.score?.toString() ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Stage
          <select value={stage} onChange={(e) => setStage(e.target.value)} className={`mt-1.5 ${inputClass}`}>
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        {scored && (
          <label className="block text-sm font-medium">
            Evaluation score <span className="font-normal text-admin-muted">(0–100)</span>
            <input type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} className={`mt-1.5 ${inputClass}`} />
          </label>
        )}
        <button
          type="button"
          disabled={pending}
          className={buttonClass.primary}
          onClick={() =>
            start(async () => {
              const res = await updateSubmissionReviewAction(id, { stage, score: score === "" ? null : Number(score) });
              setMessage({ ok: res.ok, text: res.ok ? "Saved." : (res.error ?? "Could not save.") });
              router.refresh();
            })
          }
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save stage
        </button>
        {message && <p className={`text-xs ${message.ok ? "text-admin-success" : "text-admin-danger"}`}>{message.text}</p>}
        {review?.updatedAt && (
          <p className="text-xs text-admin-muted">
            Last updated by {review.updatedBy} · {formatDate(review.updatedAt, true)}
          </p>
        )}
      </div>

      <div className="border-t border-admin-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-admin-muted">Internal notes</p>
        {review?.notes?.length ? (
          <ul className="mt-3 space-y-3">
            {review.notes.map((n) => (
              <li key={n.id} className="rounded-lg bg-admin-bg p-3 text-sm">
                <p className="whitespace-pre-wrap">{n.text}</p>
                <p className="mt-1 text-xs text-admin-muted">
                  {n.author} · {formatDate(n.at, true)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-admin-muted">No notes yet. Notes are only visible to the team.</p>
        )}
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add a note for the team…" className={`mt-3 ${inputClass}`} />
        <button
          type="button"
          disabled={pending || !note.trim()}
          className={`mt-2 ${buttonClass.secondary}`}
          onClick={() =>
            start(async () => {
              const res = await addSubmissionNoteAction(id, note);
              if (res.ok) setNote("");
              else setMessage({ ok: false, text: res.error ?? "Could not add the note." });
              router.refresh();
            })
          }
        >
          <MessageSquarePlus className="h-4 w-4" /> Add note
        </button>
      </div>
    </div>
  );
}
