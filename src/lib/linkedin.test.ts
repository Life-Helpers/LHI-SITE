import { describe, expect, it } from "vitest";

import { linkedinEmbed } from "@/lib/linkedin";

describe("linkedinEmbed", () => {
  it("reads the links LinkedIn gives for a post", () => {
    expect(linkedinEmbed("https://www.linkedin.com/posts/life-helpers-initiative_education-activity-7254321987654321098-AbCd?utm_source=share")).toBe(
      "https://www.linkedin.com/embed/feed/update/urn:li:activity:7254321987654321098",
    );
    expect(linkedinEmbed("https://www.linkedin.com/feed/update/urn:li:activity:7254321987654321098/")).toBe(
      "https://www.linkedin.com/embed/feed/update/urn:li:activity:7254321987654321098",
    );
    expect(linkedinEmbed(" https://www.linkedin.com/embed/feed/update/urn:li:share:7254321987654321098 ")).toBe(
      "https://www.linkedin.com/embed/feed/update/urn:li:share:7254321987654321098",
    );
    expect(linkedinEmbed("https://linkedin.com/feed/update/urn%3Ali%3AugcPost%3A7254321987654321098")).toBe(
      "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7254321987654321098",
    );
  });

  it("refuses anything that isn't a LinkedIn post", () => {
    expect(linkedinEmbed("https://www.linkedin.com/company/life-helpers-initiative/")).toBeNull();
    expect(linkedinEmbed("https://evil.example/feed/update/urn:li:activity:7254321987654321098")).toBeNull();
    expect(linkedinEmbed("https://notlinkedin.com/feed/update/urn:li:activity:7254321987654321098")).toBeNull();
    expect(linkedinEmbed("not a link")).toBeNull();
  });
});
