import { NextRequest, NextResponse } from "next/server";

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

  const reference = `LHI-EOI-${Date.now().toString(36).toUpperCase()}`;

  // In production this should persist to the CRM and alert official@lhinigeria.org.
  console.log("[CONSORTIUM EOI RECEIVED]", {
    reference,
    ...parsed.data,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    reference,
    message: "Thank you. Our partnerships team will respond within 48 working hours.",
  });
}
