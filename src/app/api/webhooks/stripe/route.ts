import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { addSubmission } from "@/lib/cms/submissions";
import { readStore } from "@/lib/cms/store";
import { getStripe } from "@/lib/stripe";

function formatAmount(minor: number | null, currency: string | null) {
  if (minor == null) return "an unknown amount";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: (currency ?? "usd").toUpperCase() }).format(minor / 100);
}

/** Record a completed Checkout session in Admin → Submissions → Donations. */
async function recordDonation(session: Stripe.Checkout.Session) {
  // Stripe can deliver the same event more than once.
  const existing = await readStore("submissions");
  if (existing.some((s) => s.type === "donation" && s.fields.stripeSession === session.id)) return;
  const email = session.customer_details?.email ?? session.customer_email ?? session.metadata?.donor_email ?? "";
  const name = session.metadata?.donor_name || session.customer_details?.name || "Anonymous";
  const amount = formatAmount(session.amount_total, session.currency);
  const frequency = session.mode === "subscription" ? "monthly" : "one_time";
  await addSubmission({
    type: "donation",
    name,
    email,
    subject: `${frequency === "monthly" ? "Monthly gift" : "Gift"} of ${amount}`,
    fields: {
      amount,
      frequency,
      designation: session.metadata?.designation,
      package: session.metadata?.package_id,
      paymentStatus: session.payment_status,
      stripeSession: session.id,
      stripeSubscription: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
    },
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured in this environment." }, { status: 503 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        // Card payments arrive paid; delayed methods are recorded when they succeed.
        if (session.payment_status === "paid" || event.type === "checkout.session.async_payment_succeeded") {
          await recordDonation(session);
        }
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object;
        // The first invoice of a subscription is already recorded by checkout.session.completed.
        if (invoice.billing_reason === "subscription_cycle") {
          await addSubmission({
            type: "donation",
            name: invoice.customer_name || "Monthly donor",
            email: invoice.customer_email ?? "",
            subject: `Monthly gift of ${formatAmount(invoice.amount_paid, invoice.currency)} (renewal)`,
            fields: { amount: formatAmount(invoice.amount_paid, invoice.currency), frequency: "monthly", stripeInvoice: invoice.id },
          });
        }
        break;
      }
      case "checkout.session.async_payment_failed":
        console.warn("Donation payment failed", event.data.object.id);
        break;
      default:
        break;
    }
  } catch (err) {
    // Tell Stripe to retry later rather than losing the record.
    console.error("Could not record donation", err);
    return NextResponse.json({ error: "Could not record the donation." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
