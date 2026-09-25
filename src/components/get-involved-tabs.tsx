"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteData } from "@/components/site-data-provider";
import type { SiteData } from "@/lib/site-data";

const buildTabs = (contact: SiteData["contact"]) => [
  {
    value: "donate",
    label: "01 Donate",
    heading: "Donate",
    body: "Support LHI's field programs directly. Donations are processed securely — card details never touch this site's servers.",
    cta: { label: "Go to donation form", href: "/donate", kind: "internal" as const },
  },
  {
    value: "volunteer",
    label: "02 Volunteer",
    heading: "Volunteer",
    body: "There's no online application form wired up yet — reach out directly and the team will follow up.",
    cta: {
      label: contact.email,
      href: `mailto:${contact.email}?subject=Volunteer%20Inquiry`,
      kind: "email" as const,
    },
  },
  {
    value: "partner",
    label: "03 Partner",
    heading: "Partner with us",
    body: "LHI works alongside multilateral and international partners across health, education, livelihoods, agriculture, and protection. To discuss a partnership, get in touch directly.",
    cta: {
      label: contact.email,
      href: `mailto:${contact.email}?subject=Partnership%20Inquiry`,
      kind: "email" as const,
    },
  },
  {
    value: "advocate",
    label: "04 Advocate",
    heading: "Advocate",
    body: "Help raise awareness of LHI's work in your own network, or connect us with people and organizations who can amplify it.",
    cta: {
      label: contact.email,
      href: `mailto:${contact.email}?subject=Advocacy%20Inquiry`,
      kind: "email" as const,
    },
  },
  {
    value: "career",
    label: "05 Career",
    heading: "Careers",
    body: "Open roles are posted as they become available. Send your CV and a note on the role you're interested in.",
    cta: {
      label: contact.recruitmentEmail,
      href: `mailto:${contact.recruitmentEmail}?subject=Job%20Application`,
      kind: "email" as const,
    },
  },
  {
    value: "course",
    label: "06 Course & Certificate",
    heading: "Do a course & get a certificate",
    body: "There's no online course platform live yet — this isn't a working enrollment form. Let us know what you're interested in and we'll follow up once one exists.",
    cta: {
      label: contact.email,
      href: `mailto:${contact.email}?subject=Course%20%26%20Certificate%20Inquiry`,
      kind: "email" as const,
    },
  },
];

export function GetInvolvedTabs() {
  const tabs = buildTabs(useSiteData().contact);
  return (
    <Tabs defaultValue="donate">
      <TabsList aria-label="Ways to get involved">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <h2 className="font-serif-display text-2xl font-light">{tab.heading}</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{tab.body}</p>
          <Button asChild size="lg" className="mt-6">
            {tab.cta.kind === "internal" ? (
              <Link href={tab.cta.href}>{tab.cta.label}</Link>
            ) : (
              <a href={tab.cta.href}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {tab.cta.label}
              </a>
            )}
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
}
