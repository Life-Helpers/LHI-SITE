import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Success Stories" };

export default function SuccessStoriesPage() {
  return (
    <ComingSoon
      title="Success Stories"
      note="Real beneficiary stories will be published here with consent — we don't fabricate testimonials."
    />
  );
}
