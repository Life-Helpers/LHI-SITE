import type { Metadata } from "next";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { FaqAccordion } from "@/components/faq-accordion";
import { getFaqs } from "@/lib/cms/content";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { jsonLdScript } from "@/lib/validation";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "Frequently Asked Questions (FAQ)",
  description:
    "Find answers to frequently asked questions about Life Helpers Initiative (LHI), our health, education, and protection programs, governance, and donation processes.",
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Life Helpers Initiative",
    description:
      "Explore transparent answers on Life Helpers Initiative's organization, humanitarian programs, and donation handling.",
    images: [{ url: "/logo.png", width: 1533, height: 440, alt: "Life Helpers Initiative (LHI) Logo" }],
  },
};

/** Questions come from Admin → FAQs. */
export const revalidate = 300;

export default async function FaqPage() {
  const faqs = await getFaqs();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(faqSchema),
        }}
      />

      <PageHeroBanner
        eyebrow="Help & Knowledge Base"
        title="Frequently Asked Questions"
        subtitle="Transparent clarity on our organization, humanitarian interventions, and donation stewardship."
        description="Whether you are an institutional partner, prospective donor, community leader, or volunteer, find immediate answers to the most common inquiries regarding our work across Nigeria."
        image={{
          src: LHI_PHOTOS.communityDialogue.src,
          alt: LHI_PHOTOS.communityDialogue.alt,
          caption: "LHI field outreach and stakeholder engagement in Northern Nigeria",
          tag: "Transparency & Governance",
        }}
        align="split"
      />

      <div className="py-16 sm:py-24 bg-background">
        <FaqAccordion items={faqs} showHeading={false} />
      </div>
    </main>
  );
}
