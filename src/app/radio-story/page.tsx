import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Radio Story" };

export default function RadioStoryPage() {
  return (
    <ComingSoon
      title="Radio Story"
      note="This section isn't defined yet. In the meantime, see Radio Advocacy for LHI's Women Situation Room program."
      seeAlso={{ label: "Radio Advocacy", href: "/radio" }}
    />
  );
}
