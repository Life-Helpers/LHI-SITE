"use client";

import { useEffect, useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { AlertCircle, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReviewStep } from "@/components/donation/review-step";
import { StripePaymentForm } from "@/components/donation/stripe-payment-form";
import { getStripeClient } from "@/lib/stripe-client";
import type { DonationFormValues } from "@/lib/validations/donation";

type IntentState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; clientSecret: string };

export function PaymentStep({ values }: { values: DonationFormValues }) {
  const stripePromise = getStripeClient();
  const [intent, setIntent] = useState<IntentState>({ status: "loading" });
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    if (!stripePromise) return;
    const controller = new AbortController();
    createIntent(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-fetching on every value change would spam the API on each keystroke; this step remounts fresh whenever the funnel returns to it, and retry calls createIntent directly.
  }, []);

  function createIntent(signal?: AbortSignal) {
    setIntent({ status: "loading" });

    fetch("/api/donations/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        idempotencyKey: idempotencyKeyRef.current,
      }),
      signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not start payment.");
        return data as { clientSecret: string };
      })
      .then((data) => {
        setIntent({ status: "ready", clientSecret: data.clientSecret });
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setIntent({ status: "error", message: err.message });
      });
  }

  const amountLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(values.amount || 0);

  return (
    <div className="flex flex-col gap-6">
      <ReviewStep values={values} />

      {!stripePromise ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border px-4 py-10 text-center text-muted-foreground">
          <CreditCard className="h-6 w-6" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            Payment processing isn&apos;t configured in this environment
          </p>
          <p className="max-w-sm text-sm">
            No Stripe publishable key is set. Once{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            </code>{" "}
            is configured, this step renders a real payment form.
          </p>
        </div>
      ) : intent.status === "loading" ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Preparing payment…
        </p>
      ) : intent.status === "error" ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-destructive/40 px-4 py-10 text-center">
          <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
          <p role="alert" className="text-sm text-destructive">
            {intent.message}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              idempotencyKeyRef.current = crypto.randomUUID();
              createIntent();
            }}
          >
            Try again
          </Button>
        </div>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: intent.clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#b3261e",
                borderRadius: "6px",
              },
            },
          }}
        >
          <StripePaymentForm
            clientSecret={intent.clientSecret}
            amountLabel={
              values.frequency === "monthly" ? `${amountLabel}/month` : amountLabel
            }
          />
        </Elements>
      )}
    </div>
  );
}
