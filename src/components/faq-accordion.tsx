"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  Building2,
  HeartHandshake,
  CreditCard,
  HelpCircle,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react";

export type FaqCategory = "all" | "organization" | "programs" | "donations";

export interface FaqItem {
  id: string;
  category: "organization" | "programs" | "donations";
  question: string;
  answer: string;
  tags?: string[];
  featured?: boolean;
}

const FAQ_DATA: FaqItem[] = [
  // 1. ORGANIZATION
  {
    id: "org-1",
    category: "organization",
    question: "What is Life Helpers Initiative (LHI) and what is its mission?",
    answer:
      "Life Helpers Initiative (LHI) is an indigenous, non-governmental, non-profit organization established in Nigeria and incorporated with the Corporate Affairs Commission (CAC/IT/NO: 20121). LHI is dedicated to creating an inclusive, equitable society where children, adolescents, women, and marginalized populations have access to quality health, education, protection, resilient livelihoods, and rapid humanitarian relief.",
    tags: ["mission", "about", "registration", "mandate"],
    featured: true,
  },
  {
    id: "org-2",
    category: "organization",
    question: "Where is LHI headquartered and in which Nigerian states does it operate?",
    answer:
      "LHI is headquartered in Sokoto State, Nigeria (Plot 18, Block B, Commercial Layout, Off Gusau Road, Sokoto). We maintain active operational presences, field coordinators, and technical teams across Northern and North-Central Nigeria, including Sokoto, Kebbi, Zamfara, Katsina, Kano, Borno, and the Federal Capital Territory (Abuja).",
    tags: ["headquarters", "sokoto", "locations", "coverage"],
    featured: true,
  },
  {
    id: "org-3",
    category: "organization",
    question: "Is Life Helpers Initiative legally registered and compliant with Nigerian regulators?",
    answer:
      "Yes. LHI is fully compliant with all statutory regulations in Nigeria. We are registered with the Corporate Affairs Commission (CAC), the Special Control Unit Against Money Laundering (SCUML / EFCC), the Federal Inland Revenue Service (FIRS), and collaborate directly with Federal and State Ministries of Budget, Planning, and Humanitarian Affairs.",
    tags: ["cac", "legal", "scuml", "compliance"],
  },
  {
    id: "org-4",
    category: "organization",
    question: "How is LHI governed and are your financial audits publicly accessible?",
    answer:
      "LHI is guided by an independent Board of Trustees composed of accomplished leaders in public health, law, developmental economics, and civil society. Our governance structure enforces strict internal controls, conflict of interest safeguards, and anti-fraud protocols. Our accounts are audited annually by accredited external certified auditing firms and shared with our institutional partners.",
    tags: ["governance", "board", "audit", "accountability"],
  },
  {
    id: "org-5",
    category: "organization",
    question: "What safeguarding and ethical standards does LHI enforce?",
    answer:
      "LHI operates under a strict Zero Tolerance Policy toward Sexual Exploitation, Abuse, and Harassment (PSEAH), child abuse, and financial impropriety. All staff members, volunteers, community mobilizers, and contractors undergo mandatory background checks, safeguarding inductions, and sign our strict Code of Conduct.",
    tags: ["safeguarding", "psea", "ethics", "child-protection"],
  },

  // 2. PROGRAMS & OPERATIONS
  {
    id: "prog-1",
    category: "programs",
    question: "What are LHI's key core thematic programmatic areas?",
    answer:
      "LHI focuses on five integrated thematic areas:\n1. Health & Nutrition: Maternal and child health, immunization drives, adolescent reproductive health, and community malnutrition management.\n2. Education & Youth Development: Safe school initiatives, girl-child enrollment and retention, literacy hubs, and remedial learning.\n3. Protection & Human Rights: Prevention and response to Gender-Based Violence (GBV), survivor psychosocial counseling, and legal support.\n4. Food Security & Resilient Livelihoods: Climate-smart agriculture, women economic collectives, vocational training, and village savings schemes.\n5. Humanitarian & Disaster Response: Rapid relief delivery to displaced persons, emergency water sanitation, and crisis relief.",
    tags: ["pillars", "thematic", "health", "education", "protection", "livelihoods"],
    featured: true,
  },
  {
    id: "prog-2",
    category: "programs",
    question: "What is the NIDAKE Pad Social Enterprise?",
    answer:
      "NIDAKE is an award-winning social enterprise initiative spearheaded by Life Helpers Initiative. It produces high-quality, eco-friendly, and affordable sanitary pads locally. NIDAKE breaks the barriers of menstrual poverty that cause adolescent girls to miss school, equips schools with dignity kits, and creates dignified manufacturing and distribution jobs for local women.",
    tags: ["nidake", "menstrual-health", "sanitary-pads", "girls", "enterprise"],
    featured: true,
  },
  {
    id: "prog-3",
    category: "programs",
    question: "How does LHI ensure community ownership and cultural sensitivity?",
    answer:
      "Every LHI program follows a participatory, community-led model. We establish close working partnerships with traditional emirs, village heads, religious scholars, women leaders, and youth groups. Before any project launch, extensive community town halls and barrier-analysis dialogues ensure solutions are culturally respectful, community-owned, and enduring.",
    tags: ["community", "traditional-leaders", "sustainability", "co-design"],
  },
  {
    id: "prog-4",
    category: "programs",
    question: "How does LHI respond to rapid humanitarian emergencies and IDP crises?",
    answer:
      "LHI maintains dedicated contingency response teams and rapid deployment protocols. During climate disasters such as seasonal flooding or security displacements, our field coordinators deliver life-saving emergency food baskets, dignity kits, temporary shelter materials, and clean water within 48 to 72 hours, working hand-in-hand with NEMA, SEMA, and UN clusters.",
    tags: ["humanitarian", "emergency", "idp", "flooding", "relief"],
  },
  {
    id: "prog-5",
    category: "programs",
    question: "How can other organizations, agencies, or corporations partner with LHI?",
    answer:
      "LHI actively collaborates with United Nations agencies (UNICEF, UNFPA, WHO), bilateral donors, international NGOs, federal/state ministries, and corporate CSR foundations. We welcome technical consortiums, joint proposal co-creation, and localized implementation partnerships. Please visit our 'Get Involved' page or reach out to partnerships@lifehelpers.org.",
    tags: ["partnerships", "un-agencies", "csr", "collaboration"],
  },

  // 3. DONATIONS & FINANCIAL TRANSPARENCY
  {
    id: "don-1",
    category: "donations",
    question: "How are donations utilized and what percentage goes directly to beneficiaries?",
    answer:
      "Financial integrity and efficiency are core to our mission. Over 88% of every donated sum directly funds frontline programmatic deliverables—including medical supplies, school retention kits, nutrition packets, and community micro-grants. Less than 12% is used for administrative governance, third-party audits, and compliance monitoring.",
    tags: ["transparency", "allocation", "percentages", "stewardship"],
    featured: true,
  },
  {
    id: "don-2",
    category: "donations",
    question: "What payment methods are accepted for online and offline donations?",
    answer:
      "We offer multiple convenient and secure donation channels:\n1. Secure Online Card Payments: Powered by Stripe, accepting Visa, Mastercard, Verve, and American Express with 256-bit SSL encryption.\n2. Direct Bank Transfers: Dedicated bank accounts for domestic Nigerian Naira (NGN) transfers and domiciliary accounts for international wires (USD, GBP, EUR).\n3. Recurring Monthly Contributions: Automated recurring donations that can be modified or canceled anytime.",
    tags: ["payment-methods", "stripe", "cards", "bank-transfer"],
    featured: true,
  },
  {
    id: "don-3",
    category: "donations",
    question: "Can I donate in foreign currencies (USD, GBP, EUR) as well as Nigerian Naira (NGN)?",
    answer:
      "Yes. Our donation platform supports multi-currency transactions. You can select Nigerian Naira (NGN), US Dollars (USD), British Pounds (GBP), or Euros (EUR). The platform automatically converts and processes your transaction securely using real-time competitive exchange rates.",
    tags: ["currencies", "naira", "usd", "gbp", "eur", "international"],
  },
  {
    id: "don-4",
    category: "donations",
    question: "Will I receive a donation receipt and tax acknowledgment?",
    answer:
      "Yes. Immediately after a successful online contribution, an official digital receipt is automatically generated and emailed to you. For bank wire transfers, our finance desk issues an official signed acknowledgment letter and receipt within 24 to 48 hours of confirmation.",
    tags: ["receipt", "tax", "acknowledgment", "documentation"],
  },
  {
    id: "don-5",
    category: "donations",
    question: "Can I designate my donation to a specific cause or emergency appeal?",
    answer:
      "Yes. When donating, you can select specific allocations such as 'Where Needed Most', 'Health & Nutrition', 'Girl-Child Education', 'NIDAKE Menstrual Hygiene Kits', or 'Emergency Rapid Response'. 100% of your designated contribution goes directly to the selected program area.",
    tags: ["designation", "earmarked", "nidake", "emergency-appeal"],
  },
  {
    id: "don-6",
    category: "donations",
    question: "How do I set up recurring monthly donations or corporate gift matching?",
    answer:
      "On our donation page, simply toggle the 'Monthly Giving' option. This establishes a predictable recurring contribution that sustains our continuous field centers. For corporate philanthropy, workplace giving, or matching gifts, please contact us at donations@lifehelpers.org.",
    tags: ["monthly", "recurring", "corporate-giving", "sponsorship"],
  },
];

interface FaqAccordionProps {
  initialCategory?: FaqCategory;
  showHeading?: boolean;
  limit?: number;
  className?: string;
}

export function FaqAccordion({
  initialCategory = "all",
  showHeading = true,
  limit,
  className = "",
}: FaqAccordionProps) {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    "org-1": true,
    "prog-1": true,
    "don-1": true,
  });

  const categories = [
    { id: "all" as const, label: "All Questions", icon: HelpCircle },
    { id: "organization" as const, label: "Organization", icon: Building2 },
    { id: "programs" as const, label: "Programs & Impact", icon: HeartHandshake },
    { id: "donations" as const, label: "Donations & Giving", icon: CreditCard },
  ];

  const filteredFaqs = useMemo(() => {
    let result = FAQ_DATA;

    // Filter by Category
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q) ||
          item.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  }, [activeCategory, searchQuery, limit]);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    filteredFaqs.forEach((faq) => {
      next[faq.id] = true;
    });
    setExpandedIds(next);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  return (
    <section className={`w-full ${className}`} aria-labelledby="faq-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Optional Header Section */}
        {showHeading && (
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Got Questions? We Have Answers</span>
            </div>
            <h2
              id="faq-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-3.5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Find transparent, detailed answers regarding Life Helpers Initiative&apos;s
              organizational structure, humanitarian interventions, and donation handling.
            </p>
          </div>
        )}

        {/* Controls Bar: Category Pills + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
            role="tablist"
            aria-label="FAQ Categories"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring shrink-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search frequently asked questions"
              className="w-full rounded-full border border-border bg-card/80 pl-10 pr-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Counter and Expand/Collapse actions */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 px-1">
          <span>
            Showing <strong className="text-foreground">{filteredFaqs.length}</strong>{" "}
            {filteredFaqs.length === 1 ? "question" : "questions"}
            {searchQuery && ` for "${searchQuery}"`}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-ring rounded"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/40">
            <HelpCircle className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground">No questions found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5" role="region" aria-label="FAQ Accordion">
            {filteredFaqs.map((faq) => {
              const isExpanded = !!expandedIds[faq.id];
              const categoryBadge =
                faq.category === "organization"
                  ? { label: "Organization", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" }
                  : faq.category === "programs"
                  ? { label: "Programs", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" }
                  : { label: "Donations", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" };

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-primary/30 bg-card shadow-md"
                      : "border-border/70 bg-card/60 hover:border-primary/20 hover:bg-card"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-btn-${faq.id}`}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryBadge.color}`}
                        >
                          {categoryBadge.label}
                        </span>
                        {faq.featured && (
                          <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-accent" />
                            Popular
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isExpanded
                          ? "bg-primary text-primary-foreground border-primary rotate-180"
                          : "bg-muted/60 text-muted-foreground border-border/80"
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {/* Accordion Answer Content */}
                  {isExpanded && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${faq.id}`}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 animate-in fade-in-50 duration-200"
                    >
                      <div className="border-t border-border/50 pt-4 text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>

                      {/* Tag Pills */}
                      {faq.tags && faq.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                          {faq.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-medium text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Support Callout Card */}
        <div className="mt-12 sm:mt-16 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-6 sm:p-8 lg:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Still Need Assistance?
            </span>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold text-foreground">
              Have a question that isn&apos;t covered here?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our communications and donor relations teams are available to provide
              detailed briefings, partner dossiers, and support.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-foreground">
              <a
                href="mailto:info@lifehelpers.org"
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>info@lifehelpers.org</span>
              </a>
              <span className="text-muted-foreground/40">•</span>
              <a
                href="tel:+2348030000000"
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>+234 803 695 0352</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-all duration-200"
            >
              <span>Contact Us</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 transition-all duration-200"
            >
              <span>Make a Donation</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
