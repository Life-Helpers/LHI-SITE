import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Board of Trustees" };

export default function BoardOfTrusteesPage() {
  return (
    <ComingSoon
      title="Board of Trustees"
      note="Board member names and bios will be listed here once provided — we don't publish placeholder names for real people."
    />
  );
}
