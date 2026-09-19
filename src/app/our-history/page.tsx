import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Our History" };

export default function OurHistoryPage() {
  return (
    <ComingSoon
      title="Our History"
      note="A detailed timeline from LHI's 2004 founding as Beulah Projects to today is being written. For the short version, see About Us."
      seeAlso={{ label: "About Us", href: "/about" }}
    />
  );
}
