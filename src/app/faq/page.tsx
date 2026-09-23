import type { Metadata } from "next";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { FaqAccordion } from "@/components/faq-accordion";
import { LHI_PHOTOS } from "@/data/lhi-photos";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Life Helpers Initiative",
  description:
    "Find answers to frequently asked questions about Life Helpers Initiative (LHI), our health, education, and protection programs, governance, and donation processes.",
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Life Helpers Initiative",
    description:
      "Explore transparent answers on Life Helpers Initiative's organization, humanitarian programs, and donation handling.",
  },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Life Helpers Initiative (LHI) and what is its mission?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Life Helpers Initiative (LHI) is an indigenous, non-governmental, non-profit organization established in Nigeria and incorporated with the Corporate Affairs Commission (CAC/IT/NO: 20121). LHI is dedicated to creating an inclusive, equitable society where children, adolescents, women, and marginalized populations have access to quality health, education, protection, resilient livelihoods, and rapid humanitarian relief.",
        },
      },
      {
        "@type": "Question",
        name: "Where is LHI headquartered and in which Nigerian states does it operate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LHI is headquartered in Sokoto State, Nigeria. We maintain active operational presences across Northern and North-Central Nigeria, including Sokoto, Kebbi, Zamfara, Katsina, Kano, Borno, and Abuja.",
        },
      },
      {
        "@type": "Question",
        name: "What are LHI's key core thematic programmatic areas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LHI focuses on five integrated thematic areas: Health & Nutrition, Education & Youth Development, Protection & Human Rights, Food Security & Resilient Livelihoods, and Humanitarian & Disaster Response.",
        },
      },
      {
        "@type": "Question",
        name: "What payment methods are accepted for online and offline donations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LHI accepts secure online card payments via Stripe (Visa, Mastercard, Verve, American Express), direct Nigerian Naira bank transfers, international domiciliary wires (USD, GBP, EUR), and automated recurring monthly giving.",
        },
      },
      {
        "@type": "Question",
        name: "How are donations utilized and what percentage goes directly to beneficiaries?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Over 88% of every donated sum directly funds frontline programmatic deliverables and relief supplies, while less than 12% is used for administrative governance, third-party audits, and compliance monitoring.",
        },
      },
    ],
  };

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
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
        <FaqAccordion showHeading={false} />
      </div>
    </main>
  );
}
