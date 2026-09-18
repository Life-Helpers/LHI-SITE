"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Stripe } from "@stripe/stripe-js";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getStripeClient } from "@/lib/stripe-client";

type Outcome =
  | { state: "checking" }
  | { state: "empty" }
  | { state: "succeeded" }
  | { state: "processing" }
  | { state: "failed"; message: string };

function DonateSuccessContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("payment_intent_client_secret");
  const [outcome, setOutcome] = useState<Outcome>({ state: "checking" });

  useEffect(() => {
    if (!clientSecret) {
      setOutcome({ state: "empty" });
      return;
    }

    const stripePromise = getStripeClient();
    if (!stripePromise) {
      setOutcome({ state: "empty" });
      return;
    }

    let cancelled = false;
    stripePromise.then((stripe: Stripe | null) => {
      if (!stripe) return;
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (cancelled) return;
        switch (paymentIntent?.status) {
          case "succeeded":
            setOutcome({ state: "succeeded" });
            break;
          case "processing":
            setOutcome({ state: "processing" });
            break;
          default:
            setOutcome({
              state: "failed",
              message:
                "This payment didn't go through. No charge was made — please try again.",
            });
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [clientSecret]);

  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            {outcome.state === "checking" && (
              <p className="text-muted-foreground">Checking your donation…</p>
            )}

            {outcome.state === "succeeded" && (
              <>
                <CheckCircle2
                  className="h-10 w-10 text-primary"
                  aria-hidden="true"
                />
                <h1 className="text-2xl font-bold tracking-tight">
                  Thank you for your donation
                </h1>
                <p className="text-muted-foreground">
                  A receipt has been sent to your email.
                </p>
              </>
            )}

            {outcome.state === "processing" && (
              <>
                <Clock className="h-10 w-10 text-accent" aria-hidden="true" />
                <h1 className="text-2xl font-bold tracking-tight">
                  Your donation is processing
                </h1>
                <p className="text-muted-foreground">
                  We&apos;ll email you a confirmation once it clears.
                </p>
              </>
            )}

            {outcome.state === "failed" && (
              <>
                <XCircle
                  className="h-10 w-10 text-destructive"
                  aria-hidden="true"
                />
                <h1 className="text-2xl font-bold tracking-tight">
                  Payment not completed
                </h1>
                <p role="alert" className="text-muted-foreground">
                  {outcome.message}
                </p>
              </>
            )}

            {outcome.state === "empty" && (
              <>
                <h1 className="text-2xl font-bold tracking-tight">
                  No donation to confirm
                </h1>
                <p className="text-muted-foreground">
                  This page confirms a donation right after checkout. If
                  you&apos;re trying to give, start below.
                </p>
              </>
            )}

            <Button asChild className="mt-2">
              <Link href={outcome.state === "succeeded" ? "/" : "/donate"}>
                {outcome.state === "succeeded" ? "Back to home" : "Go to donate"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center py-16 text-muted-foreground">
          Loading…
        </main>
      }
    >
      <DonateSuccessContent />
    </Suspense>
  );
}
