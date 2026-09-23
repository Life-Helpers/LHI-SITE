import { NextRequest, NextResponse } from "next/server";

import { addSubmission } from "@/lib/cms/submissions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, interest, location, availability, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
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
        name: name.trim(),
        email: email.trim(),
        phone: typeof phone === "string" ? phone.trim() : "",
        interest: interest || "General volunteering",
        location: location || "All locations",
        availability: availability || "Flexible",
        message: typeof message === "string" ? message.trim() : "",
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
