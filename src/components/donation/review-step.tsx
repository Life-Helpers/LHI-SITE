import { CreditCard } from "lucide-react";

import type { DonationFormValues } from "@/lib/validations/donation";

export function ReviewStep({ values }: { values: DonationFormValues }) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(values.amount || 0);

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md border border-border bg-muted/40 p-4 text-sm">
        <dt className="text-muted-foreground">Amount</dt>
        <dd className="font-medium">
          {amount} {values.frequency === "monthly" && "/ month"}
        </dd>

        <dt className="text-muted-foreground">Donor</dt>
        <dd className="font-medium">{values.donorName}</dd>

        <dt className="text-muted-foreground">Email</dt>
        <dd className="font-medium">{values.donorEmail}</dd>

        {values.message && (
          <>
            <dt className="text-muted-foreground">Message</dt>
            <dd className="font-medium">{values.message}</dd>
          </>
        )}
      </dl>

      <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border px-4 py-10 text-center text-muted-foreground">
        <CreditCard className="h-6 w-6" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">
          Payment step not connected yet
        </p>
        <p className="max-w-sm text-sm">
          This is where a payment provider (Stripe or PayPal) integrates.
          Card details are never collected or stored by this site directly —
          that step is handled entirely by the provider&apos;s embedded
          widget once it&apos;s wired up.
        </p>
      </div>
    </div>
  );
}
