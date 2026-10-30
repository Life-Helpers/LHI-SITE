"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, CheckCircle2, Download, FileUp, Loader2, Lock, Save, Trash2 } from "lucide-react";

import { deleteCourseAction, importCourseAction, moveCourseAction, saveCourseAction } from "@/app/admin/training-actions";
import { AssetField } from "@/components/cms/item-editor";
import { buttonClass, Card, inputClass } from "@/components/cms/ui";
import { LHI_PHOTOS, type LhiPhotoKey } from "@/data/lhi-photos";
import type { CourseDraft, ExamDraft, LessonDraft } from "@/lib/training/editor-types";

const PHOTO_OPTIONS = (Object.keys(LHI_PHOTOS) as LhiPhotoKey[]).map((k) => ({ value: k, label: LHI_PHOTOS[k].alt }));
const LETTERS = "ABCDEF";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <span className="mt-1.5 block font-normal">{children}</span>
      {hint && <span className="mt-1 block text-xs font-normal text-admin-muted">{hint}</span>}
    </label>
  );
}

/** A photo from LHI's library, or an uploaded one (which wins). */
function PhotoField({ photo, image, disabled, onChange }: { photo: LhiPhotoKey; image: string; disabled: boolean; onChange: (v: { photo?: LhiPhotoKey; image?: string }) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Photo from LHI's library">
        <select value={photo} disabled={disabled} onChange={(e) => onChange({ photo: e.target.value as LhiPhotoKey })} className={inputClass}>
          {PHOTO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>
      <div className="text-sm font-semibold">
        Or upload a photo
        <div className="mt-1.5 font-normal">{disabled ? <p className="text-xs text-admin-muted">{image || "None"}</p> : <AssetField kind="image" value={image} onChange={(v) => onChange({ image: v })} common={{}} />}</div>
      </div>
    </div>
  );
}

/** Multiple-choice question: prompt, options, and (where allowed) the correct one. */
function QuestionEditor({
  index,
  label,
  prompt,
  options,
  answer,
  showAnswer,
  explain,
  disabled,
  onChange,
  onRemove,
}: {
  index: number;
  label: string;
  prompt: string;
  options: string[];
  answer: number;
  showAnswer: boolean;
  explain?: string;
  disabled: boolean;
  onChange: (v: { prompt?: string; options?: string[]; answer?: number; explain?: string }) => void;
  onRemove: () => void;
}) {
  const name = useId();
  return (
    <fieldset className="rounded-lg border border-admin-border p-3" data-question>
      <legend className="px-1 text-xs font-semibold text-admin-muted">
        {label} {index + 1}
      </legend>
      <input value={prompt} disabled={disabled} onChange={(e) => onChange({ prompt: e.target.value })} placeholder="Question" aria-label={`${label} ${index + 1}`} className={inputClass} />
      <div className="mt-2 space-y-1.5">
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            {showAnswer ? (
              <input type="radio" name={name} checked={answer === i} disabled={disabled} onChange={() => onChange({ answer: i })} aria-label={`Option ${LETTERS[i]} is correct`} className="h-4 w-4 accent-[var(--a-primary)]" />
            ) : (
              <span className="w-4 text-center text-xs text-admin-muted">{LETTERS[i]}</span>
            )}
            <input
              value={o}
              disabled={disabled}
              onChange={(e) => onChange({ options: options.map((x, j) => (j === i ? e.target.value : x)) })}
              placeholder={`Option ${LETTERS[i]}`}
              aria-label={`Option ${LETTERS[i]}`}
              className={`${inputClass} mt-0`}
            />
            {!disabled && options.length > 2 && (
              <button
                type="button"
                onClick={() => onChange({ options: options.filter((_, j) => j !== i), answer: answer === i ? -1 : answer > i ? answer - 1 : answer })}
                className="text-xs text-admin-muted hover:text-admin-danger"
                aria-label={`Remove option ${LETTERS[i]}`}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      {showAnswer && <p className="mt-1.5 text-xs text-admin-muted">{answer >= 0 ? `Correct answer: ${LETTERS[answer]}` : "Tick the correct answer."}</p>}
      {explain !== undefined && (
        <input value={explain} disabled={disabled} onChange={(e) => onChange({ explain: e.target.value })} placeholder="Why it's right (shown after answering)" aria-label="Explanation" className={`${inputClass} mt-2`} />
      )}
      {!disabled && (
        <div className="mt-2 flex justify-between">
          {options.length < 6 ? (
            <button type="button" onClick={() => onChange({ options: [...options, ""] })} className="text-xs font-semibold text-admin-primary">
              + Add option
            </button>
          ) : (
            <span />
          )}
          <button type="button" onClick={onRemove} className="text-xs font-semibold text-admin-danger">
            Remove question
          </button>
        </div>
      )}
    </fieldset>
  );
}

const newLesson = (photo: LhiPhotoKey): LessonDraft => ({ id: "", title: "", summary: "", minutes: 5, photo, image: "", text: "", check: [] });
const newExam = (): ExamDraft => ({ id: "", prompt: "", options: ["", "", "", ""], answer: -1 });

export function CourseEditor({ initial, isNew = false, canWrite, canExam, canPublish }: { initial: CourseDraft; isNew?: boolean; canWrite: boolean; canExam: boolean; canPublish: boolean }) {
  const router = useRouter();
  const [c, setC] = useState(initial);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = (patch: Partial<CourseDraft>) => setC((cur) => ({ ...cur, ...patch }));
  const setLesson = (i: number, patch: Partial<LessonDraft>) => set({ lessons: c.lessons.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  const moveLesson = (i: number, d: -1 | 1) => {
    const list = [...c.lessons];
    [list[i], list[i + d]] = [list[i + d], list[i]];
    set({ lessons: list });
  };

  const save = () =>
    start(async () => {
      setNotice(null);
      const res = await saveCourseAction(isNew ? null : initial.id, c);
      if (!res.ok) return setNotice({ ok: false, text: res.error ?? "Save failed." });
      if (isNew) return router.push(`/admin/training/${res.id}`);
      setNotice({ ok: true, text: "Saved." });
      router.refresh();
    });

  return (
    <div className="space-y-6" data-course-editor>
      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center gap-3 rounded-xl border border-admin-border bg-admin-card/95 px-4 py-3 backdrop-blur">
        {canPublish ? (
          <label className="flex items-center gap-2 text-sm font-semibold">
            Status
            <select value={c.status} onChange={(e) => set({ status: e.target.value as CourseDraft["status"] })} className={`${inputClass} mt-0 w-auto`}>
              <option value="draft">Draft (hidden from learners)</option>
              <option value="published">Live (learners can take it)</option>
            </select>
          </label>
        ) : (
          <span className="text-sm text-admin-muted">{c.status === "published" ? "Live: your saved changes show to learners straight away" : "Draft: someone who can publish courses makes it live"}</span>
        )}
        <div className="ml-auto flex items-center gap-3">
          {notice && (
            <span role={notice.ok ? "status" : "alert"} className={`text-sm ${notice.ok ? "text-admin-success" : "text-admin-danger"}`}>
              {notice.ok && <CheckCircle2 className="mr-1 inline h-4 w-4" />}
              {notice.text}
            </span>
          )}
          <button type="button" onClick={save} disabled={pending} className={buttonClass.primary}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {isNew ? "Create course" : "Save course"}
          </button>
        </div>
      </div>

      <Card title="Course details" bodyClassName="space-y-4 p-5">
        {!canWrite && <p className="flex items-center gap-2 text-xs text-admin-muted"><Lock className="h-3.5 w-3.5" /> Read only: your role doesn&apos;t write course content.</p>}
        <Field label="Course title">
          <input value={c.title} disabled={!canWrite} onChange={(e) => set({ title: e.target.value })} maxLength={140} className={inputClass} placeholder="e.g. Protection from Sexual Exploitation and Abuse" />
        </Field>
        <Field label="Subtitle">
          <input value={c.subtitle} disabled={!canWrite} onChange={(e) => set({ subtitle: e.target.value })} maxLength={200} className={inputClass} />
        </Field>
        <Field label="Description">
          <textarea value={c.description} disabled={!canWrite} onChange={(e) => set({ description: e.target.value })} rows={3} maxLength={2000} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Level">
            <input value={c.level} disabled={!canWrite} onChange={(e) => set({ level: e.target.value })} className={inputClass} placeholder="Foundation" />
          </Field>
          <Field label="Who it's for">
            <input value={c.audience} disabled={!canWrite} onChange={(e) => set({ audience: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Facilitator">
            <input value={c.facilitator} disabled={!canWrite} onChange={(e) => set({ facilitator: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <PhotoField photo={c.photo} image={c.image} disabled={!canWrite} onChange={(v) => set(v)} />
      </Card>

      <Card
        title={`Lessons (${c.lessons.length})`}
        action={
          canWrite && (
            <button type="button" onClick={() => set({ lessons: [...c.lessons, newLesson(c.photo)] })} className="text-xs font-semibold text-admin-primary">
              + Add lesson
            </button>
          )
        }
        bodyClassName="space-y-3 p-5"
      >
        {c.lessons.map((l, i) => (
          <details key={i} open={!l.id} className="rounded-lg border border-admin-border" data-lesson>
            <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-semibold">
              <span className="text-admin-muted">{i + 1}.</span> {l.title || "New lesson"}
              <span className="ml-auto text-xs font-normal text-admin-muted">{l.minutes} min · {l.check.length} practice questions</span>
            </summary>
            <div className="space-y-4 border-t border-admin-border p-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-3">
                  <Field label="Lesson title">
                    <input value={l.title} disabled={!canWrite} onChange={(e) => setLesson(i, { title: e.target.value })} className={inputClass} />
                  </Field>
                </div>
                <Field label="Minutes">
                  <input type="number" min={1} max={240} value={l.minutes} disabled={!canWrite} onChange={(e) => setLesson(i, { minutes: Number(e.target.value) })} className={inputClass} />
                </Field>
              </div>
              <Field label="Summary">
                <input value={l.summary} disabled={!canWrite} onChange={(e) => setLesson(i, { summary: e.target.value })} className={inputClass} />
              </Field>
              <PhotoField photo={l.photo} image={l.image} disabled={!canWrite} onChange={(v) => setLesson(i, v)} />
              <Field
                label="Lesson content"
                hint="Leave a blank line between blocks. Start lines with “- ” for bullets or “1. ” for steps; put “## Title” above a list to name it; start a block with “[!info] Title”, “[!warning] Title” or “[!success] Title” for a highlighted box."
              >
                <textarea value={l.text} disabled={!canWrite} onChange={(e) => setLesson(i, { text: e.target.value })} rows={12} className={`${inputClass} font-mono text-xs`} aria-label={`Lesson ${i + 1} content`} />
              </Field>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Practice questions <span className="font-normal text-admin-muted">(learners see the answer straight away)</span></p>
                {l.check.map((q, n) => (
                  <QuestionEditor
                    key={n}
                    index={n}
                    label="Practice question"
                    prompt={q.prompt}
                    options={q.options}
                    answer={q.answer}
                    explain={q.explain}
                    showAnswer
                    disabled={!canWrite}
                    onChange={(v) => setLesson(i, { check: l.check.map((x, m) => (m === n ? { ...x, ...v } : x)) })}
                    onRemove={() => setLesson(i, { check: l.check.filter((_, m) => m !== n) })}
                  />
                ))}
                {canWrite && (
                  <button type="button" onClick={() => setLesson(i, { check: [...l.check, { prompt: "", options: ["", "", ""], answer: -1, explain: "" }] })} className="text-xs font-semibold text-admin-primary">
                    + Add practice question
                  </button>
                )}
              </div>
              {canWrite && (
                <div className="flex gap-2 border-t border-admin-border pt-3">
                  <button type="button" disabled={i === 0} onClick={() => moveLesson(i, -1)} className={buttonClass.secondary} aria-label="Move lesson up">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" disabled={i === c.lessons.length - 1} onClick={() => moveLesson(i, 1)} className={buttonClass.secondary} aria-label="Move lesson down">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => confirm(`Remove lesson “${l.title || i + 1}”?`) && set({ lessons: c.lessons.filter((_, j) => j !== i) })} className={`${buttonClass.danger} ml-auto`}>
                    <Trash2 className="h-4 w-4" /> Remove lesson
                  </button>
                </div>
              )}
            </div>
          </details>
        ))}
        {c.lessons.length === 0 && <p className="py-4 text-center text-sm text-admin-muted">No lessons yet.</p>}
      </Card>

      <Card
        title={`Final exam (${c.exam.length} questions)`}
        action={
          canExam && (
            <button type="button" onClick={() => set({ exam: [...c.exam, newExam()] })} className="text-xs font-semibold text-admin-primary">
              + Add question
            </button>
          )
        }
        bodyClassName="space-y-3 p-5"
      >
        {canExam ? (
          <>
            <Field label="Pass mark (%)" hint="Learners who score this or more get a certificate.">
              <input type="number" min={1} max={100} value={c.passMark} onChange={(e) => set({ passMark: Number(e.target.value) })} className={`${inputClass} max-w-32`} />
            </Field>
            {c.exam.map((q, n) => (
              <QuestionEditor
                key={n}
                index={n}
                label="Exam question"
                prompt={q.prompt}
                options={q.options}
                answer={q.answer}
                showAnswer
                disabled={false}
                onChange={(v) => set({ exam: c.exam.map((x, m) => (m === n ? { ...x, ...v } : x)) })}
                onRemove={() => set({ exam: c.exam.filter((_, m) => m !== n) })}
              />
            ))}
            {c.exam.length === 0 && <p className="py-4 text-center text-sm text-admin-muted">No exam questions yet. A course needs an exam before it can go live.</p>}
          </>
        ) : (
          <p className="flex items-center gap-2 text-sm text-admin-muted">
            <Lock className="h-4 w-4" /> Only people who set exams can see or change the exam questions, answers and pass mark ({c.passMark}%).
          </p>
        )}
      </Card>
    </div>
  );
}

/** Order, open and delete buttons on the course list. */
export function CourseRowActions({ id, title, live, first, last, canPublish }: { id: string; title: string; live: boolean; first: boolean; last: boolean; canPublish: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const act = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Failed.");
      else router.refresh();
    });
  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-admin-danger">{error}</span>}
      {canPublish && (
        <>
          <button type="button" disabled={pending || first} onClick={() => act(() => moveCourseAction(id, -1))} className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg disabled:opacity-30" aria-label={`Move ${title} up`}>
            <ArrowUp className="h-4 w-4" />
          </button>
          <button type="button" disabled={pending || last} onClick={() => act(() => moveCourseAction(id, 1))} className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg disabled:opacity-30" aria-label={`Move ${title} down`}>
            <ArrowDown className="h-4 w-4" />
          </button>
        </>
      )}
      <a href={`/api/admin/training/file?id=${encodeURIComponent(id)}`} className="rounded-lg p-1.5 text-admin-muted hover:bg-admin-bg" aria-label={`Download ${title} as a file`} title="Download as a file to edit">
        <Download className="h-4 w-4" />
      </a>
      <a href={`/admin/training/${id}`} className={buttonClass.secondary}>
        Open
      </a>
      {canPublish && !live && (
        <button type="button" disabled={pending} onClick={() => confirm(`Delete the draft course “${title}”? Certificates already issued stay valid.`) && act(() => deleteCourseAction(id))} className={buttonClass.danger} aria-label={`Delete ${title}`}>
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** Download the blank course template, and upload a filled-in file to create or update a course. */
export function CourseFileTools({ canUpload }: { canUpload: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const upload = (file: File | undefined) => {
    if (!file) return;
    start(async () => {
      setNotice(null);
      if (file.size > 400_000) return setNotice({ ok: false, text: "The file is too large." });
      const res = await importCourseAction(await file.text());
      if (!res.ok) return setNotice({ ok: false, text: res.error ?? "Upload failed." });
      setNotice({ ok: true, text: res.created ? "Course created as a draft." : "Course updated." });
      router.push(`/admin/training/${res.id}`);
    });
  };
  return (
    <div className="hr-card mb-6 flex flex-wrap items-center gap-3 p-4" data-course-file-tools>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold">Work on a course in a document</p>
        <p className="text-xs text-admin-muted">
          Download the template (or any course below), fill it in with Word or Notepad, save it as a .txt file and upload it. A file with a course&apos;s ID updates that course;
          without one it creates a new draft.
        </p>
      </div>
      <a href="/api/admin/training/file" className={buttonClass.secondary}>
        <Download className="h-4 w-4" /> Download template
      </a>
      {canUpload && (
        <label className={`${buttonClass.primary} cursor-pointer`}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />} Upload course file
          <input type="file" accept=".txt,.md,text/plain" className="sr-only" disabled={pending} onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      )}
      {notice && (
        <p role={notice.ok ? "status" : "alert"} className={`w-full text-sm ${notice.ok ? "text-admin-success" : "text-admin-danger"}`}>
          {notice.text}
        </p>
      )}
    </div>
  );
}
