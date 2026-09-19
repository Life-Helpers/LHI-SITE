import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Events & Updates" };

export default function EventsPage() {
  return (
    <ComingSoon
      title="Events & Updates"
      note="Upcoming and past events will be listed here once scheduled — we don't invent event dates."
    />
  );
}
