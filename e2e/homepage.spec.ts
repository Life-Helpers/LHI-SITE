import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("renders hero, nav, and featured programs", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Rapid crisis response, delivered where it's needed most\./,
      }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Donate now" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Program impact" }),
    ).toBeVisible();
  });

  test("crisis alert banner is visible and dismissible", async ({ page }) => {
    await page.goto("/");

    // Next.js itself renders a hidden, always-present role="alert" route
    // announcer for a11y — scope to visible text so this only matches our
    // actual banner.
    const banner = page.getByRole("alert").filter({ hasText: "Placeholder" });
    await expect(banner).toBeVisible();

    await page.getByRole("button", { name: "Dismiss alert" }).click();
    await expect(banner).toHaveCount(0);
  });

  test("mobile nav menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    // The desktop nav's links exist in the DOM at every viewport (CSS-hidden,
    // not unmounted), so assert on the mobile dropdown's own container
    // rather than link name/role, which would match both.
    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toHaveCount(0);

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Emergencies" })).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(mobileNav).toHaveCount(0);
  });
});
