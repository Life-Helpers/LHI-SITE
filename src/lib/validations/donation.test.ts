import { describe, expect, it } from "vitest";

import { donationSchema } from "./donation";

const validInput = {
  frequency: "one_time" as const,
  amount: 50,
  donorName: "Jane Doe",
  donorEmail: "jane@example.org",
  message: "",
};

describe("donationSchema", () => {
  it("accepts a valid one-time donation", () => {
    const result = donationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts a valid monthly donation without a message", () => {
    const result = donationSchema.safeParse({
      frequency: "monthly",
      amount: validInput.amount,
      donorName: validInput.donorName,
      donorEmail: validInput.donorEmail,
    });
    expect(result.success).toBe(true);
  });

  it.each([
    ["below the $5 minimum", 4.99],
    ["zero", 0],
    ["negative", -10],
  ])("rejects an amount that is %s", (_label, amount) => {
    const result = donationSchema.safeParse({ ...validInput, amount });
    expect(result.success).toBe(false);
  });

  it("rejects an amount over the $50,000 maximum", () => {
    const result = donationSchema.safeParse({ ...validInput, amount: 50001 });
    expect(result.success).toBe(false);
  });

  it("accepts the boundary amounts", () => {
    expect(donationSchema.safeParse({ ...validInput, amount: 5 }).success).toBe(
      true,
    );
    expect(
      donationSchema.safeParse({ ...validInput, amount: 50000 }).success,
    ).toBe(true);
  });

  it("rejects an invalid frequency", () => {
    const result = donationSchema.safeParse({
      ...validInput,
      frequency: "yearly",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing donor name", () => {
    const result = donationSchema.safeParse({ ...validInput, donorName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only donor name", () => {
    const result = donationSchema.safeParse({ ...validInput, donorName: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = donationSchema.safeParse({
      ...validInput,
      donorEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message over 500 characters", () => {
    const result = donationSchema.safeParse({
      ...validInput,
      message: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a message at exactly 500 characters", () => {
    const result = donationSchema.safeParse({
      ...validInput,
      message: "a".repeat(500),
    });
    expect(result.success).toBe(true);
  });

  it("trims whitespace from name, email, and message", () => {
    const result = donationSchema.safeParse({
      ...validInput,
      donorName: "  Jane Doe  ",
      donorEmail: "  jane@example.org  ",
      message: "  hello  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.donorName).toBe("Jane Doe");
      expect(result.data.donorEmail).toBe("jane@example.org");
      expect(result.data.message).toBe("hello");
    }
  });
});
