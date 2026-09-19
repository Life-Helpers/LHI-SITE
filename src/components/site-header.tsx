"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useLocalizedNav, type NavLink } from "@/components/nav-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/i18n/locale-context";

function NavUnderlineLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group relative rounded text-sm font-medium text-foreground/80 hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
      />
    </Link>
  );
}

function DropdownPanel({ links }: { links: NavLink[] }) {
  return (
    <ul className="grid w-56 gap-1">
      {links.map((link) => (
        <li key={link.href}>
          <NavigationMenuLink asChild>
            <Link
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          </NavigationMenuLink>
        </li>
      ))}
    </ul>
  );
}

function WhatWeDoPanel({
  cards,
  extra,
}: {
  cards: ReturnType<typeof useLocalizedNav>["whatWeDoCards"];
  extra: NavLink;
}) {
  return (
    <div className="w-[min(90vw,720px)]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <NavigationMenuLink asChild key={card.href}>
            <Link
              href={card.href}
              className="glow-border group flex flex-col overflow-hidden rounded-2xl border border-border hover:border-primary/40 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="flex h-20 items-center justify-center bg-gradient-to-br from-primary to-accent shadow-[0_0_24px_var(--glow-shadow-hover)]">
                <card.icon
                  className="h-8 w-8 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold group-hover:text-primary">
                  {card.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </Link>
          </NavigationMenuLink>
        ))}
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <NavigationMenuLink asChild>
          <Link
            href={extra.href}
            className="inline-block rounded px-1 text-sm font-medium text-primary hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {extra.label} →
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

function MobileDisclosure({
  label,
  links,
  onNavigate,
}: {
  label: string;
  links: NavLink[];
  onNavigate: () => void;
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between rounded px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground [&::-webkit-details-marker]:hidden">
        {label}
        <span aria-hidden="true" className="transition-transform group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <ul className="mt-1 mb-2 flex flex-col gap-0.5 pl-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="block rounded px-2 py-1.5 text-sm text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLocale();
  const { whoWeAreLinks, whatWeDoCards, whatWeDoExtra, impactLinks } =
    useLocalizedNav();

  const simpleLinks: NavLink[] = [
    { label: t.nav.getInvolved, href: "/get-involved" },
    { label: t.nav.contact, href: "/contact" },
  ];

  return (
    <header className="glass-surface sticky top-0 z-40 mx-auto mt-3 w-[calc(100%-1.5rem)] max-w-6xl rounded-3xl border-border/80 sm:w-[calc(100%-3rem)]">
      <nav
        aria-label="Primary"
        className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link
          href="/"
          className="rounded focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src="/logo.png"
            alt="Life Helpers Initiative"
            width={1533}
            height={440}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavUnderlineLink href="/">{t.nav.home}</NavUnderlineLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{t.nav.whoWeAre}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <DropdownPanel links={whoWeAreLinks} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{t.nav.whatWeDo}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <WhatWeDoPanel cards={whatWeDoCards} extra={whatWeDoExtra} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{t.nav.impact}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <DropdownPanel links={impactLinks} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            {simpleLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavUnderlineLink href={link.href}>
                  {link.label}
                </NavUnderlineLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1.5 sm:flex">
            <LanguageSwitcher />
            <AccessibilityToolbar />
            <ThemeToggle />
          </div>

          <Button
            asChild
            size="sm"
            className="transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_var(--glow-shadow-hover)]"
          >
            <Link href="/donate">{t.nav.donate}</Link>
          </Button>

          <button
            type="button"
            className="rounded p-2 hover:bg-foreground/5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
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
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden"
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block rounded px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
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

          {simpleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded px-2 py-2 text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
            <LanguageSwitcher />
            <AccessibilityToolbar />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
