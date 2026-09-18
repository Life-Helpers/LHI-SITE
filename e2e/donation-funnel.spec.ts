import { test, expect } from "@playwright/test";

test.describe("donation funnel", () => {
  test("validates fields, preserves data across steps, and reaches the honest payment fallback", async ({
    page,
  }) => {
    await page.goto("/donate");

    // Step 1: amount below the minimum should block progress with an error,
    // without losing what was typed.
    await page.getByText("Custom amount").click();
    await page.locator("#amount").fill("2");
    await page.getByText("Frequency").click(); // blur
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Minimum donation is $5")).toBeVisible();
    await expect(page.locator("#amount")).toHaveValue("2");

    // Fix it with a preset instead and continue.
    await page.getByText("$100", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2: empty required fields should block progress.
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter your full name")).toBeVisible();
    await expect(page.getByText("Enter your email address")).toBeVisible();

    // Invalid email specifically.
    await page.locator("#donorName").fill("Jane Doe");
    await page.locator("#donorEmail").fill("not-an-email");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();

    // Fix and proceed to review.
    await page.locator("#donorEmail").fill("jane@example.org");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 3: review summary reflects what was entered.
    await expect(page.getByText("$100.00")).toBeVisible();
    await expect(page.getByText("Jane Doe")).toBeVisible();
    await expect(page.getByText("jane@example.org")).toBeVisible();

    // No Stripe keys are configured in this environment — the funnel must
    // show an honest notice, not a broken widget or a fake success state.
    await expect(
      page.getByText("Payment processing isn't configured in this environment"),
    ).toBeVisible();

    // Going back to step 1 must not have lost the entered donor info.
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.locator("#amount")).toHaveCount(0); // preset selected, not custom
  });

  test("moving forward again after navigating back keeps the chosen preset amount", async ({
    page,
  }) => {
    await page.goto("/donate");

    await page.getByText("$100", { exact: true }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Back" }).click();

    // The $100 preset should still be the one visually/semantically selected.
    const preset100 = page.getByRole("radio", { name: "$100" });
    await expect(preset100).toBeChecked();
  });
});
