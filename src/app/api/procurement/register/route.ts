import { NextRequest, NextResponse } from "next/server";

import { file, isEmail, text } from "@/lib/cms/form-data";
import { savePrivateUpload } from "@/lib/cms/private-uploads";
import { addSubmission, rateLimited } from "@/lib/cms/submissions";

export async function POST(req: NextRequest) {
  if (rateLimited(req, "vendor", 5)) {
    return NextResponse.json({ error: "Too many submissions from this connection. Please try again later." }, { status: 429 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  if (text(form, "website")) return NextResponse.json({ ok: true });

  const company = text(form, "company", 200);
  const name = text(form, "name", 120);
  const email = text(form, "email", 200);
  const phone = text(form, "phone", 40);
  const categories = form.getAll("categories").filter((v): v is string => typeof v === "string").slice(0, 10);
  if (company.length < 2) return NextResponse.json({ error: "Enter your company's registered name." }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: "Enter a contact person." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (phone.length < 7) return NextResponse.json({ error: "Enter a phone number." }, { status: 400 });
  if (categories.length === 0) return NextResponse.json({ error: "Choose at least one supply category." }, { status: 400 });
  if (text(form, "declaration") !== "yes") {
    return NextResponse.json({ error: "Please accept the vendor code of conduct declaration." }, { status: 400 });
  }

  const profile = file(form, "profile");
  const attachments = [];
  if (profile) {
    const stored = await savePrivateUpload(profile, "vendors");
    if (typeof stored === "string") return NextResponse.json({ error: stored }, { status: 400 });
    attachments.push(stored);
  }

  await addSubmission({
    type: "vendor-registration",
    name,
    email,
    organization: company,
    subject: `Vendor registration: ${company}`,
    fields: {
      company,
      cacNumber: text(form, "cac", 60),
      tin: text(form, "tin", 60),
      phone,
      address: text(form, "address", 300),
      statesServed: text(form, "states", 300),
      categories: categories.join(", "),
      description: text(form, "description", 2000),
    },
    attachments,
  });

  return NextResponse.json({ ok: true });
}
