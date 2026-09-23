import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { addSubmission } from "@/lib/cms/submissions";

const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional(),
  department: z.string().trim().max(120),
  officeLocation: z.string().trim().max(120),
  message: z.string().trim().min(5, "Please enter a message.").max(5000),
});

export async function POST(req: NextRequest) {
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid submission." }, { status: 400 });
  }
  const d = parsed.data;
  await addSubmission({
    type: "contact",
    name: d.fullName,
    email: d.email,
    subject: `${d.department} (${d.officeLocation})`,
    fields: { ...d },
  });
  return NextResponse.json({ success: true });
}
