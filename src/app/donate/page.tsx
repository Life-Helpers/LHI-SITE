import { Suspense } from "react";
import type { Metadata } from "next";

import { DonateView } from "@/components/donate/donate-view";
import { getSettings } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Your donation directly supports emergency food assistance, clinical care, malnutrition stabilization, and child protection hubs across 11 frontline states.",
};

export default async function DonatePage() {
  const settings = await getSettings();
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center py-20 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <DonateView bankDetails={settings.donations.bankDetails} />
      </Suspense>
    </main>
  );
}
