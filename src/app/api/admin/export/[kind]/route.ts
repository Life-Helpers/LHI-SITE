import { COURSES } from "@/data/training/courses";
import { logActivity } from "@/lib/cms/activity";
import { getCurrentUser } from "@/lib/cms/auth";
import { toCsv } from "@/lib/cms/csv";
import { can, type Permission, SUBMISSION_TYPE_LABELS, type SubmissionType } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";
import { getSubscribers } from "@/lib/email/subscribers";

export const dynamic = "force-dynamic";

const PERMISSIONS: Record<string, Permission> = {
  subscribers: "newsletter",
  submissions: "submissions",
  learners: "training",
  certificates: "training",
};

/** CSV exports for the admin. GET /api/admin/export/{subscribers|submissions|learners|certificates}[?type=job-application] */
export async function GET(req: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const user = await getCurrentUser();
  const permission = PERMISSIONS[kind];
  if (!permission || !can(user, permission)) return new Response("Not found", { status: 404 });

  let csv: string;
  let label = kind;
  switch (kind) {
    case "subscribers": {
      const list = await getSubscribers();
      csv = toCsv(["Email", "Name", "Source", "Subscribed"], list.map((s) => [s.email, s.name, s.source, s.subscribedAt]));
      break;
    }
    case "submissions": {
      const type = new URL(req.url).searchParams.get("type") as SubmissionType | null;
      const items = (await readStore("submissions")).filter((s) => !type || s.type === type);
      if (type && SUBMISSION_TYPE_LABELS[type]) label = SUBMISSION_TYPE_LABELS[type].toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const fieldKeys = [...new Set(items.flatMap((s) => Object.keys(s.fields)))];
      csv = toCsv(
        ["Received", "Type", "Status", "Name", "Email", "Organisation", "Subject", ...fieldKeys, "Attachments"],
        items.map((s) => [
          s.createdAt,
          SUBMISSION_TYPE_LABELS[s.type] ?? s.type,
          s.status,
          s.name,
          s.email,
          s.organization,
          s.subject,
          ...fieldKeys.map((k) => s.fields[k]),
          (s.attachments ?? []).map((a) => a.filename).join("; "),
        ]),
      );
      break;
    }
    case "learners": {
      const learners = await readStore("learners");
      csv = toCsv(
        ["Name", "Email", "Organisation", "Joined", "Last sign-in", ...COURSES.flatMap((c) => [`${c.title}: lessons done`, `${c.title}: certificate`])],
        learners.map((l) => [
          l.name,
          l.email,
          l.organization,
          l.createdAt,
          l.lastLoginAt,
          ...COURSES.flatMap((c) => {
            const p = l.progress[c.id];
            return [`${p?.completed?.length ?? 0}/${c.lessons.length}`, p?.certificateId ?? ""];
          }),
        ]),
      );
      break;
    }
    case "certificates": {
      const certs = await readStore("certificates");
      csv = toCsv(
        ["Code", "Name", "Email", "Organisation", "Course", "Score", "Issued"],
        certs.map((c) => [c.id, c.name, c.email, c.organization, c.courseTitle, `${c.score}%`, c.issuedAt]),
      );
      break;
    }
    default:
      return new Response("Not found", { status: 404 });
  }

  await logActivity(user!, "exported", `${label} (CSV)`);
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lhi-${label}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
