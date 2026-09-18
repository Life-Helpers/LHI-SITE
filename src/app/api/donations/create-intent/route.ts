import { NextResponse } from "next/server";
import { z } from "zod";

import { getStripe } from "@/lib/stripe";
import { donationSchema } from "@/lib/validations/donation";

const requestSchema = donationSchema.extend({
  /** Client-generated per-attempt key so retries/double-submits don't create duplicate charges. */
  idempotencyKey: z.string().min(1).max(255).optional(),
  /** Honeypot: hidden form field real users never fill. Non-empty means spam. */
  website: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid donation details." },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    // Honeypot tripped — respond like a normal validation failure rather
    // than tipping off the bot that it was specifically detected.
    return NextResponse.json(
      { error: "Invalid donation details." },
      { status: 400 },
    );
  }

  const { frequency, amount, donorName, donorEmail, message, idempotencyKey } =
    parsed.data;
  const amountInCents = Math.round(amount * 100);

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Payment processing is not configured in this environment." },
      { status: 503 },
    );
  }

  const metadata = {
    donorName,
    donorEmail,
    message: message?.slice(0, 500) ?? "",
    frequency,
  };

  try {
    if (frequency === "one_time") {
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: amountInCents,
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          receipt_email: donorEmail,
          metadata,
        },
        idempotencyKey ? { idempotencyKey } : undefined,
      );

      if (!paymentIntent.client_secret) {
        console.error("PaymentIntent created without a client secret", paymentIntent.id);
        return NextResponse.json(
          { error: "Could not start the payment. Please try again." },
          { status: 500 },
        );
      }

      return NextResponse.json({
        kind: "payment" as const,
        clientSecret: paymentIntent.client_secret,
      });
    }

    const productId = process.env.STRIPE_DONATION_PRODUCT_ID;
    if (!productId) {
      return NextResponse.json(
        { error: "Recurring donations are not configured in this environment." },
        { status: 503 },
      );
    }

    const existingCustomers = await stripe.customers.list({
      email: donorEmail,
      limit: 1,
    });
    const customer =
      existingCustomers.data[0] ??
      (await stripe.customers.create({
        name: donorName,
        email: donorEmail,
        metadata,
      }));

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: amountInCents,
      recurring: { interval: "month" },
      product: productId,
    });

    const subscription = await stripe.subscriptions.create(
      {
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        metadata,
        expand: ["latest_invoice"],
      },
      idempotencyKey ? { idempotencyKey } : undefined,
    );

    const invoice = subscription.latest_invoice;
    const clientSecret =
      invoice && typeof invoice !== "string"
        ? invoice.confirmation_secret?.client_secret
        : undefined;

    if (!clientSecret) {
      console.error(
        "Subscription created without a confirmation secret",
        subscription.id,
      );
      return NextResponse.json(
        { error: "Could not start the recurring donation. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      kind: "subscription" as const,
      clientSecret,
      subscriptionId: subscription.id,
    });
  } catch (err) {
    console.error("Stripe error creating donation intent", err);
    return NextResponse.json(
      { error: "Something went wrong starting the payment. Please try again." },
      { status: 500 },
    );
  }
}
