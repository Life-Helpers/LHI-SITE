"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, CalendarX, Loader2, RefreshCw } from "lucide-react";

import { cancelInterviewAction, rescreenJobAction, scheduleInterviewAction, type RecruitmentResult } from "@/app/admin/recruitment-actions";
import { buttonClass, inputClass } from "@/components/cms/ui";
import type { Interview } from "@/lib/cms/schema";

function Message({ result }: { result: RecruitmentResult | null }) {
  if (!result) return null;
  return (
    <p role="status" className={`text-xs ${result.ok ? "text-admin-success" : "text-admin-danger"}`}>
      {result.ok ? result.message : result.error}
    </p>
  );
}

/** Score every applicant for a vacancy again, after its keywords change. */
export function RescreenButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<RecruitmentResult | null>(null);
  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        className={buttonClass.secondary}
        onClick={() =>
          start(async () => {
            setResult(await rescreenJobAction(jobId));
            router.refresh();
          })
        }
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Re-screen CVs
      </button>
      <Message result={result} />
    </div>
  );
}

/** Book, change or cancel an applicant's interview. */
export function InterviewScheduler({ id, interview, hasEmail }: { id: string; interview?: Interview; hasEmail: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<RecruitmentResult | null>(null);
  const [date, setDate] = useState(interview?.at.slice(0, 10) ?? "");
  const [time, setTime] = useState(interview?.at.slice(11, 16) ?? "10:00");
  const [minutes, setMinutes] = useState(String(interview?.minutes ?? 30));
  const [mode, setMode] = useState<string>(interview?.mode ?? "Video call");
  const [where, setWhere] = useState(interview?.where ?? "");
  const [message, setMessage] = useState(interview?.message ?? "");
  const [email, setEmail] = useState(hasEmail);

  const save = () =>
    start(async () => {
      setResult(await scheduleInterviewAction(id, { date, time, minutes: Number(minutes), mode, where, message, email }));
      router.refresh();
    });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium">
          Date
          <input id="interview-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium">
          Time <span className="font-normal text-admin-muted">(Nigeria)</span>
          <input id="interview-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`mt-1.5 ${inputClass}`} />
        </label>
        <label className="block text-sm font-medium">
          How
          <select id="interview-mode" value={mode} onChange={(e) => setMode(e.target.value)} className={`mt-1.5 ${inputClass}`}>
            <option>Video call</option>
            <option>Phone call</option>
            <option>In person</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Minutes
          <input id="interview-minutes" type="number" min={15} max={240} step={15} value={minutes} onChange={(e) => setMinutes(e.target.value)} className={`mt-1.5 ${inputClass}`} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        {mode === "In person" ? "Address" : mode === "Video call" ? "Meeting link" : "Number we will call"}
        <input
          id="interview-where"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder={mode === "In person" ? "LHI office, Sokoto" : mode === "Video call" ? "https://meet.google.com/…" : "+234…"}
          className={`mt-1.5 ${inputClass}`}
        />
      </label>
      <label className="block text-sm font-medium">
        Note to the candidate <span className="font-normal text-admin-muted">(optional)</span>
        <textarea
          id="interview-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. Please bring your certificates and a valid ID."
          className={`mt-1.5 ${inputClass}`}
        />
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input id="interview-email" type="checkbox" checked={email} disabled={!hasEmail} onChange={(e) => setEmail(e.target.checked)} className="mt-1 accent-admin-primary" />
        <span>{hasEmail ? "Email the invitation to the candidate, with an \"Add to my calendar\" link" : "This applicant gave no email address; tell them yourself."}</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={pending} onClick={save} className={buttonClass.primary}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />} {interview ? "Reschedule" : "Schedule interview"}
        </button>
        {interview && (
          <button
            type="button"
            disabled={pending}
            className={buttonClass.danger}
            onClick={() =>
              start(async () => {
                setResult(await cancelInterviewAction(id));
                router.refresh();
              })
            }
          >
            <CalendarX className="h-4 w-4" /> Cancel interview
          </button>
        )}
      </div>
      <Message result={result} />
    </div>
  );
}
