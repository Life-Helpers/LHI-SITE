import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Management Team" };

export default function ManagementTeamPage() {
  return (
    <ComingSoon
      title="Management Team"
      note="Staff names and roles will be listed here once provided — we don't publish placeholder names for real people."
    />
  );
}
