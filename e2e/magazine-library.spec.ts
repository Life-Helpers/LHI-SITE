import { expect, test } from "@playwright/test";

test("magazine library filters, searches and saves editions", async ({ page }) => {
  await page.goto("/project-magazines");
  await expect(page.getByRole("heading", { name: /fresh from the field/i })).toBeVisible();
  const editions = page.locator("main a[aria-label^='Open ']");

  await page.getByRole("navigation", { name: "Library shelves" }).getByRole("button", { name: /Helpers Digest/ }).click();
  await expect(editions.first()).toBeVisible();
  const digests = await editions.count();
  expect(digests).toBeGreaterThan(0);

  await page.getByRole("searchbox", { name: /search magazines/i }).fill("zzz-no-such-edition");
  await expect(editions).toHaveCount(0);
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(editions).toHaveCount(digests);

  await page.locator("main button[aria-label^='Save ']").first().click();
  await page.getByRole("navigation", { name: "Library shelves" }).getByRole("button", { name: /Saved/ }).click();
  await expect(editions).toHaveCount(1);
});

test("the flipbook remembers the page and the library offers to continue", async ({ page }) => {
  await page.goto("/project-magazines");
  const href = await page.getByRole("link", { name: /read the latest/i }).getAttribute("href");
  await page.goto(`${href}?page=3`);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("lhi_mag_progress")), { timeout: 15_000 })
    .toBeNull();
  await page.waitForTimeout(1500);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("lhi_mag_progress")), { timeout: 15_000 }).not.toBeNull();
  await page.goto("/project-magazines");
  await expect(page.getByRole("link", { name: /continue reading/i }).first()).toBeVisible();
});
