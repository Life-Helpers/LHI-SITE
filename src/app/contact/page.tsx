import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Life Helpers Initiative.",
};

const channels = [
  { label: "General inquiries", email: siteConfig.contact.email },
  { label: "Feedback", email: siteConfig.contact.feedbackEmail },
  { label: "Recruitment", email: siteConfig.contact.recruitmentEmail },
];

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h1>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-start gap-3 rounded-md border border-border p-4">
            <MapPin
              className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">Headquarters</p>
              <p className="text-sm text-muted-foreground">
                {siteConfig.address.streetAddress}, {siteConfig.address.addressLocality},{" "}
                {siteConfig.address.addressRegion}, Nigeria ({siteConfig.address.postalCode})
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Plus an Abuja Liaison Office (FCT).
              </p>
            </div>
          </div>

          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex items-center gap-3 rounded-md border border-border p-4 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Phone className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium">Helpline / Feedback</p>
              <p className="text-sm text-primary">{siteConfig.contact.phoneDisplay}</p>
            </div>
          </a>
        </div>

        <ul className="mt-3 flex flex-col gap-3">
          {channels.map((channel) => (
            <li
              key={channel.label}
              className="flex items-center justify-between gap-4 rounded-md border border-border p-4"
            >
              <span className="font-medium">{channel.label}</span>
              <a
                href={`mailto:${channel.email}`}
                className="inline-flex items-center gap-1.5 rounded text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {channel.email}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
