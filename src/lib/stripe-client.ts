import type { Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Returns null (not a throw) when unconfigured, so callers can render an
 * honest "not set up" state. Uses a dynamic import so the @stripe/stripe-js
 * package — which injects a js.stripe.com script tag as an import-time side
 * effect — is never loaded at all when there's no key configured.
 */
export function getStripeClient(): Promise<Stripe | null> | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js").then(({ loadStripe }) =>
      loadStripe(key),
    );
  }
  return stripePromise;
}
