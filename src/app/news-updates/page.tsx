import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/news/newsletter-form";
import { ArrowRight, Calendar, Mail, Tag } from "lucide-react";

import { PageHeroBanner } from "@/components/ui/page-hero-banner";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";
import { BlogFeed } from "@/components/blog/blog-feed";
import { getPublishedPosts } from "@/lib/cms/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "News & Updates | Life Helpers Initiative",
  description:
    "Latest field updates, press releases, community milestones, and humanitarian newsletters from Life Helpers Initiative across Nigeria.",
};

const articles = [
  {
    id: "world-breastfeeding-week",
    title: "World Breastfeeding Week: Scaling Community Infant & Young Child Nutrition in Rural Wards",
    date: "August 2024",
    category: "Health & Nutrition",
    summary:
      "LHI field teams across Sokoto, Kebbi, and Zamfara mobilized over 4,500 nursing mothers during World Breastfeeding Week, offering hands-on counseling on exclusive breastfeeding, early initiation, and locally formulated complementary feeding (Tom Brown).",
  },
  {
    id: "world-food-day-climate",
    title: "World Food Day: Equipping 1,200 Smallholder Farmers with Drought-Resilient Seed Varieties",
    date: "October 2024",
    category: "Food Security & Agriculture",
    summary:
      "In commemoration of World Food Day, LHI distributed certified climate-adaptive millet and sorghum seeds alongside bio-fertilizers to peasant farmer cooperatives in Yobe and Borno states to counteract irregular rainfall cycles.",
  },
  {
    id: "16-days-activism-gbv",
    title: "16 Days of Activism: Amplifying Survivor Voices and PSEA Accountability Across 11 States",
    date: "November 2024",
    category: "Gender & Inclusion",
    summary:
      "Through radio townhalls, community drama troupes, and stakeholder roundtables with traditional rulers, LHI reinforced community zero-tolerance against gender-based violence and expanded anonymous reporting channels.",
  },
  {
    id: "katsina-expansion-launch",
    title: "LHI Expands Health and Protection Interventions to Katsina State",
    date: "January 2025",
    category: "Institutional Growth",
    summary:
      "Marking its 11th operational state, Life Helpers Initiative officially launched maternal and adolescent healthcare support services in vulnerable local government areas in Katsina State in partnership with state health authorities.",
  },
  {
    id: "national-savings-conference",
    title: "Showcasing Community Financial Inclusion at the National Savings Group Conference",
    date: "March 2025",
    category: "Livelihoods",
    summary:
      "LHI presented empirical data demonstrating the self-sustaining impact of over 120 Village Savings and Loan Associations (VSLAs) in conflict-recovering communities, highlighting women's financial autonomy and credit reliability.",
  },
];

export default async function NewsUpdatesPage() {
  const cmsPosts = (await getPublishedPosts()).filter((p) => ["News", "Press Release", "Magazine", "Events"].includes(p.category));
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      {/* Hero with African Fulfillment Demo Image */}
      <PageHeroBanner
        eyebrow="— Bulletins & Field Dispatches"
        title={
          <>
            News &amp; <em className="font-light italic text-primary">Updates.</em>
          </>
        }
        subtitle="Putting a smile on communities across Nigeria: real milestones, stories, and dispatches."
        description="Stay informed on frontline developments, community milestones, emergency responses, capacity-building workshops, and policy dialogues from Life Helpers Initiative across 11 states."
        image={africanFulfillmentImages.newsHero}
      />

      {cmsPosts.length > 0 && (
        <section aria-labelledby="cms-posts-heading" className="border-b border-border py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 id="cms-posts-heading" className="mb-8 font-serif-display text-3xl font-light text-foreground">
              Latest news & magazine
            </h2>
            <BlogFeed posts={cmsPosts} />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Articles List (8 cols) */}
            <div className="space-y-8 lg:col-span-8">
              {articles.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Calendar size={13} className="text-primary" />
                      {item.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-accent">
                      <Tag size={11} />
                      {item.category}
                    </span>
                  </div>

                  <h2 className="mt-3 font-serif-display text-xl font-bold text-foreground sm:text-2xl">
                    {item.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>

                  <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Life Helpers Initiative Dispatch</span>
                    <Link
                      href="/contact"
                      className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Media Inquiries <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Newsletter Subscription Sidebar (4 cols) */}
            <div className="space-y-6 lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Mail size={20} />
                  </div>
                  <h3 className="mt-4 font-serif-display text-xl font-bold text-foreground">
                    Subscribe to our Bulletin
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Receive quarterly reports, success stories, and emergency relief updates directly in your inbox.
                  </p>

                  <NewsletterForm />
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Key Publications
                  </h4>
                  <ul className="mt-4 space-y-3 text-xs">
                    <li>
                      <Link href="/impact" className="text-primary hover:underline font-medium">
                        → LHI Annual Impact &amp; Accountability Report
                      </Link>
                    </li>
                    <li>
                      <Link href="/our-commitment" className="text-primary hover:underline font-medium">
                        → Safeguarding &amp; PSEA Code of Conduct
                      </Link>
                    </li>
                    <li>
                      <Link href="/radio" className="text-primary hover:underline font-medium">
                        → Women Situation Room Broadcast Schedule
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
