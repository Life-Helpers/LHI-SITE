import { test, expect } from "@playwright/test";

test.describe("content hierarchy", () => {
  test("programs listing links to a working detail page", async ({ page }) => {
    await page.goto("/programs");
    await expect(
      page.getByRole("heading", { name: "Programs", level: 1 }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Learn more" }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Support this work" })).toBeVisible();
  });

  test("emergencies listing links to a detail page with responding programs", async ({
    page,
  }) => {
    await page.goto("/emergencies");
    await expect(
      page.getByRole("heading", { name: "Emergencies", level: 1 }),
    ).toBeVisible();

    // The sitewide alert banner also has a "View response" CTA, rendered
    // before this page's content — scope to <main> so this clicks the
    // listing's card, not the banner.
    await page
      .locator("main")
      .getByRole("link", { name: "View response" })
      .first()
      .click();
    await expect(
      page.getByRole("heading", { name: "Responding programs" }),
    ).toBeVisible();
  });

  test("impact report links to covered programs", async ({ page }) => {
    await page.goto("/impact");
    await expect(
      page.getByRole("heading", { name: "Impact Reports", level: 1 }),
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

  test("legal pages render with their draft-placeholder notice", async ({
    page,
  }) => {
    for (const path of ["/privacy", "/terms"]) {
      await page.goto(path);
      await expect(page.getByText("Draft placeholder.")).toBeVisible();
    }
  });

  test("about and contact pages render", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "About Life Helpers Initiative" }),
    ).toBeVisible();

    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { name: "Contact", level: 1 }),
    ).toBeVisible();
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
