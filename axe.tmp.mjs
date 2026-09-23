import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const B = "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ storageState: { cookies: [], origins: [{ origin: B, localStorage: [{ name: "lhi_anniversary_22", value: '{"subscribed":true}' }] }] } });
const pages = process.argv.slice(2);
const combos = {};
for (const p of pages) {
  const page = await ctx.newPage();
  await page.goto(B + p, { waitUntil: "load" }); await page.waitForTimeout(800);
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const v = r.violations.filter((x) => x.impact === "serious" || x.impact === "critical");
  let count = 0;
  for (const x of v) for (const n of x.nodes) {
    count++;
    const m = (n.failureSummary || "").match(/foreground color: (#\w+), background color: (#\w+)/);
    const key = x.id === "color-contrast" && m ? `${m[1]} on ${m[2]}` : x.id;
    combos[key] ??= { n: 0, ex: [] };
    combos[key].n++;
    if (combos[key].ex.length < 2) combos[key].ex.push(`${p} ${n.target.join(" ").slice(0, 110)}`);
  }
  console.log(p, count);
  await page.close();
}
for (const [k, v] of Object.entries(combos).sort((a, b) => b[1].n - a[1].n)) console.log(`${v.n}\t${k}\n\t${v.ex.join("\n\t")}`);
await browser.close();
