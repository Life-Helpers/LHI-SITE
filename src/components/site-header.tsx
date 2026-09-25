"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Radio, Search, Sparkles, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  useLocalizedNav,
  type NavCard,
  type NavLink,
  whoWeAreFeatured,
  whatWeDoFeatured,
  impactFeatured,
  getInvolvedFeatured,
  type FeaturedNavStory,
} from "@/components/nav-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/i18n/locale-context";

function NavUnderlineLink({
  href,
  className = "",
  insideHero = false,
  children,
}: {
  href: string;
  className?: string;
  insideHero?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group relative whitespace-nowrap px-2 2xl:px-3 py-2 text-[11px] 2xl:text-[12px] uppercase tracking-[0.1em] 2xl:tracking-[0.14em] font-semibold ${
        insideHero ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-primary"
      } transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute left-3 right-3 bottom-0 h-0.5 origin-left scale-x-0 ${
          insideHero ? "bg-white" : "bg-primary"
        } transition-transform duration-300 group-hover:scale-x-100`}
      />
    </Link>
  );
}

/** 1. WHO WE ARE MEGA MENU */
function WhoWeAreMegaMenu({ links }: { links: NavLink[] }) {
  const orgLinks = links.slice(0, 4);
  const govLinks = links.slice(4);

  return (
    <div className="w-full p-6">
      {/* Mega Menu Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            CAC/IT/25232
          </span>
          <p className="text-xs text-muted-foreground">
            Non-profit humanitarian relief and sustainable development since Oct 1, 2004.
          </p>
        </div>
        <Link
          href="/about"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Explore About Us <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Grid: 2 link columns + 1 visual featured column */}
      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Column 1: Organization */}
        <div className="md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Our Organization
          </p>
          <ul className="mt-3 space-y-1.5">
            {orgLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-muted/70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {Icon && (
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary">
                            {link.label}
                          </p>
                          {link.tag && (
                            <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] text-muted-foreground">
                              {link.tag}
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 2: Governance & Safeguarding */}
        <div className="md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Governance & Safeguarding
          </p>
          <ul className="mt-3 space-y-1.5">
            {govLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-muted/70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {Icon && (
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-foreground group-hover:text-primary">
                            {link.label}
                          </p>
                          {link.tag && (
                            <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] text-muted-foreground">
                              {link.tag}
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                            {link.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              );
            })}
          </ul>

          {/* Quick whistleblowing notice */}
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-2.5 text-[11px]">
            <p className="font-semibold text-foreground">Safeguarding & Whistleblowing</p>
            <p className="mt-0.5 text-muted-foreground">
              Confidential reporting at{" "}
              <span className="font-mono text-primary">feedback@lhinigeria.org</span>
            </p>
          </div>
        </div>

        {/* Column 3: Featured Visual Story Card */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Featured Story
          </p>
          <NavigationMenuLink asChild>
            <Link
              href={whoWeAreFeatured.heritage.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-2.5 transition-colors hover:border-primary/50 hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-xl bg-muted">
                <Image
                  src={whoWeAreFeatured.heritage.image}
                  alt="Life Helpers Initiative humanitarian outreach"
                  fill
                  sizes="260px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
                  {whoWeAreFeatured.heritage.tag}
                </span>
              </div>
              <div className="mt-2.5">
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary">
                  {whoWeAreFeatured.heritage.title}
                </h4>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                  {whoWeAreFeatured.heritage.subtitle}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:underline">
                  Our 22-Year Journey <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </NavigationMenuLink>

          {/* Secondary mini badge for NIDAKE */}
          <NavigationMenuLink asChild>
            <Link
              href={whoWeAreFeatured.nidake.href}
              className="group flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/60 p-2 transition-all hover:border-primary/40 hover:bg-card"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={whoWeAreFeatured.nidake.image}
                  alt="NIDAKE reusable sanitary pad initiative"
                  fill
                  sizes="48px"
                  referrerPolicy="no-referrer"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                  {whoWeAreFeatured.nidake.tag}
                </span>
                <p className="text-xs font-bold text-foreground group-hover:text-primary">
                  {whoWeAreFeatured.nidake.title}
                </p>
              </div>
            </Link>
          </NavigationMenuLink>
        </div>
      </div>
    </div>
  );
}

/** 2. WHAT WE DO MEGA MENU */
function WhatWeDoMegaMenu({
  cards,
  extra,
}: {
  cards: NavCard[];
  extra: NavLink;
}) {
  return (
    <div className="w-full p-6">
      {/* Mega Menu Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            6 Thematic Sectors
          </span>
          <p className="text-xs text-muted-foreground">
            Targeted humanitarian relief, community resilience, and system strengthening across 11 states.
          </p>
        </div>
        <Link
          href="/interventions/projectandintervention"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View All 9 Projects <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* 6 Thematic Sector Cards with Images & Icons */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <NavigationMenuLink asChild key={card.href}>
              <Link
                href={card.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-2.5 transition-colors hover:border-primary/50 hover:bg-card hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {/* Visual Image Banner with Tag & Icon */}
                <div className="relative h-24 w-full overflow-hidden rounded-xl bg-muted">
                  {card.image && (
                    <Image
                      src={card.image}
                      alt={card.label}
                      fill
                      sizes="(max-width: 768px) 50vw, 280px"
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {card.tag && (
                    <span className="absolute top-2 right-2 rounded-full bg-background/90 px-2 py-0.5 text-[9px] font-semibold text-foreground backdrop-blur-sm">
                      {card.tag}
                    </span>
                  )}

                  {/* Icon floating on bottom left */}
                  <div className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="mt-2.5">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.label}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                    {card.description}
                  </p>
                </div>
              </Link>
            </NavigationMenuLink>
          );
        })}
      </div>

      {/* Bottom Featured Bar: Radio Advocacy */}
      <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={whatWeDoFeatured.image}
                alt="Radio advocacy broadcast studio"
                fill
                sizes="80px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {whatWeDoFeatured.tag}
                </span>
              </div>
              <h4 className="text-xs font-bold text-foreground">
                {whatWeDoFeatured.title}
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {whatWeDoFeatured.subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <NavigationMenuLink asChild>
              <Link
                href={extra.href}
                className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
              >
                Listen / On-Air <ArrowRight className="h-3 w-3" />
              </Link>
            </NavigationMenuLink>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Icon + label + description rows, shared by the Impact and Get Involved menus. */
function MenuLinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <li key={link.href}>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className="group flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-muted/70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {Icon && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary">{link.label}</p>
                  {link.description && <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{link.description}</p>}
                </div>
              </Link>
            </NavigationMenuLink>
          </li>
        );
      })}
    </ul>
  );
}

/** Image card for a featured story inside a mega menu. */
function MenuFeatureCard({ story }: { story: FeaturedNavStory }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={story.href}
        className="group flex gap-3 rounded-2xl border border-border/80 bg-card p-2.5 transition-colors hover:border-primary/50 hover:shadow-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image src={story.image} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[10px] font-semibold uppercase text-primary">{story.tag}</span>
          <h4 className="text-xs font-bold text-foreground group-hover:text-primary">{story.title}</h4>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-muted-foreground">{story.subtitle}</p>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}

/** 3. IMPACT MEGA MENU */
function ImpactMegaMenu({ links }: { links: NavLink[] }) {
  const resultLinks = links.filter((l) => l.group === "results");
  const storyLinks = links.filter((l) => l.group === "stories");

  return (
    <div className="w-full p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">Evidence &amp; Stories</span>
          <p className="text-xs text-muted-foreground">What we achieve, how we account for it, and the people behind the numbers.</p>
        </div>
        <Link href="/impact" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View Annual Reports <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Results &amp; Accountability</p>
          <MenuLinkList links={resultLinks} />
        </div>
        <div className="md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Stories &amp; Media</p>
          <MenuLinkList links={storyLinks} />
        </div>
        <div className="flex flex-col gap-3 md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Featured</p>
          <MenuFeatureCard story={impactFeatured.glance} />
          <MenuFeatureCard story={impactFeatured.story} />
        </div>
      </div>
    </div>
  );
}

/** 4. GET INVOLVED MEGA MENU */
function GetInvolvedMegaMenu({ links }: { links: NavLink[] }) {
  return (
    <div className="w-full p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">Join Us</span>
          <p className="text-xs text-muted-foreground">Volunteer, learn, work or partner with Life Helpers Initiative.</p>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          Contact us <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Take Part</p>
          <MenuLinkList links={links.slice(0, 3)} />
        </div>
        <div className="md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Work With Us</p>
          <MenuLinkList links={links.slice(3)} />
        </div>
        <div className="flex flex-col gap-3 md:col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Support Our Work</p>
          <MenuFeatureCard story={getInvolvedFeatured} />
        </div>
      </div>
    </div>
  );
}

/** MOBILE DISCLOSURE WITH RICH THUMBNAIL/ICON CARDS */
function MobileDisclosure({
  label,
  links,
  onNavigate,
}: {
  label: string;
  links: (NavLink | NavCard)[];
  onNavigate: () => void;
}) {
  return (
    <details className="group border-b border-border/40 py-1">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-2.5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/70 [&::-webkit-details-marker]:hidden">
        <span>{label}</span>
        <span
          aria-hidden="true"
          className="text-xs text-muted-foreground transition-transform duration-200 group-open:rotate-180"
        >
          ▼
        </span>
      </summary>
      <div className="mt-1 mb-3 grid grid-cols-1 gap-1.5 pl-2">
        {links.map((link) => {
          const Icon = link.icon;
          const image = "image" in link ? link.image : undefined;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl border border-transparent p-2 text-xs hover:border-border hover:bg-card focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {image ? (
                <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image}
                    alt={link.label}
                    fill
                    sizes="48px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
              ) : Icon ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground truncate">
                    {link.label}
                  </p>
                  {link.tag && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                      {link.tag}
                    </span>
                  )}
                </div>
                {link.description && (
                  <p className="text-[11px] text-muted-foreground truncate">
                    {link.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </details>
  );
}

interface SiteHeaderProps {
  insideHero?: boolean;
}

export function SiteHeader({ insideHero = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLocale();
  const {
    whoWeAreLinks,
    whatWeDoCards,
    whatWeDoExtra,
    impactLinks,
    getInvolvedLinks,
  } = useLocalizedNav();

  useEffect(() => {
    if (!insideHero) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [insideHero]);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // While the mobile menu is open: Escape closes it and the page behind it doesn't scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  if (pathname === "/" && !insideHero) {
    return null;
  }

  const isHeroGlass = insideHero && !isScrolled;

  const simpleLinks: NavLink[] = [
    { label: t.nav.contact, href: "/contact" },
  ];

  return (
    <header
      className={
        insideHero
          ? isScrolled
            ? "fixed top-0 left-0 right-0 w-full z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-md transition-all duration-300"
            : "w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-4 sm:px-6 py-3 shadow-2xl transition-all duration-300"
          : "sticky top-0 z-50 w-full transition-colors duration-300 bg-background/85 dark:bg-background/85 backdrop-blur-xl border-b border-primary/10 dark:border-white/10 shadow-xs"
      }
    >
      <div
        className={`max-w-[1440px] mx-auto ${
          isHeroGlass ? "px-1 sm:px-3" : "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
        } h-16 sm:h-20 flex items-center justify-between gap-4 transition-all duration-300`}
      >
        <Link
          href="/"
          className="rounded focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Life Helpers Initiative"
            width={1533}
            height={440}
            sizes="160px"
            priority
            referrerPolicy="no-referrer"
            className="h-9 sm:h-10 w-auto transition-all duration-300 hover:scale-[1.02]"
          />
        </Link>

        <NavigationMenu className="hidden xl:flex" aria-label="Primary">
          <NavigationMenuList className="gap-0.5 2xl:gap-3">
            <NavigationMenuItem>
              <NavUnderlineLink href="/" insideHero={isHeroGlass}>{t.nav.home}</NavUnderlineLink>
            </NavigationMenuItem>

            {/* WHO WE ARE MEGA MENU */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`whitespace-nowrap px-2 2xl:px-3 py-2 text-[11px] 2xl:text-[12px] uppercase tracking-[0.1em] 2xl:tracking-[0.14em] font-semibold ${
                isHeroGlass ? "text-white/90 hover:text-white data-[state=open]:text-white" : "text-foreground/80 hover:text-primary data-[state=open]:text-primary"
              } transition-colors`}>
                {t.nav.whoWeAre}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <WhoWeAreMegaMenu links={whoWeAreLinks} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* WHAT WE DO MEGA MENU */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`whitespace-nowrap px-2 2xl:px-3 py-2 text-[11px] 2xl:text-[12px] uppercase tracking-[0.1em] 2xl:tracking-[0.14em] font-semibold ${
                isHeroGlass ? "text-white/90 hover:text-white data-[state=open]:text-white" : "text-foreground/80 hover:text-primary data-[state=open]:text-primary"
              } transition-colors`}>
                {t.nav.whatWeDo}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <WhatWeDoMegaMenu cards={whatWeDoCards} extra={whatWeDoExtra} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* IMPACT MEGA MENU */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`whitespace-nowrap px-2 2xl:px-3 py-2 text-[11px] 2xl:text-[12px] uppercase tracking-[0.1em] 2xl:tracking-[0.14em] font-semibold ${
                isHeroGlass ? "text-white/90 hover:text-white data-[state=open]:text-white" : "text-foreground/80 hover:text-primary data-[state=open]:text-primary"
              } transition-colors`}>
                {t.nav.impact}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ImpactMegaMenu links={impactLinks} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* GET INVOLVED MEGA MENU */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`whitespace-nowrap px-2 2xl:px-3 py-2 text-[11px] 2xl:text-[12px] uppercase tracking-[0.1em] 2xl:tracking-[0.14em] font-semibold ${
                isHeroGlass ? "text-white/90 hover:text-white data-[state=open]:text-white" : "text-foreground/80 hover:text-primary data-[state=open]:text-primary"
              } transition-colors`}>
                {t.nav.getInvolved}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <GetInvolvedMegaMenu links={getInvolvedLinks} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {simpleLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavUnderlineLink href={link.href} insideHero={isHeroGlass}>
                  {link.label}
                </NavUnderlineLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`hidden items-center gap-1.5 sm:flex ${isHeroGlass ? "[&_button]:border-white/30 [&_button]:text-white [&_button:hover]:border-white/60 [&>a]:border-white/30 [&>a]:text-white [&>a:hover]:border-white/60" : ""}`}>
            <Link
              href="/search"
              aria-label="Search the site"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:border-accent focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </Link>
            <LanguageSwitcher />
            <AccessibilityToolbar />
            <ThemeToggle />
          </div>

          <Link
            href="/donate"
            className="btn-swipe group hidden sm:inline-flex items-center gap-2 rounded-full border border-primary dark:border-accent bg-primary text-primary-foreground hover:text-white px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] font-semibold shadow-sm transition-all duration-300 active:scale-95"
          >
            <span>{t.nav.donate}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          <button
            type="button"
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full border ${
              isHeroGlass
                ? "border-white/30 text-white hover:bg-white/10"
                : "border-primary/30 dark:border-white/20 text-primary dark:text-accent hover:bg-primary/5"
            } xl:hidden transition-colors`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className={`flex max-h-[80vh] flex-col gap-1 overflow-y-auto overscroll-contain border-t border-border/80 bg-background/95 px-6 py-4 text-foreground shadow-2xl backdrop-blur-2xl xl:hidden ${
            isHeroGlass ? "rounded-b-2xl" : ""
          }`}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block rounded px-2.5 py-2 text-sm font-semibold text-foreground/90 hover:bg-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t.nav.home}
          </Link>

          <MobileDisclosure
            label={t.nav.whoWeAre}
            links={whoWeAreLinks}
            onNavigate={() => setMenuOpen(false)}
          />
          <MobileDisclosure
            label={t.nav.whatWeDo}
            links={[...whatWeDoCards, whatWeDoExtra]}
            onNavigate={() => setMenuOpen(false)}
          />
          <MobileDisclosure
            label={t.nav.impact}
            links={impactLinks}
            onNavigate={() => setMenuOpen(false)}
          />
          <MobileDisclosure
            label={t.nav.getInvolved}
            links={getInvolvedLinks}
            onNavigate={() => setMenuOpen(false)}
          />

          {simpleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded px-2.5 py-2 text-sm font-medium text-foreground/80 hover:bg-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          ))}

          {/* Quick Support Badge */}
          <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>NIDAKE Pad Social Enterprise</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Empowering girls and women with dignity and school retention.
            </p>
            <Link
              href="/nidake"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Learn More About NIDAKE →
            </Link>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <LanguageSwitcher />
            <div className="flex items-center gap-1.5">
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                aria-label="Search the site"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground hover:border-accent"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </Link>
              <AccessibilityToolbar />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
