import type { DonationFormValues } from "@/lib/validations/donation";

export function ReviewStep({ values }: { values: DonationFormValues }) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(values.amount || 0);

  return (
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
  );
}
