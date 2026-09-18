import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook is not configured in this environment." },
      { status: 503 },
    );
  }

  const payload = await request.text();

  let stripe;
  let event;
  try {
    stripe = getStripe();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // No database/CRM exists in this environment yet. Persisting the donation
  // record and sending a receipt belongs here once one does — this only
  // acknowledges receipt so Stripe doesn't retry indefinitely.
  switch (event.type) {
    case "payment_intent.succeeded": {
      const intent = event.data.object;
      console.log("Donation payment succeeded", intent.id, intent.amount);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      console.log("Recurring donation invoice paid", invoice.id, invoice.amount_paid);
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      console.warn(
        "Donation payment failed",
        intent.id,
        intent.last_payment_error?.message,
      );
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
