import type { Metadata } from "next";

import { GetInvolvedTabs } from "@/components/get-involved-tabs";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Donate, volunteer, partner, advocate, or work with LHI.",
};

export default function GetInvolvedPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get Involved
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          There are several ways to support LHI&apos;s work, beyond a
          one-time gift.
        </p>

        <div className="mt-10">
          <GetInvolvedTabs />
        </div>
      </div>
    </main>
  );
}
