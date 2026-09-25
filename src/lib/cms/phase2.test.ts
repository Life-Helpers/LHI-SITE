import { describe, expect, it } from "vitest";

import { BEFORE_AFTER_STORIES } from "@/data/before-after";
import { FAQ_DATA } from "@/data/faqs";
import { LHI_PHOTOS } from "@/data/lhi-photos";
import { OBSERVANCES, upcomingObservances } from "@/data/observances";
import { TESTIMONIALS } from "@/data/testimonials";
import { COLLECTIONS } from "@/lib/cms/schema";
import { paragraphs, parseStats } from "@/lib/cms/text";
import { isSafeLink, validateRecord } from "@/lib/cms/validate";
import { DEFAULT_SITE_DATA, telHref, whatsappHref } from "@/lib/site-data";

describe("phase 2: content moved into the CMS", () => {
  it("parses figures typed as 'Label | Value' and blank-line paragraphs", () => {
    expect(parseStats(["Individuals reached | 1.5M+", "no value here", " States | 11 "])).toEqual([
      { label: "Individuals reached", value: "1.5M+" },
      { label: "States", value: "11" },
    ]);
    expect(paragraphs("First.\n\nSecond line\ncontinues.\n\n\n")).toEqual(["First.", "Second line\ncontinues."]);
  });

  it("accepts only safe links in link fields", () => {
    for (const ok of ["/donate", "/blog/a-story", "https://lhinigeria.org", "mailto:official@lhinigeria.org", "tel:+2349095049086"]) {
      expect(isSafeLink(ok)).toBe(true);
    }
    for (const bad of ["javascript:alert(1)", "//evil.example", "data:text/html,x", "http://insecure.example"]) {
      expect(isSafeLink(bad)).toBe(false);
    }
    const { errors } = validateRecord(COLLECTIONS.testimonials, {
      name: "A",
      id: "a",
      role: "B",
      quote: "C",
      href: "javascript:alert(1)",
      tone: "from-primary to-[#a80f14]",
      status: "published",
      order: 10,
    });
    expect(errors.href).toMatch(/page on this site/);
  });

  it("seed data is complete and safe to publish", () => {
    expect(TESTIMONIALS.length).toBeGreaterThan(0);
    expect(TESTIMONIALS.every((t) => isSafeLink(t.href))).toBe(true);
    expect(BEFORE_AFTER_STORIES.every((b) => b.photo in LHI_PHOTOS && (!b.beforePhoto || b.beforePhoto in LHI_PHOTOS) && isSafeLink(b.href))).toBe(true);
    expect(new Set(FAQ_DATA.map((f) => f.id)).size).toBe(FAQ_DATA.length);
    expect(new Set(OBSERVANCES.map((o) => o.id)).size).toBe(OBSERVANCES.length);
  });

  it("observance days come from the list it is given", () => {
    const only = [{ ...OBSERVANCES[0], id: "test-day", title: "Test Day", month: 12, day: 31 }];
    const upcoming = upcomingObservances("2026-12-01", 60, only);
    expect(upcoming.map((e) => e.id)).toEqual(["test-day"]);
  });

  it("builds phone and WhatsApp links from numbers written with spaces", () => {
    expect(telHref("+234 909 504 9086")).toBe("tel:+2349095049086");
    expect(whatsappHref("+234 201 330 9033", "Hi")).toBe("https://wa.me/2342013309033?text=Hi");
    expect(DEFAULT_SITE_DATA.stats.statesActive).toMatch(/^\d+\+$/);
    expect(DEFAULT_SITE_DATA.social.facebook).toMatch(/^https:\/\//);
  });
});
