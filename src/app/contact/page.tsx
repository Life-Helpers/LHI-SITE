import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact/contact-page-client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Official contact locations, Google Maps, and communication channels for Life Helpers Initiative headquarters in Sokoto, Abuja Liaison Office, and field offices across Nigeria.",
};

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <ContactPageClient />
    </main>
  );
}
