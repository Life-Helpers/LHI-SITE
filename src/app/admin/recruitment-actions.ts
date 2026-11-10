"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/cms/activity";
import { AuthError, requireUser } from "@/lib/cms/auth";
import type { Interview } from "@/lib/cms/schema";
import { readStore, updateStore } from "@/lib/cms/store";
import { sendEmail } from "@/lib/email/send";
import { calendarLink, interviewWhen, isFor, rescreen } from "@/lib/recruitment/applications";

export interface RecruitmentResult {
  ok: boolean;
  error?: string;
  message?: string;
}

async function run(fn: () => Promise<RecruitmentResult>): Promise<RecruitmentResult> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, error: err.message };
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[recruitment action]", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/** Score every application for a vacancy again, against its current keywords. */
export async function rescreenJobAction(jobId: string): Promise<RecruitmentResult> {
  return run(async () => {
    const user = await requireUser("submissions");
    const job = (await readStore("jobs")).find((j) => j.id === jobId);
    if (!job) return { ok: false, error: "Vacancy not found." };
    if (!job.keywords?.length) return { ok: false, error: "Add screening keywords to the vacancy first (Jobs & Vacancies → edit the vacancy)." };
    const mine = (await readStore("submissions")).filter((s) => isFor(s, job));
    const results = new Map(await Promise.all(mine.map(async (s) => [s.id, await rescreen(s, job.keywords ?? [])] as const)));
    await updateStore("submissions", (items) => ({ items: items.map((s) => (results.has(s.id) ? { ...s, jobId: job.id, screening: results.get(s.id) } : s)) }));
    await logActivity(user, `re-screened ${mine.length} applications for`, job.title, `/admin/recruitment/${job.id}`);
    revalidatePath("/admin", "layout");
    const unreadable = [...results.values()].filter((r) => r && !r.readable).length;
    return {
      ok: true,
      message: `Re-screened ${mine.length} application${mine.length === 1 ? "" : "s"}.${unreadable ? ` ${unreadable} CV${unreadable === 1 ? "" : "s"} couldn't be read even with text recognition; check those by hand.` : ""}`,
    };
  });
}

const MODES: Interview["mode"][] = ["In person", "Video call", "Phone call"];

/** Schedule (or reschedule) an applicant's interview, move them to Interview, and optionally email them. */
export async function scheduleInterviewAction(
  id: string,
  input: { date: string; time: string; minutes: number; mode: string; where: string; message: string; email: boolean },
): Promise<RecruitmentResult> {
  return run(async () => {
    const user = await requireUser("submissions");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) return { ok: false, error: "Choose the interview date and time." };
    const at = `${input.date}T${input.time}`;
    // Lagos is UTC+1 all year.
    if (Date.parse(`${at}:00+01:00`) < Date.now()) return { ok: false, error: "That time has already passed." };
    const mode = MODES.find((m) => m === input.mode);
    if (!mode) return { ok: false, error: "Choose how the interview will happen." };
    const where = input.where.trim().slice(0, 500);
    if (!where) return { ok: false, error: mode === "In person" ? "Enter the address." : mode === "Video call" ? "Paste the meeting link." : "Enter the number you will call." };
    const minutes = Math.min(240, Math.max(15, Math.round(Number(input.minutes) || 30)));
    const interview: Interview = { at, minutes, mode, where, message: input.message.trim().slice(0, 1500), scheduledBy: user.name, scheduledAt: new Date().toISOString(), emailed: false };

    const target = (await readStore("submissions")).find((s) => s.id === id && s.type === "job-application");
    if (!target) return { ok: false, error: "Application not found." };
    const vacancy = target.fields.vacancy || "the position";

    if (input.email) {
      const sent = await sendEmail({
        to: target.email,
        subject: `Interview invitation: ${vacancy}`,
        kind: "interview",
        content: {
          greeting: `Dear ${target.name},`,
          heading: `You're invited to an interview for ${vacancy}.`,
          paragraphs: [
            `Thank you for applying to Life Helpers Initiative. We would like to invite you to an interview.`,
            `When: ${interviewWhen(at)} (Nigeria time), about ${minutes} minutes.`,
            `${mode === "In person" ? "Where" : mode === "Video call" ? "Join here" : "We will call you on"}: ${where}`,
            ...(interview.message ? [interview.message] : []),
            `Please reply to this email to confirm, or to ask for another time if this one doesn't suit you.`,
          ],
          cta: { label: "Add to my calendar", url: calendarLink(interview, `Interview: ${vacancy} (Life Helpers Initiative)`) },
        },
      });
      interview.emailed = Boolean(sent);
    }

    await updateStore("submissions", (items) => ({
      items: items.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "new" ? "read" : s.status,
              review: { notes: [], ...s.review, stage: "Interview", interview, updatedAt: interview.scheduledAt, updatedBy: user.name },
            }
          : s,
      ),
    }));
    await logActivity(user, `scheduled an interview (${interviewWhen(at)}) for`, `${target.name}: ${vacancy}`, `/admin/submissions/${id}`);
    revalidatePath("/admin", "layout");
    const emailNote = !input.email ? "" : interview.emailed ? " The invitation was emailed." : " The email couldn't be queued; check the address and tell them yourself.";
    return { ok: true, message: `Interview scheduled for ${interviewWhen(at)}.${emailNote}` };
  });
}

/** Remove a scheduled interview (the stage stays as it is). */
export async function cancelInterviewAction(id: string): Promise<RecruitmentResult> {
  return run(async () => {
    const user = await requireUser("submissions");
    const target = (await readStore("submissions")).find((s) => s.id === id);
    if (!target?.review?.interview) return { ok: false, error: "There's no interview to cancel." };
    await updateStore("submissions", (items) => ({
      items: items.map((s) => {
        if (s.id !== id || !s.review) return s;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { interview, ...review } = s.review;
        return { ...s, review: { ...review, updatedAt: new Date().toISOString(), updatedBy: user.name } };
      }),
    }));
    await logActivity(user, "cancelled the interview for", `${target.name}: ${target.fields.vacancy ?? ""}`, `/admin/submissions/${id}`);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Interview removed. If the candidate was told, let them know it's cancelled." };
  });
}
