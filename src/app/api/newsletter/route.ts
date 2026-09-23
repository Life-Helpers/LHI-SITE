import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { readStore } from "@/lib/cms/store";
import { addSubmission, rateLimited } from "@/lib/cms/submissions";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(200),
  name: z.string().trim().max(120).optional(),
  source: z.string().trim().max(60).optional(),
  website: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (rateLimited(req, "newsletter", 10)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }
  const { email, name, source, website } = parsed.data;
  if (website) return NextResponse.json({ ok: true });

  const already = (await readStore("submissions")).some((s) => s.type === "newsletter" && s.email === email);
  if (!already) {
    await addSubmission({
      type: "newsletter",
      name: name || email,
      email,
      subject: "Newsletter subscription",
      fields: { email, name: name ?? "", source: source ?? "website" },
    });
  }
  return NextResponse.json({ ok: true, already });
}
