import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { JOB_ADVERT_2026_10, JOB_ADVERT_2026_10_PDF } from "@/data/job-advert-2026-10";
import { COLLECTIONS } from "@/lib/cms/schema";

describe("October 2026 job advert", () => {
  it("lists all 28 positions with unique slugs, closing 24 October 2026", () => {
    expect(JOB_ADVERT_2026_10).toHaveLength(28);
    expect(new Set(JOB_ADVERT_2026_10.map((j) => j.id)).size).toBe(28);
    expect(JOB_ADVERT_2026_10.every((j) => j.status === "open" && j.deadline === "2026-10-24")).toBe(true);
  });

  it("uses departments the admin offers and links the advert PDF", () => {
    const departments = COLLECTIONS.jobs.fields.find((f) => f.name === "department")!.options!.map((o) => o.value);
    expect(JOB_ADVERT_2026_10.every((j) => departments.includes(j.department))).toBe(true);
    expect(existsSync(path.join(process.cwd(), "public", JOB_ADVERT_2026_10_PDF))).toBe(true);
  });
});
