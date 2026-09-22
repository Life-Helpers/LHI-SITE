import { describe, expect, it } from "vitest";

import { consortiumEoiSchema } from "./consortium-eoi";

const valid = {
  requestType: "Consortium partnership" as const,
  organization: "Example INGO",
  contactName: "Amina Bello",
  email: "amina@example.org",
  agency: "European Union" as const,
  deadline: "2026-11-30",
  states: ["sokoto", "borno"],
  message: "We are building a consortium for a resilience call in the North-East.",
};

describe("consortiumEoiSchema", () => {
  it("accepts a complete submission", () => {
    expect(consortiumEoiSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an empty optional deadline", () => {
    expect(consortiumEoiSchema.safeParse({ ...valid, deadline: "" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(consortiumEoiSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects an unknown request type", () => {
    expect(consortiumEoiSchema.safeParse({ ...valid, requestType: "Other" }).success).toBe(false);
  });

  it("rejects a message that is too short", () => {
    expect(consortiumEoiSchema.safeParse({ ...valid, message: "Hi" }).success).toBe(false);
  });
});
