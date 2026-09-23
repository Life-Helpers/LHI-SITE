import { test, expect } from "@playwright/test";

test.describe("content hierarchy", () => {
  test("programs listing links to a working detail page", async ({ page }) => {
    await page.goto("/programs");
    await expect(
      page.getByRole("heading", { name: /Interventions Delivering Fulfilled Lives/, level: 1 }),
    ).toBeVisible();

    await page.locator('main a[href="/health"]').first().click();
    await expect(page.getByRole("heading", { name: "Health", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Support this work" })).toBeVisible();
  });

  test("emergencies listing shows the empty state when none are declared", async ({
    page,
  }) => {
    await page.goto("/emergencies");
    await expect(
      page.getByRole("heading", { name: /Emergency Relief/, level: 1 }),
    ).toBeVisible();

    // There is no real declared emergency right now — the honest empty
    // state should render instead of any fabricated entry.
    await expect(
      page.getByText("There are no declared emergencies at this time."),
    ).toBeVisible();
  });

  test("impact report links to covered programs", async ({ page }) => {
    await page.goto("/impact");
    await expect(
      page.getByRole("heading", { name: /Measuring Smiles/, level: 1 }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Read report" }).first().click();
    await expect(
      page.getByRole("heading", { name: "Programs covered" }),
    ).toBeVisible();
  });

  test("unknown program/emergency/report slugs 404", async ({ page }) => {
    for (const path of [
      "/programs/does-not-exist",
      "/emergencies/does-not-exist",
      "/impact/does-not-exist",
    ]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    }
  });

  test("legal pages render with a last-updated date and numbered sections", async ({
    page,
  }) => {
    for (const [path, title] of [
      ["/privacy", "Privacy Policy"],
      ["/terms", "Terms of Service"],
    ]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { name: title, level: 2 })).toBeVisible();
      await expect(page.getByText(/Last updated:/)).toBeVisible();
      await expect(page.getByRole("heading", { name: /^1\. /, level: 2 })).toBeVisible();
    }
  });

  test("about and contact pages render", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: /About Life Helpers Initiative/, level: 1 }),
    ).toBeVisible();

    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: /Contact Life Helpers Initiative/, level: 1 }),
    ).toBeVisible();
  });

  test("contact page shows every office on the Nigeria map and in the address list", async ({ page }) => {
    await page.goto("/contact");
    const pins = page.locator("#presence-map button[aria-label$=' State'], #presence-map button[aria-label$='Territory']");
    await expect(pins).toHaveCount(11);
    await page.getByRole("button", { name: /^Jos Office, / }).click();
    await expect(page.locator("#presence-map h3").first()).toHaveText("Jos Office");
    await expect(page.locator("iframe[title^='Google Map of the']")).toHaveCount(12);
  });

  test("robots.txt and sitemap.xml are served", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("<urlset");
  });
});
