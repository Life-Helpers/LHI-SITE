import { describe, expect, it } from "vitest";

import { screenCv } from "@/lib/recruitment/screening";

const cv = `Amina Bello — MEAL Officer. Five years designing data collection tools in KoboToolbox and ODK,
analysing survey data in Excel and SPSS. Fluent in Hausa and English. Supported IRC and UNICEF projects in Sokoto.`;

describe("screenCv", () => {
  it("scores the share of keywords the CV mentions", () => {
    const s = screenCv(cv, ["MEAL", "KoboToolbox", "Hausa", "Power BI"], "2026-11-10T00:00:00Z");
    expect(s).toEqual({ score: 75, matched: ["MEAL", "KoboToolbox", "Hausa"], missing: ["Power BI"], readable: true, at: "2026-11-10T00:00:00Z" });
  });

  it("ignores case and spacing, and counts alternatives on one line once", () => {
    expect(screenCv(cv, ["kobo toolbox / koboToolbox", "M&E / meal", "data   collection"]).score).toBe(100);
  });

  it("matches whole words only", () => {
    expect(screenCv("An excellent communicator.", ["Excel"]).matched).toEqual([]);
    expect(screenCv(cv, ["ODK"]).matched).toEqual(["ODK"]);
    expect(screenCv(cv, ["Sokoto"]).matched).toEqual(["Sokoto"]);
  });

  it("gives 0 and flags an unreadable CV instead of guessing", () => {
    expect(screenCv("", ["MEAL"])).toMatchObject({ score: 0, readable: false, missing: ["MEAL"] });
  });

  it("gives 0 when the vacancy has no keywords", () => {
    expect(screenCv(cv, []).score).toBe(0);
  });
});
