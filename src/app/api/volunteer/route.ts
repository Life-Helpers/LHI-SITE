import { NextRequest, NextResponse } from "next/server";

import { addSubmission } from "@/lib/cms/submissions";
import { checkSpam } from "@/lib/spam";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, interest, location, availability, message, website } = body;
    const spam = await checkSpam(req, { key: "volunteer", max: 10, honeypot: website });
    if ("blocked" in spam) return spam.blocked;
    if ("drop" in spam) return NextResponse.json({ success: true });

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    await addSubmission({
      type: "volunteer",
      name: name.trim(),
      email: email.trim(),
      subject: `Volunteer application: ${interest || "General volunteering"}`,
      fields: {
        name: name.trim().slice(0, 120),
        email: email.trim().slice(0, 200),
        phone: typeof phone === "string" ? phone.trim().slice(0, 40) : "",
        interest: String(interest || "General volunteering").slice(0, 120),
        location: String(location || "All locations").slice(0, 120),
        availability: String(availability || "Flexible").slice(0, 120),
        message: typeof message === "string" ? message.trim().slice(0, 3000) : "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application received. Our volunteer coordinator will reach out soon.",
    });
  } catch (error) {
    console.error("Error processing volunteer application:", error);
    return NextResponse.json(
      { error: "Failed to process application. Please try again." },
      { status: 500 }
    );
  }
}
