"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";

export function StripePaymentForm({
  clientSecret,
  amountLabel,
}: {
  clientSecret: string;
  amountLabel: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/success`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setErrorMessage(
        result.error.message ?? "Your payment could not be processed.",
      );
      setSubmitting(false);
      return;
    }

    // No redirect was needed (most card payments resolve inline) — route to
    // the same success page a redirect-based method would land on, so there
    // is one place that reports the outcome.
    const params = new URLSearchParams({
      payment_intent: result.paymentIntent.id,
      payment_intent_client_secret: clientSecret,
    });
    router.push(`/donate/success?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />

      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" disabled={!stripe || submitting}>
        {submitting ? "Processing…" : `Donate ${amountLabel}`}
      </Button>
    </form>
  );
}
