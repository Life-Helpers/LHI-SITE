import type { Metadata } from "next";

import { DonationFunnel } from "@/components/donation/donation-funnel";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Life Helpers Initiative's crisis response and field programs.",
};

export default function DonatePage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <DonationFunnel />
      </div>
    </main>
  );
}
