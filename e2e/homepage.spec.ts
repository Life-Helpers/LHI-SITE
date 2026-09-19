import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("renders hero, nav, and featured programs", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Health, education, and livelihood programs across Northern Nigeria\./,
      }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Donate now" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Our Focus Areas" }),
    ).toBeVisible();
  });

  test("no crisis banner renders when there are no active alerts", async ({
    page,
  }) => {
    await page.goto("/");

    // Next.js itself renders a hidden, always-present role="alert" route
    // announcer for a11y — this is not our banner, so it staying present is
    // expected. There is currently no real declared emergency, so our own
    // banner (which would have visible text) must not render.
    const banner = page.getByRole("alert").filter({ hasText: /\S/ });
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
    await expect(mobileNav.getByRole("link", { name: "Get Involved" })).toBeVisible();

    // "What We Do" is a disclosure (<details>/<summary>) in the mega menu,
    // not a flat link — confirm it expands to reveal a program link.
    await mobileNav.getByText("What We Do").click();
    await expect(mobileNav.getByRole("link", { name: "Health" })).toBeVisible();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(mobileNav).toHaveCount(0);
  });
});
