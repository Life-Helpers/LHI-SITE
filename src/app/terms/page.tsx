import type { Metadata } from "next";
import Link from "next/link";

import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { siteConfig } from "@/config/site";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms governing use of the ${siteConfig.name} website, donations, training, careers and procurement.`,
};

// Drafted from how this website works. LHI's legal counsel should review it before launch.
const UPDATED = "23 September 2026";
const email = siteConfig.contact.email;

const sections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Using this website",
    body: (
      <p>
        This website is operated by {siteConfig.name} ({siteConfig.cacRegistration}). By using it you agree to these terms and to our{" "}
        <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the site.
      </p>
    ),
  },
  {
    id: "donations",
    title: "Donations",
    body: (
      <>
        <p>
          Donations are processed securely by our payment provider. Unless you choose a specific programme, gifts are used where they are needed
          most across LHI&apos;s work. Designated gifts are used for the chosen area; if that need is already met, we will apply the gift to a
          closely related purpose.
        </p>
        <p>
          Donations are generally non-refundable. If you believe a donation was made in error, contact <a href={`mailto:${email}`}>{email}</a> within
          14 days and we will review it.
        </p>
      </>
    ),
  },
  {
    id: "training",
    title: "Humanitarian Training and certificates",
    body: (
      <>
        <p>
          Training is free. You are responsible for keeping your account password confidential and for providing your real name, which appears on
          your certificate. Certificates are issued when you complete every lesson and score at least 80% on the final assessment.
        </p>
        <p>
          Certificates confirm completion of an LHI online course; they are not a professional licence. We may revoke a certificate obtained
          dishonestly. Anyone can verify a certificate code on the training page.
        </p>
      </>
    ),
  },
  {
    id: "careers-procurement",
    title: "Job applications and vendor submissions",
    body: (
      <>
        <p>
          LHI never charges fees at any stage of recruitment or procurement. Only applications and bids submitted through this website or an
          official LHI email are considered. Submitting an application or bid does not create any obligation on LHI to employ or contract.
        </p>
        <p>
          Applicants and vendors confirm that the information they provide is true, and vendors agree to uphold LHI&apos;s safeguarding, anti-fraud
          and anti-corruption requirements.
        </p>
      </>
    ),
  },
  {
    id: "user-content",
    title: "Comments and other content you submit",
    body: (
      <>
        <p>Comments are moderated. Please be respectful. We will not publish, and may remove, content that:</p>
        <ul>
          <li>is abusive, discriminatory, threatening or harassing;</li>
          <li>identifies survivors, children or other vulnerable people;</li>
          <li>is spam, advertising or unlawful.</li>
        </ul>
        <p>By submitting content you allow LHI to display it on this website.</p>
      </>
    ),
  },
  {
    id: "our-content",
    title: "Our content",
    body: (
      <p>
        Text, photographs, magazines, reports and course materials on this site belong to LHI or its partners. You may share links and quote short
        extracts with credit to {siteConfig.name}. Please ask before reusing photographs, especially of people, as they are published under our
        safeguarding and consent standards.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Accuracy, availability and links",
    body: (
      <p>
        We work to keep information accurate, but figures and programme details change as our work evolves. The website is provided &ldquo;as
        is&rdquo; and may occasionally be unavailable. Links to other websites are provided for convenience; we are not responsible for their
        content.
      </p>
    ),
  },
  {
    id: "safeguarding",
    title: "Safeguarding",
    body: (
      <p>
        LHI has zero tolerance for sexual exploitation, abuse and harassment. To report a concern confidentially, email{" "}
        <a href={`mailto:${siteConfig.contact.pseaEmail}`}>{siteConfig.contact.pseaEmail}</a> or call the feedback line{" "}
        {siteConfig.contact.feedbackLine}.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and changes",
    body: (
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria. We may update them from time to time; the date at the top shows
        the latest version. Questions: <a href={`mailto:${email}`}>{email}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <PageHeroBanner
        eyebrow="— Terms of Service"
        title={
          <>
            Terms of <em className="font-light italic text-primary">Service.</em>
          </>
        }
        subtitle="The rules for using our website and services."
        description="Donations, training, careers, procurement and community participation."
        image={africanFulfillmentImages.commitmentHero}
      />
      <LegalDocument
        title="Terms of Service"
        updated={UPDATED}
        intro={<p>Please read these terms before donating, creating a training account, applying for a job, submitting a bid or commenting.</p>}
        sections={sections}
      />
    </main>
  );
}
