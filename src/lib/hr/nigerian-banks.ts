/**
 * Banks staff are paid into: Nigerian commercial, non-interest and merchant banks, and the
 * microfinance and mobile-money banks salaries commonly go to. Used to suggest and tidy the bank
 * name on salary accounts; any other bank can still be typed in.
 */
export interface NigerianBank {
  /** The name saved and shown on payslips. */
  name: string;
  /** Other names and short forms people type ("GTB", "FBN", former names). */
  aliases: string[];
  kind: "Commercial" | "Non-interest" | "Merchant" | "Microfinance / mobile money";
}

export const NIGERIAN_BANKS: NigerianBank[] = [
  { name: "Access Bank", aliases: ["Access", "Diamond Bank", "Access Diamond"], kind: "Commercial" },
  { name: "Citibank Nigeria", aliases: ["Citi", "Citibank"], kind: "Commercial" },
  { name: "Ecobank Nigeria", aliases: ["Ecobank", "Eco"], kind: "Commercial" },
  { name: "Fidelity Bank", aliases: ["Fidelity"], kind: "Commercial" },
  { name: "First Bank of Nigeria", aliases: ["First Bank", "FBN"], kind: "Commercial" },
  { name: "First City Monument Bank (FCMB)", aliases: ["FCMB", "First City"], kind: "Commercial" },
  { name: "Globus Bank", aliases: ["Globus"], kind: "Commercial" },
  { name: "Guaranty Trust Bank (GTBank)", aliases: ["GTBank", "GTB", "GTCO", "Guaranty Trust"], kind: "Commercial" },
  { name: "Keystone Bank", aliases: ["Keystone"], kind: "Commercial" },
  { name: "Optimus Bank", aliases: ["Optimus"], kind: "Commercial" },
  { name: "Parallex Bank", aliases: ["Parallex"], kind: "Commercial" },
  { name: "Polaris Bank", aliases: ["Polaris", "Skye Bank"], kind: "Commercial" },
  { name: "PremiumTrust Bank", aliases: ["Premium Trust"], kind: "Commercial" },
  { name: "Providus Bank", aliases: ["Providus"], kind: "Commercial" },
  { name: "Signature Bank", aliases: ["Signature"], kind: "Commercial" },
  { name: "Stanbic IBTC Bank", aliases: ["Stanbic", "IBTC", "Stanbic IBTC"], kind: "Commercial" },
  { name: "Standard Chartered Bank", aliases: ["Standard Chartered", "StanChart", "SCB"], kind: "Commercial" },
  { name: "Sterling Bank", aliases: ["Sterling"], kind: "Commercial" },
  { name: "SunTrust Bank", aliases: ["SunTrust"], kind: "Commercial" },
  { name: "Titan Trust Bank", aliases: ["Titan", "Titan Trust", "TTB"], kind: "Commercial" },
  { name: "Union Bank of Nigeria", aliases: ["Union Bank", "Union", "UBN"], kind: "Commercial" },
  { name: "United Bank for Africa (UBA)", aliases: ["UBA", "United Bank for Africa"], kind: "Commercial" },
  { name: "Unity Bank", aliases: ["Unity"], kind: "Commercial" },
  { name: "Wema Bank", aliases: ["Wema", "ALAT", "ALAT by Wema"], kind: "Commercial" },
  { name: "Zenith Bank", aliases: ["Zenith"], kind: "Commercial" },
  { name: "Jaiz Bank", aliases: ["Jaiz"], kind: "Non-interest" },
  { name: "Lotus Bank", aliases: ["Lotus"], kind: "Non-interest" },
  { name: "TAJBank", aliases: ["TAJ"], kind: "Non-interest" },
  { name: "The Alternative Bank", aliases: ["Alternative Bank", "AltBank", "Sterling Alternative"], kind: "Non-interest" },
  { name: "Coronation Merchant Bank", aliases: ["Coronation"], kind: "Merchant" },
  { name: "FBNQuest Merchant Bank", aliases: ["FBNQuest", "FBN Merchant"], kind: "Merchant" },
  { name: "FSDH Merchant Bank", aliases: ["FSDH"], kind: "Merchant" },
  { name: "Greenwich Merchant Bank", aliases: ["Greenwich"], kind: "Merchant" },
  { name: "Nova Bank", aliases: ["Nova", "Nova Merchant Bank"], kind: "Merchant" },
  { name: "Rand Merchant Bank", aliases: ["RMB", "Rand"], kind: "Merchant" },
  { name: "Moniepoint Microfinance Bank", aliases: ["Moniepoint", "TeamApt"], kind: "Microfinance / mobile money" },
  { name: "OPay", aliases: ["OPay Digital", "Paycom"], kind: "Microfinance / mobile money" },
  { name: "PalmPay", aliases: [], kind: "Microfinance / mobile money" },
  { name: "Kuda Microfinance Bank", aliases: ["Kuda"], kind: "Microfinance / mobile money" },
  { name: "VFD Microfinance Bank", aliases: ["VFD", "V Bank"], kind: "Microfinance / mobile money" },
  { name: "FairMoney Microfinance Bank", aliases: ["FairMoney"], kind: "Microfinance / mobile money" },
  { name: "Carbon Microfinance Bank", aliases: ["Carbon", "Paylater"], kind: "Microfinance / mobile money" },
  { name: "LAPO Microfinance Bank", aliases: ["LAPO"], kind: "Microfinance / mobile money" },
  { name: "AB Microfinance Bank", aliases: ["AB MFB", "AB Microfinance"], kind: "Microfinance / mobile money" },
  { name: "Accion Microfinance Bank", aliases: ["Accion"], kind: "Microfinance / mobile money" },
  { name: "Baobab Microfinance Bank", aliases: ["Baobab"], kind: "Microfinance / mobile money" },
  { name: "Rubies Microfinance Bank", aliases: ["Rubies"], kind: "Microfinance / mobile money" },
  { name: "Sparkle Microfinance Bank", aliases: ["Sparkle"], kind: "Microfinance / mobile money" },
  { name: "Mint Microfinance Bank", aliases: ["Mint", "Finex"], kind: "Microfinance / mobile money" },
];

const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Banks matching what's been typed, best first: a full or short name that starts with it, then
 * one that contains it. Ignores case, spaces and punctuation ("gt bank" finds GTBank).
 */
export function matchBanks(query: string, limit = 8): NigerianBank[] {
  const q = squash(query);
  if (!q) return NIGERIAN_BANKS.slice(0, limit);
  const score = (b: NigerianBank) => {
    const names = [b.name, ...b.aliases].map(squash);
    if (names.some((n) => n === q)) return 0;
    if (names.some((n) => n.startsWith(q))) return 1;
    if (names.some((n) => n.includes(q))) return 2;
    return 9;
  };
  return NIGERIAN_BANKS.map((b) => ({ b, s: score(b) }))
    .filter((x) => x.s < 9)
    .sort((a, b) => a.s - b.s || a.b.name.localeCompare(b.b.name))
    .slice(0, limit)
    .map((x) => x.b);
}

/** The usual name for a bank typed by its short form ("gtb" → "Guaranty Trust Bank (GTBank)"); anything else unchanged. */
export function canonicalBankName(typed: string): string {
  const q = squash(typed);
  if (!q) return "";
  const exact = NIGERIAN_BANKS.find((b) => [b.name, ...b.aliases].some((n) => squash(n) === q));
  return exact ? exact.name : typed.trim();
}
