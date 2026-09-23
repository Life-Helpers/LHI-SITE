import { expect, test } from "@playwright/test";

import { ANNIVERSARY } from "../src/config/anniversary";

test.use({ storageState: { cookies: [], origins: [] } });

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
const inWindow = ANNIVERSARY.enabled && today >= ANNIVERSARY.showFrom && today <= ANNIVERSARY.showUntil;

test("anniversary popup greets first-time visitors and can be dismissed", async ({ page }) => {
  test.skip(!inWindow, "Outside the anniversary campaign window");
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: /celebrating 22 years/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Email address")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.reload();
  await page.waitForTimeout(1500); // the popup opens after a short delay
  await expect(page.getByRole("dialog", { name: /celebrating 22 years/i })).toBeHidden();
});
