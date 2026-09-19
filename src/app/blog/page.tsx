import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <ComingSoon
      title="Blog"
      note="No posts have been published yet — this section will list real field updates once written, not placeholder articles."
    />
  );
}
