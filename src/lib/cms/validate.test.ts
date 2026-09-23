import { describe, expect, it } from "vitest";

import { ALL_PERMISSIONS, BUILT_IN_ROLES, can, COLLECTIONS, slugify } from "./schema";
import { validateRecord } from "./validate";

const validPost = {
  title: "Borehole restores water to Gujba",
  slug: "",
  excerpt: "3,500 displaced people now have clean water.",
  content: "## Clean water\nDetails here.",
  status: "published",
  date: "2026-09-01",
  category: "Success Stories",
  featured: "on",
  featuredImage: "/media/borehole.jpg",
  author: "LHI Comms",
  tags: "WASH\n\nYobe\nWASH",
  unknownField: "dropped",
};

describe("validateRecord", () => {
  it("coerces a valid post and drops unknown fields", () => {
    const { record, errors } = validateRecord(COLLECTIONS.posts, { ...validPost, slug: "Borehole Restores Water!" });
    expect(errors).toEqual({});
    expect(record.slug).toBe("borehole-restores-water");
    expect(record.featured).toBe(true);
    expect(record.tags).toEqual(["WASH", "Yobe"]);
    expect(record).not.toHaveProperty("unknownField");
  });

  it("flags missing required fields", () => {
    const { errors } = validateRecord(COLLECTIONS.posts, { ...validPost, title: "  ", slug: "x" });
    expect(errors.title).toBeDefined();
  });

  it("rejects select values outside the allowed options", () => {
    const { errors } = validateRecord(COLLECTIONS.posts, { ...validPost, slug: "x", status: "deleted" });
    expect(errors.status).toBeDefined();
  });

  it("rejects javascript: and plain-http asset URLs", () => {
    const js = validateRecord(COLLECTIONS.posts, { ...validPost, slug: "x", featuredImage: "javascript:alert(1)" });
    const http = validateRecord(COLLECTIONS.posts, { ...validPost, slug: "x", featuredImage: "http://example.com/a.jpg" });
    expect(js.errors.featuredImage).toBeDefined();
    expect(http.errors.featuredImage).toBeDefined();
  });

  it("validates numbers and multiselect options for interventions", () => {
    const bad = validateRecord(COLLECTIONS.states, { name: "Sokoto", focus: "x", zone: "North-West", totalLgas: "-2", lgasCovered: 1, beneficiaries: "abc" });
    expect(bad.errors.totalLgas).toBeDefined();
    expect(bad.errors.beneficiaries).toBeDefined();
    const ms = validateRecord(COLLECTIONS.interventions, { states: ["sokoto", "lagos"] });
    expect(ms.errors.states).toBeDefined();
  });
});

describe("roles and slugs", () => {
  it("ranks roles", () => {
    const role = (id: string) => BUILT_IN_ROLES.find((r) => r.id === id)!;
    expect(role("administrator").permissions).toEqual(ALL_PERMISSIONS);
    expect(can(role("editor"), "interventions")).toBe(true);
    expect(can(role("editor"), "users")).toBe(false);
    expect(can(role("author"), "posts.own")).toBe(true);
    expect(can(role("author"), "posts.all")).toBe(false);
    expect(can(null, "media")).toBe(false);
  });

  it("slugifies accented and punctuated text", () => {
    expect(slugify("  Café Résumé: 2026 Update! ")).toBe("cafe-resume-2026-update");
  });
});
