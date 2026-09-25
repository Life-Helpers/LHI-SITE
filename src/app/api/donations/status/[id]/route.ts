import { NextRequest, NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";

/** Looks up a Stripe Checkout session. Anything that can't be confirmed with Stripe is reported as unconfirmed, never as paid. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^cs_(test_|live_)?[A-Za-z0-9]{10,}$/.test(id)) {
    return NextResponse.json({ error: "Unknown donation session." }, { status: 404 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json({
      id: session.id,
      amount: session.amount_total != null ? session.amount_total / 100 : null,
      currency: session.currency ?? "usd",
      kind: session.mode === "subscription" ? "monthly" : "one_time",
      payment_status: session.payment_status,
      status: session.status,
    });
  } catch (err) {
    const code = (err as { statusCode?: number }).statusCode;
    if (code === 404) return NextResponse.json({ error: "Unknown donation session." }, { status: 404 });
    console.error("Stripe session lookup failed", err);
    return NextResponse.json({ error: "Could not confirm the donation right now." }, { status: 502 });
  }
}
