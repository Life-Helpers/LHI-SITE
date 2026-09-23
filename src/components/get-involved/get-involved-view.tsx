"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  HandHeart,
  Heart,
  MapPin,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

interface FormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  location: string;
  availability: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  interest: "community-health",
  location: "sokoto",
  availability: "flexible",
  message: "",
};

const moreWays = [
  {
    href: "/careers",
    icon: Briefcase,
    title: "Careers & vacancies",
    body: "Current openings across LHI's offices, with online applications.",
    cta: "View vacancies",
  },
  {
    href: "/get-involved/training",
    icon: GraduationCap,
    title: "Humanitarian training",
    body: "Free self-paced safeguarding courses with verifiable certificates.",
    cta: "Start learning",
  },
  {
    href: "/procurement",
    icon: ShieldCheck,
    title: "Supply to LHI",
    body: "Open requests for quotation and tenders, and vendor registration.",
    cta: "Vendor requests",
  },
  {
    href: "/partner-portal",
    icon: Building2,
    title: "Partner with us",
    body: "Due-diligence documents and consortium expressions of interest.",
    cta: "Partner portal",
  },
];

const cards = [
  {
    id: "donate",
    index: "01",
    icon: Heart,
    title: "Donate",
    body: "Underwrite emergency food parcels, clinic medicines, malnutrition treatments, and child protection hubs across 11 states. Every gift compounds.",
    cta: {
      to: "/donate",
      label: "Donate",
      isAnchor: false,
    },
  },
  {
    id: "volunteer",
    index: "02",
    icon: HandHeart,
    title: "Volunteer",
    body: "Serve as a community health educator, field logistics volunteer, youth mentor, or crisis response assistant. Bring your gift.",
    cta: {
      anchor: "#volunteer-form",
      label: "Apply below",
      isAnchor: true,
    },
  },
  {
    id: "partner",
    index: "03",
    icon: Building2,
    title: "Partner",
    body: "Collaborate as an organization — international NGOs, UN bodies, government agencies, universities, faith institutions, and corporate teams.",
    cta: {
      to: "/contact",
      label: "Start a conversation",
      isAnchor: false,
    },
  },
  {
    id: "advocate",
    index: "04",
    icon: Megaphone,
    title: "Advocate",
    body: "Amplify our grassroots impact in your circles. Share field stories, air advocacy programs, invite our team to speak, and multiply reach.",
    cta: {
      to: "/contact",
      label: "Advocate with us",
      isAnchor: false,
    },
  },
  {
    id: "careers",
    index: "05",
    icon: Briefcase,
    title: "Careers & Jobs",
    body: "Join LHI's team of staff and volunteers across 11 states in Nigeria, or build your skills with our free safeguarding training and certificates.",
    cta: {
      anchor: "#careers",
      label: "Careers, training & more",
      isAnchor: true,
    },
  },
];

export function GetInvolvedView() {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange =
    (field: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit application.");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setIsSuccess(false);
    setErrorMessage("");
  };

  return (
    <div className="flex-1">
      {/* 1. HERO BANNER - Modeled exactly after compassionatehealthfoundation.org */}
      <header className="relative isolate overflow-hidden border-b border-border bg-muted/40 pt-32 pb-20 sm:pt-36 sm:pb-24 md:pt-44 md:pb-28 dark:bg-card/30">
        {/* Subtle background image with atmospheric scrims */}
        <div className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden">
          <Image
            src={africanFulfillmentImages.volunteerHero.src}
            alt={africanFulfillmentImages.volunteerHero.alt}
            fill
            priority
            sizes="100vw"
            referrerPolicy="no-referrer"
            className="object-cover opacity-20 dark:opacity-15 mix-blend-luminosity scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            {/* Left eyebrow column */}
            <div className="lg:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                — Get Involved
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Life Helpers Initiative · 11 Nigerian States
              </p>
            </div>

            {/* Right editorial headline column */}
            <div className="lg:col-span-9">
              <h1 className="font-serif-display text-[44px] font-light leading-[0.92] tracking-[-0.03em] text-foreground sm:text-[68px] md:text-[92px] lg:text-[116px]">
                This mission{" "}
                <em className="font-light italic text-primary">
                  takes all of us.
                </em>
              </h1>
              <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
                Healthcare professional, community volunteer, partner organization, student, church member, corporate team — there&apos;s a path in for you. Choose yours below.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. THE 4 PATH CARDS SECTION */}
      <section className="py-20 md:py-28" aria-label="Ways to engage with LHI">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  id={card.id}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-8 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-md md:p-10"
                >
                  <div>
                    {/* Top bar: round icon badge + numbered index */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform duration-200">
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                        {card.index}
                      </span>
                    </div>

                    {/* Middle title & body */}
                    <div className="mt-8">
                      <h3 className="font-serif-display text-3xl font-light tracking-tight text-foreground md:text-4xl">
                        {card.title}
                      </h3>
                      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                        {card.body}
                      </p>
                    </div>
                  </div>

                  {/* Bottom CTA link */}
                  <div className="mt-8 pt-4">
                    {card.cta.isAnchor ? (
                      <a
                        href={card.cta.anchor}
                        className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {card.cta.label}
                        <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={card.cta.to || "/contact"}
                        className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:text-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {card.cta.label}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VOLUNTEER FORM SECTION - Layout identical to CHF volunteer form */}
      <section
        id="volunteer-form"
        className="border-t border-border bg-muted/30 py-20 md:py-28 dark:bg-card/20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Left intro & details column */}
            <div className="lg:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                — Volunteer form
              </p>
              <h2 className="mt-4 font-serif-display text-4xl font-light leading-[1.08] tracking-tight text-foreground md:text-5xl">
                Tell us where
                <br />
                you&apos;d like to{" "}
                <em className="font-light italic text-primary">help.</em>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                Share a few details and our volunteer coordinator will respond within a week. Every application matters — every gift finds its place.
              </p>

              {/* Key reassurance bullet points */}
              <div className="mt-8 space-y-4 rounded-xl border border-border/70 bg-card/60 p-5 text-xs text-muted-foreground backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <strong className="text-foreground">11 Operational States:</strong> Deployments available across Sokoto, Kebbi, Zamfara, Borno, Katsina, Abuja FCT, and remote support.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <strong className="text-foreground">Safeguarding Induction:</strong> All personnel receive comprehensive PSEA and humanitarian code-of-conduct orientation.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <strong className="text-foreground">Flexible Engagements:</strong> From weekend medical outreaches to ongoing youth mentorship and digital advocacy.
                  </div>
                </div>
              </div>
            </div>

            {/* Right form card column */}
            <div className="lg:col-span-8">
              {isSuccess ? (
                <div
                  role="status"
                  className="flex flex-col items-start rounded-2xl border border-primary/30 bg-card p-8 sm:p-12 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-serif-display text-3xl font-light tracking-tight text-foreground md:text-4xl">
                    Thank you, {formData.name || "friend"}.
                  </h3>
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                    Your application is on our desk. A member of the LHI field volunteer coordination team will review your background and reach out to you shortly via <strong>{formData.email}</strong>.
                  </p>

                  <div className="mt-6 w-full rounded-xl border border-border/80 bg-muted/40 p-4 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Submission Summary:</p>
                    <p className="mt-1">
                      Area of Interest: <span className="capitalize">{formData.interest.replace("-", " ")}</span>
                    </p>
                    <p>
                      Location: <span className="capitalize">{formData.location}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-foreground transition-all hover:border-primary/40 hover:bg-muted/60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  aria-label="Volunteer Application Form"
                  className="grid grid-cols-1 gap-5 rounded-2xl border border-border/80 bg-card p-6 sm:p-10 md:grid-cols-2 shadow-xs"
                >
                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive md:col-span-2"
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="v-name"
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      Full name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="v-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange("name")}
                      placeholder="Maryam Bello"
                      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="v-email"
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      Email address <span className="text-primary">*</span>
                    </label>
                    <input
                      id="v-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange("email")}
                      placeholder="maryam@example.org"
                      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label
                      htmlFor="v-phone"
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      Phone (optional)
                    </label>
                    <input
                      id="v-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                      placeholder="+234 803 000 0000"
                      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Area of interest */}
                  <div className="space-y-2">
                    <label
                      htmlFor="v-interest"
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      Area of interest
                    </label>
                    <select
                      id="v-interest"
                      value={formData.interest}
                      onChange={handleChange("interest")}
                      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-[15px] text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="community-health">Community Health & Nutrition Outreach</option>
                      <option value="education-mentor">Education & Child Mentorship</option>
                      <option value="emergency-relief">Emergency Relief & Food Distribution</option>
                      <option value="livelihood-trainer">Livelihood & Women Empowerment</option>
                      <option value="protection-psea">Child Protection & Psychosocial Care</option>
                      <option value="radio-advocacy">Radio Programming & Media Advocacy</option>
                      <option value="logistics-operations">Logistics, IT & Field Coordination</option>
                      <option value="other">Other Specialized Skillset</option>
                    </select>
                  </div>

                  {/* Location Preference */}
                  <div className="space-y-2">
                    <label
                      htmlFor="v-location"
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      Preferred State / Office
                    </label>
                    <select
                      id="v-location"
                      value={formData.location}
                      onChange={handleChange("location")}
                      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-[15px] text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="sokoto">Sokoto State (HQ)</option>
                      <option value="kebbi">Kebbi State Field Office</option>
                      <option value="zamfara">Zamfara State Field Office</option>
                      <option value="borno">Borno State (North-East Response)</option>
                      <option value="katsina">Katsina State Field Office</option>
                      <option value="abuja">Abuja FCT Liaison Office</option>
                      <option value="remote">Remote / Online Contribution</option>
                    </select>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <label
                      htmlFor="v-availability"
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      Time Availability
                    </label>
                    <select
                      id="v-availability"
                      value={formData.availability}
                      onChange={handleChange("availability")}
                      className="w-full rounded-lg border border-border bg-muted/30 px-4 py-3 text-[15px] text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      <option value="flexible">Flexible / Project-by-project</option>
                      <option value="weekends">Weekends & Special Campaigns</option>
                      <option value="part-time">Part-time (1-2 days weekly)</option>
                      <option value="full-time">Full-time Deployment</option>
                    </select>
                  </div>

                  {/* Message / Motivation */}
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor="v-message"
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                    >
                      Tell us a bit about yourself
                    </label>
                    <textarea
                      id="v-message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange("message")}
                      placeholder="Your background, skills, languages spoken (Hausa, Kanuri, Fulfulde, etc.), or why LHI resonates with you…"
                      className="w-full resize-y rounded-lg border border-border bg-muted/30 px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Bottom footer: privacy note & submit button */}
                  <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center md:col-span-2">
                    <p className="text-xs text-muted-foreground">
                      We respect your privacy. Nothing is shared outside LHI.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {isSubmitting ? "Sending application…" : "Submit application"}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAREERS, TRAINING & PROCUREMENT */}
      <section id="careers" className="border-t border-border bg-card/40 py-16 sm:py-24" aria-labelledby="more-ways-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">— More ways to work with LHI</p>
          <h2 id="more-ways-heading" className="mt-2 font-serif-display text-3xl font-light text-foreground sm:text-4xl">
            Careers, training and procurement
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {moreWays.map((w) => (
              <Link
                key={w.href}
                href={w.href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <w.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-foreground group-hover:text-primary">{w.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  {w.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
