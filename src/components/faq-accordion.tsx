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

import type { FaqItem } from "@/data/faqs";

export type FaqCategory = "all" | "organization" | "programs" | "donations";
export type { FaqItem };

interface FaqAccordionProps {
  /** Questions from Admin → FAQs. */
  items: FaqItem[];
  initialCategory?: FaqCategory;
  showHeading?: boolean;
  limit?: number;
  className?: string;
}

export function FaqAccordion({
  items,
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
    let result = items;

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
  }, [items, activeCategory, searchQuery, limit]);

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
            <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
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
                  ? { label: "Organization", color: "bg-primary/10 text-primary border-primary/20" }
                  : faq.category === "programs"
                  ? { label: "Programs", color: "bg-accent/10 text-accent border-accent/25" }
                  : { label: "Donations", color: "bg-foreground/5 text-foreground border-foreground/15" };

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
                              className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md"
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
                href="mailto:official@lhinigeria.org"
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>official@lhinigeria.org</span>
              </a>
              <span className="text-muted-foreground">•</span>
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
