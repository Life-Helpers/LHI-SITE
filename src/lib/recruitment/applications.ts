import "server-only";

import type { Interview, Submission } from "@/lib/cms/schema";
import { readPrivateUpload } from "@/lib/cms/private-uploads";
import type { CmsJob } from "@/lib/cms/types";
import { cvText } from "@/lib/recruitment/cv-text";
import { screenCv } from "@/lib/recruitment/screening";

/**
 * Whether an application is for this vacancy. Newer applications carry the vacancy's id; older
 * ones only its title and reference, so those are matched on both.
 */
export function isFor(s: Submission, job: Pick<CmsJob, "id" | "title" | "reference">): boolean {
  if (s.type !== "job-application") return false;
  if (s.jobId) return s.jobId === job.id;
  return s.fields.vacancy === job.title && (s.fields.reference ?? "") === (job.reference ?? "");
}

/** Score an application's CV (its first attachment) against the vacancy's current keywords. */
export async function rescreen(s: Submission, keywords: readonly string[]): Promise<Submission["screening"]> {
  const cv = s.attachments?.[0];
  if (!cv) return screenCv("", keywords);
  const data = await readPrivateUpload(cv.stored).catch(() => null);
  return screenCv(data ? await cvText(new Uint8Array(data), cv.filename) : "", keywords);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "Wednesday, 18 November 2026 at 10:00" for an interview's Lagos date-time. */
export function interviewWhen(at: string): string {
  const [date, time] = at.split("T");
  const d = new Date(`${date}T12:00:00Z`);
  return `${d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })} at ${time}`;
}

/** A link that adds the interview to the candidate's Google Calendar (times in Lagos). */
export function calendarLink(interview: Interview, title: string): string {
  const start = new Date(`${interview.at}:00Z`);
  const end = new Date(start.getTime() + interview.minutes * 60_000);
  const stamp = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`;
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: "Africa/Lagos",
    details: `${interview.mode} interview with Life Helpers Initiative.`,
    location: interview.where,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}
