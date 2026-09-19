import { NextRequest, NextResponse } from "next/server";

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

    // In a production backend, this would persist to a database or trigger an alert email to volunteer-desk@lhinigeria.org
    console.log("[VOLUNTEER APPLICATION RECEIVED]", {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "Not provided",
      interest: interest || "General volunteering",
      location: location || "All locations",
      availability: availability || "Flexible",
      message: message?.trim() || "",
      timestamp: new Date().toISOString(),
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
