"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";

function DonateSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Only Stripe's own answer decides what the donor sees: amounts are never taken from the URL.
  const [status, setStatus] = useState<"loading" | "paid" | "pending" | "error">(sessionId ? "loading" : "error");
  const [amount, setAmount] = useState<number | null>(null);
  const [currency, setCurrency] = useState("usd");
  const [kind, setKind] = useState<string | null>(null);
  const pollCountRef = useRef(0);

  useEffect(() => {
    if (!sessionId) return;

    let isCancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const checkStatus = async () => {
      pollCountRef.current += 1;
      try {
        const res = await fetch(`/api/donations/status/${encodeURIComponent(sessionId)}`);
        if (!res.ok) throw new Error("Status lookup failed");
        const data = await res.json();
        if (isCancelled) return;

        if (typeof data.amount === "number") setAmount(data.amount);
        if (typeof data.currency === "string") setCurrency(data.currency);
        if (data.kind) setKind(data.kind);

        if (data.payment_status === "paid" || data.payment_status === "no_payment_required") {
          setStatus("paid");
          return;
        }
        if (data.status === "expired") {
          setStatus("error");
          return;
        }
        if (pollCountRef.current >= 12) {
          setStatus("pending");
          return;
        }
        timer = setTimeout(checkStatus, 2000);
      } catch {
        if (!isCancelled) setStatus("error");
      }
    };

    checkStatus();

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [sessionId]);

  const formattedAmount =
    amount != null ? new Intl.NumberFormat("en-NG", { style: "currency", currency: currency.toUpperCase() }).format(amount) : null;

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[80vh] pt-36 pb-24 text-center md:pt-44 md:pb-32"
    >
      <div className="mx-auto max-w-[900px] px-8 sm:px-10 md:px-16 lg:px-20">
        {status === "loading" && (
          <div>
            <Loader2 size={40} className="mx-auto animate-spin text-primary" />
            <h1 className="font-serif-display mt-8 text-4xl text-foreground md:text-5xl">
              Confirming your gift…
            </h1>
            <p className="mt-4 text-muted-foreground">This may take a few seconds.</p>
          </div>
        )}

        {status === "paid" && (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>

            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              — Gift received
            </p>

            <h1 className="font-serif-display mt-4 text-5xl font-light leading-[1.02] text-foreground md:text-7xl">
              Thank you
              <br />
              <em className="font-light italic text-primary">from all of us.</em>
            </h1>

            {formattedAmount && (
              <p className="mt-8 text-lg text-muted-foreground">
                Your {kind === "monthly" ? "monthly recurring gift" : "gift"} of{" "}
                <span className="font-serif-display text-2xl font-medium text-primary">{formattedAmount}</span>
                {kind === "monthly" && (
                  <span className="text-lg font-medium text-primary"> / month</span>
                )}{" "}
                is now at work across our frontline missions in Nigeria.
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-all hover:bg-primary/90 shadow-md"
              >
                Back home <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center gap-3 rounded-full border border-border px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-foreground hover:border-primary/50 dark:border-border"
              >
                See the work <Sparkles size={14} className="text-accent" />
              </Link>
            </div>
          </div>
        )}

        {status === "pending" && (
          <div>
            <h1 className="font-serif-display text-4xl text-foreground md:text-5xl">
              Payment processing.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Your gift is being confirmed by the payment gateway. You will receive an official tax receipt at your email shortly. You can safely navigate away from this page.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-all hover:bg-primary/90"
              >
                Back home
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle size={32} className="text-destructive" />
            </div>
            <h1 className="font-serif-display mt-8 text-4xl text-foreground md:text-5xl">
              Unable to verify donation
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              We couldn&apos;t confirm this donation. If your card was charged, Stripe will email you a receipt, and you can contact us with any questions.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90"
              >
                Try again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
              >
                Return home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      }
    >
      <DonateSuccessContent />
    </Suspense>
  );
}
