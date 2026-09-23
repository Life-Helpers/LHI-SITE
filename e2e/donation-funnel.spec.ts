import { test, expect } from "@playwright/test";

test.describe("donate page", () => {
  test("validates the email and shows an honest notice when card payments aren't configured", async ({
    page,
  }) => {
    await page.goto("/donate");

    await page.getByTestId("donate-one_time-100").click();
    await page.locator("#d-name").fill("Amina Bello");
    await page.locator("#d-email").fill("not-an-email");
    await page.locator('form button[type="submit"]').click();
    // The browser's own email validation blocks submission.
    expect(await page.locator("#d-email").evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);

    // No Stripe keys in this environment: the page must say so, never fake a success.
    await page.locator("#d-email").fill("amina@example.org");
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText(/Online card payments aren't available yet/)).toBeVisible();
    await expect(page).toHaveURL(/\/donate/);
  });

  test("a custom amount replaces the preset", async ({ page }) => {
    await page.goto("/donate");
    await page.getByTestId("donate-one_time-100").click();
    await page.locator("#d-custom").fill("250");
    await expect(page.locator("#d-custom")).toHaveValue("250");
  });

  test("checkout API refuses instead of simulating a payment", async ({ request }) => {
    const res = await request.post("/api/donations/checkout", {
      data: { frequency: "one_time", custom_amount: 50, donor_email: "a@example.org" },
    });
    expect(res.status()).toBe(503);
    expect((await res.json()).unavailable).toBe(true);
  });
});
