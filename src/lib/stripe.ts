import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/** Throws a clear error at call time rather than crashing the whole app at import time. */
export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Payment processing is not configured in this environment.",
    );
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
}
