import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Newsletter" };

export default function NewsletterPage() {
  return (
    <ComingSoon
      title="Newsletter"
      note="A newsletter sign-up and archive will go here. There's no email list to subscribe to yet — nothing here would actually deliver a newsletter today."
    />
  );
}
