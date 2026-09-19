import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, User } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

export const metadata: Metadata = {
  title: "LHI Field Blog | Life Helpers Initiative",
  description:
    "Field reflections, humanitarian insights, and development research authored by Life Helpers Initiative technical advisors and community practitioners.",
};

const blogPosts = [
  {
    id: "tom-brown-nutrition",
    title: "The Tom Brown Revolution: Combating Child Malnutrition with Indigenous Nigerian Crops",
    author: "LHI MIYCN Nutrition Team",
    date: "February 2025",
    readTime: "5 min read",
    category: "Health & Nutrition",
    excerpt:
      "Rather than relying permanently on imported therapeutic foods, Life Helpers Initiative champions community-led Tom Brown formulation. Using locally farmed soybeans, guinea corn, and groundnuts, rural mothers are curing acute malnutrition in their own kitchens.",
  },
  {
    id: "reusable-pads-education",
    title: "Menstrual Dignity as Education Infrastructure: How NIDAKE Keeps Northern Girls in School",
    author: "Gender & Social Inclusion Directorate",
    date: "January 2025",
    readTime: "4 min read",
    category: "Education & NIDAKE",
    excerpt:
      "When a girl lacks sanitary items, she misses 20% of the school year. Our NIDAKE reusable pad social enterprise combines industrial tailoring skills for vulnerable women with dignified, year-long menstrual protection for adolescent learners.",
  },
  {
    id: "traditional-rulers-protection",
    title: "Community-Anchored Child Protection: Partnering with Traditional and Faith Leaders",
    author: "Child Protection Lead",
    date: "December 2024",
    readTime: "6 min read",
    category: "Child Protection",
    excerpt:
      "External edicts rarely change entrenched community norms. By seating village elders, imams, and pastors at the center of Child Protection Committees, LHI has cultivated a grassroots network that actively reports and halts abuse.",
  },
  {
    id: "vsla-financial-resilience",
    title: "The Architecture of Village Savings: Building Economic Shock-Absorbers for Displaced Women",
    author: "Livelihoods Specialist",
    date: "November 2024",
    readTime: "5 min read",
    category: "Livelihoods",
    excerpt:
      "A lockbox with three keys, a strict constitution, and peer accountability: how over 120 Village Savings and Loan Associations (VSLAs) established by LHI are allowing rural women to self-finance clinics, school uniforms, and farm inputs.",
  },
  {
    id: "psea-safeguarding-culture",
    title: "Safeguarding as an Institutional Lifestyle: Beyond Paper Compliance in Humanitarian Action",
    author: "LHI Internal Audit & Compliance Directorate",
    date: "October 2024",
    readTime: "4 min read",
    category: "PSEA & Ethics",
    excerpt:
      "Protection from Sexual Exploitation and Abuse (PSEA) cannot be a checkbox. At LHI, every volunteer, driver, director, and board trustee signs our binding Code of Conduct, backed by safe, community-accessible complaint mechanisms.",
  },
];

export default function BlogPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Practitioner Insights &amp; Field Dispatch"
        title={
          <>
            LHI <em className="font-light italic text-primary">Field Blog.</em>
          </>
        }
        subtitle="Stories of transformation, resilience, and fulfilled smiles from frontline communities."
        description="Read critical perspectives, operational lessons, and evidence-based field analyses directly from our frontline humanitarian specialists and community health champions across Nigeria."
        image={africanFulfillmentImages.blogHero}
      />

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
                    {post.category}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="mt-4 font-serif-display text-xl font-bold text-foreground sm:text-2xl">
                  {post.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <User size={12} className="text-primary" /> {post.author}
                  </span>
                  <Link
                    href="/contact"
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Discuss article <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 text-center sm:p-12">
            <BookOpen className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-3 font-serif-display text-2xl font-light text-foreground sm:text-3xl">
              Contribute or Inquire About Research
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Are you an academic researcher, monitoring specialist, or development partner interested in collaborating on field research?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Contact Research Team
              </Link>
              <Link
                href="/interventions/projectandintervention"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-widest text-foreground hover:bg-card"
              >
                All Projects &amp; Interventions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
