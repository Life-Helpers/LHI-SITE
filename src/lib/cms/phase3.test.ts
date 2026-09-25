import { describe, expect, it } from "vitest";

import { siteConfig } from "@/config/site";
import { INTERVENTIONS_DATA, THEMATIC_PILLARS } from "@/data/interventions-data";
import { OBSERVANCE_AREAS } from "@/data/observances";
import { OPERATIONAL_STATES } from "@/data/operational-states";
import { programs } from "@/data/programs";
import { PROJECT_STORIES } from "@/data/project-stories";
import { THEMATIC_AREA_IDS, THEMATIC_AREAS } from "@/data/thematic-areas";
import { legacyStoryRank, matchPartnersByDonor, postProjects, projectPartnerIds } from "./links";
import { COLLECTIONS, PILLAR_OPTIONS, STATE_OPTIONS } from "./schema";

describe("single sources", () => {
  it("every thematic list is derived from the registry", () => {
    expect(Object.keys(THEMATIC_PILLARS)).toEqual([...THEMATIC_AREA_IDS]);
    expect(PILLAR_OPTIONS.map((o) => o.value)).toEqual([...THEMATIC_AREA_IDS]);
    expect(programs.map((p) => p.id)).toEqual([...THEMATIC_AREA_IDS]);
    for (const p of programs) expect(p.name).toBe(THEMATIC_AREAS[p.id as keyof typeof THEMATIC_AREAS].name);
    for (const id of THEMATIC_AREA_IDS) expect(OBSERVANCE_AREAS[id].href).toBe(THEMATIC_AREAS[id].href);
  });

  it("state choices and the stats come from the state list", () => {
    expect(STATE_OPTIONS.map((o) => o.value)).toEqual(OPERATIONAL_STATES.map((s) => s.id));
    expect(siteConfig.stats.statesActive).toBe(`${OPERATIONAL_STATES.length}+`);
    expect(siteConfig.stats.yearsOfService).toMatch(/^2\d\+$/);
  });
});

// A few partner profiles as stored by the CMS (the real list lives in partners-data.tsx).
const PARTNERS_DATA = [
  { id: "fcdo-uk", name: "Foreign, Commonwealth & Development Office", shortName: "UK FCDO", acronym: "FCDO" },
  { id: "wfp", name: "United Nations World Food Programme", shortName: "World Food Programme", acronym: "WFP" },
  { id: "unicef", name: "United Nations Children's Fund", shortName: "UNICEF", acronym: "UNICEF" },
  { id: "kfw", name: "KfW Development Bank", shortName: "KfW Development Bank", acronym: "KfW" },
  { id: "usaid", name: "United States Agency for International Development", shortName: "USAID", acronym: "USAID" },
  { id: "nhf", name: "Nigeria Humanitarian Fund", shortName: "Nigeria Humanitarian Fund", acronym: "NHF / OCHA" },
];

describe("links between records", () => {
  it("matches partners named in a project's donor line", () => {
    expect(matchPartnersByDonor("FCDO / World Food Programme (WFP)", PARTNERS_DATA)).toEqual(expect.arrayContaining(["fcdo-uk", "wfp"]));
    expect(matchPartnersByDonor("UNICEF / KfW", PARTNERS_DATA)).toEqual(expect.arrayContaining(["unicef", "kfw"]));
    // "USG" is not USAID, and "UNOCHA" does not contain the partner acronym "OCHA" as a word.
    expect(matchPartnersByDonor("USG / Palladium Group", PARTNERS_DATA)).toEqual([]);
  });

  it("uses saved links, falling back to the original mappings for older records", () => {
    const [projectId, slugs] = Object.entries(PROJECT_STORIES)[0];
    expect(postProjects({ slug: slugs[0] })).toContain(projectId);
    expect(postProjects({ slug: slugs[0], projects: [] })).toEqual([]);
    expect(legacyStoryRank(projectId, slugs[1])).toBe(1);
    const project = INTERVENTIONS_DATA.find((p) => p.donor.includes("WFP"))!;
    expect(projectPartnerIds({ donor: project.donor }, PARTNERS_DATA)).toContain("wfp");
    expect(projectPartnerIds({ donor: project.donor, partnerIds: ["unicef"] }, PARTNERS_DATA)).toEqual(["unicef"]);
  });

  it("posts and projects expose the link fields to the editor", () => {
    expect(COLLECTIONS.posts.fields.find((f) => f.name === "projects")?.relation).toBe("interventions");
    expect(COLLECTIONS.interventions.fields.find((f) => f.name === "partnerIds")?.relation).toBe("partners");
  });
});
