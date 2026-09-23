import { NextRequest, NextResponse } from "next/server";

import { getTender } from "@/lib/cms/content";
import { file, isEmail, text } from "@/lib/cms/form-data";
import { savePrivateUpload } from "@/lib/cms/private-uploads";
import { addSubmission, rateLimited } from "@/lib/cms/submissions";

export async function POST(req: NextRequest) {
  if (rateLimited(req, "tender", 10)) {
    return NextResponse.json({ error: "Too many submissions from this connection. Please try again later." }, { status: 429 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  if (text(form, "website")) return NextResponse.json({ ok: true });

  const found = await getTender(text(form, "tenderId", 120));
  if (!found) return NextResponse.json({ error: "This request no longer exists." }, { status: 404 });
  if (!found.open) return NextResponse.json({ error: "The deadline for this request has passed." }, { status: 410 });
  const { tender } = found;

  const company = text(form, "company", 200);
  const name = text(form, "name", 120);
  const email = text(form, "email", 200);
  const phone = text(form, "phone", 40);
  if (company.length < 2) return NextResponse.json({ error: "Enter your company's registered name." }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: "Enter a contact person." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (phone.length < 7) return NextResponse.json({ error: "Enter a phone number." }, { status: 400 });
  if (text(form, "declaration") !== "yes") {
    return NextResponse.json({ error: "Please accept the vendor code of conduct declaration." }, { status: 400 });
  }

  const bid = file(form, "bid");
  if (!bid) return NextResponse.json({ error: "Attach your quotation or bid document (PDF or Word, max 5 MB)." }, { status: 400 });
  const stored = await savePrivateUpload(bid, "tenders");
  if (typeof stored === "string") return NextResponse.json({ error: stored }, { status: 400 });

  await addSubmission({
    type: "tender-response",
    name,
    email,
    organization: company,
    subject: `Bid: ${tender.reference} ${tender.title}`,
    fields: {
      request: tender.title,
      reference: tender.reference,
      company,
      cacNumber: text(form, "cac", 60),
      phone,
      totalAmountNgn: text(form, "amount", 40),
      notes: text(form, "notes", 3000),
    },
    attachments: [stored],
  });

  return NextResponse.json({ ok: true });
}
