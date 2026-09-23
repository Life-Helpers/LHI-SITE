import { NextRequest, NextResponse } from "next/server";

import { addSubmission } from "@/lib/cms/submissions";
import { consortiumEoiSchema } from "@/lib/validations/consortium-eoi";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = consortiumEoiSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 },
    );
  }

  const d = parsed.data;
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
