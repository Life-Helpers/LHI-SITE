import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Our Strategies" };

export default function OurStrategiesPage() {
  return (
    <ComingSoon
      title="Our Strategies"
      note="LHI's strategic plan and approach are being written up for this page. In the meantime, see how the strategy plays out across our program areas."
      seeAlso={{ label: "See our programs", href: "/programs" }}
    />
  );
}
