import { describe, expect, it } from "vitest";

import { canonicalBankName, matchBanks, NIGERIAN_BANKS } from "@/lib/hr/nigerian-banks";

describe("Nigerian bank suggestions", () => {
  it("finds banks by full name or the short forms people type, ignoring case and spaces", () => {
    expect(matchBanks("gtb")[0].name).toBe("Guaranty Trust Bank (GTBank)");
    expect(matchBanks("GT bank")[0].name).toBe("Guaranty Trust Bank (GTBank)");
    expect(matchBanks("fbn")[0].name).toBe("First Bank of Nigeria");
    expect(matchBanks("uba")[0].name).toBe("United Bank for Africa (UBA)");
    expect(matchBanks("zen")[0].name).toBe("Zenith Bank");
    expect(matchBanks("diamond")[0].name).toBe("Access Bank");
    expect(matchBanks("monie")[0].name).toBe("Moniepoint Microfinance Bank");
    expect(matchBanks("microfinance").length).toBeGreaterThan(3);
    expect(matchBanks("xyz bank of nowhere")).toEqual([]);
  });

  it("saves short forms as the bank's usual name, and keeps any other bank as typed", () => {
    expect(canonicalBankName("gtb")).toBe("Guaranty Trust Bank (GTBank)");
    expect(canonicalBankName(" Stanbic ")).toBe("Stanbic IBTC Bank");
    expect(canonicalBankName("First Bank")).toBe("First Bank of Nigeria");
    expect(canonicalBankName("Some Community MFB")).toBe("Some Community MFB");
    expect(canonicalBankName("")).toBe("");
  });

  it("has no bank listed twice, and no short form pointing at two banks", () => {
    const names = NIGERIAN_BANKS.map((b) => b.name.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
    const forms = NIGERIAN_BANKS.flatMap((b) => [b.name, ...b.aliases].map((a) => a.toLowerCase().replace(/[^a-z0-9]/g, "")));
    expect(new Set(forms).size).toBe(forms.length);
  });
});
