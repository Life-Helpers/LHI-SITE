import { afterEach, describe, expect, it, vi } from "vitest";

import { en } from "@/i18n/en";
import { HISTORY_MILESTONES } from "@/data/history-timeline";
import { TEAM_MEMBERS } from "@/data/team";
import { applyHomeText, HOME_TEXT_FIELDS, homeTextDefault, sanitizeHomeText } from "@/lib/home-text";
import { rateLimited } from "@/lib/rate-limit";
import { isSensitivePost, missingChecks, SAFEGUARDING_CHECKS } from "./safeguarding";
import { BUILT_IN_ROLES, COLLECTIONS } from "./schema";
import { validateRecord } from "./validate";

describe("home page text overrides", () => {
  it("every editable field points at real built-in text", () => {
    for (const field of HOME_TEXT_FIELDS) {
      const value = homeTextDefault(en.home, field.key);
      expect(Array.isArray(value) ? value.length : value.length, field.key).toBeGreaterThan(0);
    }
  });

  it("keeps only known, non-empty keys and splits lists by line", () => {
    const clean = sanitizeHomeText({
      "whoWeAre.heading": "  Since 2004  ",
      "whoWeAre.values": "Love — care\n\nHonesty — truth\n",
      "whoWeAre.body": "   ",
      "unknown.key": "dropped",
    });
    expect(clean).toEqual({ "whoWeAre.heading": "Since 2004", "whoWeAre.values": ["Love — care", "Honesty — truth"] });
  });

  it("applies overrides without changing the built-in dictionary", () => {
    const merged = applyHomeText(en.home, { "radio.heading": "WeSpeak on air", "philosophy.quote": "" });
    expect(merged.radio.heading).toBe("WeSpeak on air");
    expect(merged.philosophy.quote).toBe(en.home.philosophy.quote);
    expect(en.home.radio.heading).not.toBe("WeSpeak on air");
    expect(applyHomeText(en.home, undefined)).toBe(en.home);
  });
});

describe("history and team collections", () => {
  it("history and team seeds are valid records for the admin editor", () => {
    const team = TEAM_MEMBERS.map((m) => validateRecord(COLLECTIONS.team, m as unknown as Record<string, unknown>));
    expect(team.every((r) => Object.keys(r.errors).length === 0)).toBe(true);
    expect(new Set(TEAM_MEMBERS.map((m) => m.id)).size).toBe(TEAM_MEMBERS.length);
    expect(TEAM_MEMBERS.filter((m) => m.group === "board").length).toBeGreaterThan(0);
    expect(HISTORY_MILESTONES.length).toBeGreaterThan(10);
  });
});

describe("sensitive story review", () => {
  it("detects sensitive topics from the flag, title, excerpt or tags", () => {
    expect(isSensitivePost({ sensitive: true })).toBe(true);
    expect(isSensitivePost({ title: "Hope restored", tags: ["Health", "HIV"] })).toBe(true);
    expect(isSensitivePost({ excerpt: "Supporting GBV survivors in Yobe" })).toBe(true);
    expect(isSensitivePost({ title: "Borehole restores water", tags: ["WASH"] })).toBe(false);
  });

  it("lists the checks still to tick", () => {
    expect(missingChecks(SAFEGUARDING_CHECKS.map((c) => c.value))).toEqual([]);
    expect(missingChecks(["consent"])).toHaveLength(SAFEGUARDING_CHECKS.length - 1);
  });

  it("only administrators can approve sensitive stories by default", () => {
    const perms = (id: string) => BUILT_IN_ROLES.find((r) => r.id === id)!.permissions as readonly string[];
    expect(perms("administrator")).toContain("posts.review");
    expect(perms("editor")).not.toContain("posts.review");
    expect(perms("editor")).toContain("about");
  });
});

describe("rate limiting", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  const req = (ip: string) => new Request("http://localhost/api/x", { headers: { "x-forwarded-for": `9.9.9.9, ${ip}` } });

  it("counts per visitor in memory when no shared store is configured", async () => {
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await rateLimited(req("203.0.113.1"), "test-mem", 3));
    expect(results).toEqual([false, false, false, true]);
    expect(await rateLimited(req("203.0.113.2"), "test-mem", 3)).toBe(false);
  });

  it("uses the shared Redis REST store when configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "t");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify([{ result: 11 }, { result: 0 }])));
    expect(await rateLimited(req("203.0.113.3"), "test-redis", 10)).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://redis.example/pipeline");
    expect(JSON.parse(String((init as RequestInit).body))[0]).toEqual(["INCR", "lhi:rl:test-redis:203.0.113.3"]);
  });

  it("falls back to memory if the shared store fails", async () => {
    vi.stubEnv("KV_REST_API_URL", "https://kv.example");
    vi.stubEnv("KV_REST_API_TOKEN", "t");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("down"));
    expect(await rateLimited(req("203.0.113.4"), "test-fallback", 1)).toBe(false);
    expect(await rateLimited(req("203.0.113.4"), "test-fallback", 1)).toBe(true);
  });
});
