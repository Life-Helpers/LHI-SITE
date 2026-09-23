"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Building,
  Check,
  CheckCircle2,
  Copy,
  Heart,
  Info,
  Lock,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { africanFulfillmentImages } from "@/data/african-fulfillment-images";

interface Tier {
  id: string;
  amount: number;
  label: string;
}

const oneTimeTiers: Tier[] = [
  { id: "gift_25", amount: 25, label: "Seeds" },
  { id: "gift_50", amount: 50, label: "Roots" },
  { id: "gift_100", amount: 100, label: "Branches" },
  { id: "gift_250", amount: 250, label: "Grove" },
  { id: "gift_500", amount: 500, label: "Orchard" },
  { id: "gift_1000", amount: 1000, label: "Forest" },
];

const monthlyTiers: Tier[] = [
  { id: "monthly_10", amount: 10, label: "Sustain" },
  { id: "monthly_25", amount: 25, label: "Cultivate" },
  { id: "monthly_50", amount: 50, label: "Nurture" },
  { id: "monthly_100", amount: 100, label: "Champion" },
];

const ledgerItems = [
  {
    k: "$25",
    d: "Emergency therapeutic nutrition sachets for two malnourished infants in remote frontline clinics.",
  },
  {
    k: "$50/mo",
    d: "Continuous monthly primary health screenings and essential medications for a vulnerable rural family.",
  },
  {
    k: "$100",
    d: "A complete emergency food parcel sustaining a displaced household for an entire month.",
  },
  {
    k: "$250",
    d: "School learning materials, uniforms, and psychosocial safe-space care for 10 vulnerable children.",
  },
  {
    k: "$500",
    d: "One month of clinic solar electricity, vaccine cold-chain preservation, and clean water supplies.",
  },
  {
    k: "$1,000+",
    d: "Underwrites an entire mobile medical deployment reaching hundreds of isolated villagers.",
  },
];

export function DonateView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [selectedOneTime, setSelectedOneTime] = useState<string>("gift_100");
  const [selectedMonthly, setSelectedMonthly] = useState<string>("monthly_25");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [noticeMessage, setNoticeMessage] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
  const [designation, setDesignation] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("cancelled") === "true") {
      setNoticeMessage("Checkout was cancelled. No charges were made to your account.");
    }
    const err = searchParams.get("error");
    if (err) {
      setErrorMessage(decodeURIComponent(err));
    }
    const presetAmount = Number(searchParams.get("amount"));
    if (Number.isFinite(presetAmount) && presetAmount >= 5) {
      setFrequency("one_time");
      setCustomAmount(String(presetAmount));
    }
    if (searchParams.get("designation") === "nidake") {
      const kits = Number(searchParams.get("kits"));
      setDesignation("nidake");
      setNoticeMessage(
        Number.isFinite(kits) && kits > 0
          ? `Your gift will sponsor ${kits} NIDAKE dignity ${kits === 1 ? "kit" : "kits"} for displaced and rural schoolgirls.`
          : "Your gift will sponsor NIDAKE dignity kits for displaced and rural schoolgirls.",
      );
    }
  }, [searchParams]);

  const currentTiers = frequency === "monthly" ? monthlyTiers : oneTimeTiers;
  const currentSelectedTier =
    frequency === "monthly" ? selectedMonthly : selectedOneTime;
  const setTier =
    frequency === "monthly" ? setSelectedMonthly : setSelectedOneTime;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setNoticeMessage("");

    let effectiveAmount = 100;
    if (customAmount) {
      const parsed = parseFloat(customAmount);
      if (isNaN(parsed) || parsed < 5) {
        setErrorMessage("Donation amount must be at least $5.00.");
        return;
      }
      effectiveAmount = parsed;
    } else {
      const found = currentTiers.find((t) => t.id === currentSelectedTier);
      if (found) effectiveAmount = found.amount;
    }

    if (donorEmail.trim() && !donorEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address for your donation receipt.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        donor_name: donorName.trim() || null,
        donor_email: donorEmail.trim() || null,
        frequency,
        package_id: customAmount ? null : currentSelectedTier,
        custom_amount: customAmount ? effectiveAmount : null,
        designation,
      };

      const res = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.checkout_url) {
        throw new Error(data.error || "Unable to initiate checkout. Please try again.");
      }

      // Handle external Stripe checkout (open safely) vs internal simulated checkout (router.push)
      if (data.is_stripe || data.checkout_url.startsWith("http://") || data.checkout_url.startsWith("https://")) {
        window.open(data.checkout_url, "_blank");
        setIsSubmitting(false);
      } else {
        router.push(data.checkout_url);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unable to initiate checkout. Please try again.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      {/* 1. HERO BANNER - Life Helpers Initiative Brand Styling */}
      <header className="relative isolate overflow-hidden border-b border-border bg-muted/40 pt-32 pb-16 sm:pt-36 sm:pb-20 md:pt-44 md:pb-24 dark:bg-card/30">
        {/* Subtle background image with atmospheric scrims */}
        <div className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden">
          <Image
            src={africanFulfillmentImages.donateHero.src}
            alt={africanFulfillmentImages.donateHero.alt}
            fill
            priority
            sizes="100vw"
            referrerPolicy="no-referrer"
            className="scale-105 object-cover opacity-[0.22] mix-blend-luminosity dark:opacity-15"
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

        <div className="relative mx-auto max-w-[1440px] px-8 sm:px-10 md:px-16 lg:px-20">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            {/* Eyebrow Column */}
            <div className="lg:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                — Donate
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Life Helpers Initiative · 11 Nigerian States
              </p>
            </div>

            {/* Title & Narrative Column */}
            <div className="lg:col-span-9">
              <h1 className="font-serif-display text-[48px] font-light leading-[0.92] tracking-[-0.03em] text-foreground sm:text-[72px] md:text-[100px] lg:text-[132px]">
                <span>Every gift</span>{" "}
                <em className="font-light italic text-primary">funds a life.</em>
              </h1>
              <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[18px]">
                Your donation directly supports emergency food assistance, clinical healthcare outreaches, malnutrition stabilization, and child protection hubs across 11 frontline Nigerian states. LHI is a registered non-profit organization — every contribution compounds on the ground.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN DONATION SECTION */}
      <section className="py-20 md:py-28" aria-label="Donation Details and Checkout">
        <div className="mx-auto max-w-[1440px] px-8 sm:px-10 md:px-16 lg:px-20">
          {noticeMessage && (
            <div
              role="status"
              className="mb-8 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground"
            >
              <Info className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{noticeMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* LEFT COLUMN: The Ledger of Compounding Kindness */}
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                — Where it goes
              </p>
              <h2 className="mt-4 font-serif-display text-4xl font-light leading-[1.05] text-foreground md:text-5xl">
                A ledger of
                <br />
                <em className="font-light italic text-primary">compounding kindness.</em>
              </h2>

              <ul className="mt-10 space-y-2">
                {ledgerItems.map((item) => (
                  <li
                    key={item.k}
                    className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-t border-border py-3.5"
                  >
                    <span className="font-serif-display text-2xl tracking-tight text-primary">
                      {item.k}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.d}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Visual African Fulfillment Showcase Card */}
              <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-md">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={africanFulfillmentImages.donateHero.src}
                    alt={africanFulfillmentImages.donateHero.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 450px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground backdrop-blur-md">
                    <Sparkles className="h-3 w-3" />
                    Putting A Smile On A Face
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold drop-shadow-sm">
                      {africanFulfillmentImages.donateHero.caption}
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/80">
                      100% of public donations directly fund frontline supplies and healthcare.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security reassurance */}
              <div className="mt-10 flex items-start gap-3 text-xs text-muted-foreground">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>
                  Secure checkout powered by Stripe. Card and transaction details never touch LHI servers.
                </span>
              </div>

              {/* Direct Bank Transfer Drawer / Option */}
              <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Bank Transfer (NGN & USD Wire)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBankDetails(!showBankDetails)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {showBankDetails ? "Hide accounts" : "Show accounts"}
                  </button>
                </div>

                {showBankDetails && (
                  <div className="mt-4 space-y-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    <p className="text-[13px] font-medium text-foreground">
                      Life Helpers Initiative Official Accounts
                    </p>
                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                      <div>
                        <div className="font-semibold text-foreground">Zenith Bank Plc (NGN)</div>
                        <div>Account: <strong className="text-foreground">1014298101</strong></div>
                        <div>Name: Life Helpers Initiative</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("1014298101", "zenith")}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-muted"
                      >
                        {copiedField === "zenith" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedField === "zenith" ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                      <div>
                        <div className="font-semibold text-foreground">First Bank of Nigeria (USD Domiciliary)</div>
                        <div>Account: <strong className="text-foreground">2034981120</strong></div>
                        <div>SWIFT: FBNINGLA</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("2034981120", "fbn")}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-muted"
                      >
                        {copiedField === "fbn" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedField === "fbn" ? "Copied" : "Copy"}
                      </button>
                    </div>

                    <p className="text-[11px] italic">
                      For bank transfers, kindly email transfer confirmation to{" "}
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">
                        {siteConfig.contact.email}
                      </a>{" "}
                      for your official tax receipt.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: The Interactive Donation Box */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                aria-label="Donation Checkout Form"
                className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm"
              >
                {/* Gold/Orange Sparkle Eyebrow */}
                <div className="mb-6 flex items-center gap-3">
                  <Sparkles
                    size={18}
                    className="fill-accent text-accent stroke-none"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-medium">
                    Give in seconds
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Pill Mode Switcher: One-Time vs Monthly */}
                <div className="mb-8 grid max-w-sm grid-cols-2 rounded-full border border-border bg-muted/30 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFrequency("one_time");
                      setCustomAmount("");
                    }}
                    data-testid="donate-mode-onetime"
                    aria-pressed={frequency === "one_time"}
                    className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all ${
                      frequency === "one_time"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart size={14} aria-hidden="true" />
                    One-time
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFrequency("monthly");
                      setCustomAmount("");
                    }}
                    data-testid="donate-mode-monthly"
                    aria-pressed={frequency === "monthly"}
                    className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all ${
                      frequency === "monthly"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                    Monthly
                  </button>
                </div>

                {/* Amount Selection Cards Grid */}
                <div
                  className={`grid gap-3 ${
                    frequency === "monthly"
                      ? "grid-cols-2 sm:grid-cols-4"
                      : "grid-cols-2 sm:grid-cols-3"
                  }`}
                >
                  {currentTiers.map((tier) => {
                    const isSelected =
                      currentSelectedTier === tier.id && !customAmount;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        data-testid={`donate-${frequency}-${tier.amount}`}
                        onClick={() => {
                          setTier(tier.id);
                          setCustomAmount("");
                        }}
                        className={`group rounded-xl border p-5 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                            : "border-border bg-background text-foreground hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-serif-display text-3xl tracking-tight">
                            ${tier.amount}
                            {frequency === "monthly" && (
                              <span className="ml-0.5 text-sm opacity-80">
                                /mo
                              </span>
                            )}
                          </span>
                          {isSelected && (
                            <Check
                              size={16}
                              className="text-primary-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <span className="mt-2 block text-[11px] uppercase tracking-[0.22em] opacity-80 font-medium">
                          {tier.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Field */}
                <div className="mt-6">
                  <label
                    htmlFor="d-custom"
                    className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium"
                  >
                    Or enter a custom amount (USD)
                    {frequency === "monthly" ? " · monthly" : ""}
                  </label>
                  <div
                    className={`flex items-center rounded-xl border bg-background transition-all ${
                      customAmount
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-input hover:border-primary/40"
                    }`}
                  >
                    <span className="font-serif-display pl-4 pr-2 text-xl text-primary font-medium">
                      $
                    </span>
                    <input
                      id="d-custom"
                      type="number"
                      min="5"
                      max={frequency === "monthly" ? 10000 : 50000}
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder={frequency === "monthly" ? "Monthly amount" : "Custom amount"}
                      className="w-full bg-transparent px-2 py-3 text-lg text-foreground outline-none"
                    />
                    {frequency === "monthly" && (
                      <span className="pr-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">
                        /mo
                      </span>
                    )}
                  </div>
                </div>

                {/* Donor Details: Name and Email */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="d-name"
                      className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium"
                    >
                      Your name (optional)
                    </label>
                    <input
                      id="d-name"
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Anonymous is welcome"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-[15px] text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="d-email"
                      className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium"
                    >
                      Email (for receipt)
                    </label>
                    <input
                      id="d-email"
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="you@somewhere.org"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-[15px] text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Bottom Bar: Reassurance Note & Submit CTA Button */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 size={14} className="shrink-0 text-accent" aria-hidden="true" />
                    <span>
                      {frequency === "monthly"
                        ? "Cancel anytime directly from your receipt email."
                        : "Contributions directly empower frontline relief and healthcare."}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Preparing checkout…"
                      : frequency === "monthly"
                      ? "Start monthly giving"
                      : "Continue to secure checkout"}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
