import { NextRequest, NextResponse } from "next/server";

import { getJob } from "@/lib/cms/content";
import { file, isEmail, text } from "@/lib/cms/form-data";
import { savePrivateUpload } from "@/lib/cms/private-uploads";
import { addSubmission } from "@/lib/cms/submissions";
import { checkSpam } from "@/lib/spam";

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  const spam = await checkSpam(req, { key: "apply", max: 10, honeypot: text(form, "website"), token: text(form, "cf-turnstile-response", 4000) });
  if ("blocked" in spam) return spam.blocked;
  if ("drop" in spam) return NextResponse.json({ ok: true });

  const found = await getJob(text(form, "jobId", 120));
  if (!found) return NextResponse.json({ error: "This vacancy no longer exists." }, { status: 404 });
  if (!found.open) return NextResponse.json({ error: "Applications for this vacancy have closed." }, { status: 410 });
  const { job } = found;

  const name = text(form, "name", 120);
  const email = text(form, "email", 200);
  const phone = text(form, "phone", 40);
  if (name.length < 2) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (phone.length < 7) return NextResponse.json({ error: "Enter a phone number we can reach you on." }, { status: 400 });
  if (text(form, "safeguarding") !== "yes") {
    return NextResponse.json({ error: "Please confirm the safeguarding declaration." }, { status: 400 });
  }

  const cv = file(form, "cv");
  if (!cv) return NextResponse.json({ error: "Attach your CV (PDF or Word, max 5 MB)." }, { status: 400 });
  const stored = await savePrivateUpload(cv, "applications");
  if (typeof stored === "string") return NextResponse.json({ error: stored }, { status: 400 });

  await addSubmission({
    type: "job-application",
    name,
    email,
    subject: `Application: ${job.title}${job.reference ? ` (${job.reference})` : ""}`,
    fields: {
      vacancy: job.title,
      reference: job.reference,
      phone,
      currentLocation: text(form, "location", 120),
      yearsOfExperience: text(form, "experience", 20),
      highestQualification: text(form, "qualification", 200),
      coverLetter: text(form, "coverLetter", 5000),
    },
    attachments: [stored],
  });

  return NextResponse.json({ ok: true });
}
