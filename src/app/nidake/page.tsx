import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "NIDAKE" };

export default function NidakePage() {
  return (
    <ComingSoon
      title="NIDAKE"
      note="Details on this initiative are being prepared for this page."
    />
  );
}
