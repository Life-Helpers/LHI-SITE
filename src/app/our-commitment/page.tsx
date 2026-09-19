import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Our Commitment" };

export default function OurCommitmentPage() {
  return (
    <ComingSoon
      title="Our Commitment"
      note="LHI's formal commitment statement — including safeguarding and accountability standards — is being finalized for this page."
      seeAlso={{ label: "About Us", href: "/about" }}
    />
  );
}
