import { NextRequest, NextResponse } from "next/server";

import { addSubmission } from "@/lib/cms/submissions";
import { checkSpam } from "@/lib/spam";
import { consortiumEoiSchema } from "@/lib/validations/consortium-eoi";
import { formError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = consortiumEoiSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formError(parsed.error, "Invalid submission.") },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const spam = await checkSpam(req, { key: "eoi", max: 10, honeypot: (body as { website?: unknown } | null)?.website });
  if ("blocked" in spam) return spam.blocked;
  if ("drop" in spam) return NextResponse.json({ ok: true, reference: "RECEIVED", message: "Received." });
  const submission = await addSubmission({
    type: "consortium-eoi",
    name: d.contactName,
    email: d.email,
    organization: d.organization,
    subject: `${d.requestType}: ${d.agency}${d.opportunityRef ? ` (${d.opportunityRef})` : ""}`,
    fields: {
      requestType: d.requestType,
      organization: d.organization,
      contactName: d.contactName,
      email: d.email,
      phone: d.phone,
      fundingAgency: d.agency,
      opportunityReference: d.opportunityRef,
      deadline: d.deadline,
      targetStates: d.states,
      documentsRequested: d.documents,
      message: d.message,
    },
  });
  const reference = `LHI-EOI-${submission.id.slice(0, 8).toUpperCase()}`;

  return NextResponse.json({
    success: true,
    reference,
    message: "Thank you. Our partnerships team will respond within 48 working hours.",
  });
}
