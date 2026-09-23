import { test, expect } from "@playwright/test";

test.describe("accountability pages", () => {
  test("feedback form logs a complaint and returns a reference", async ({ page }) => {
    await page.goto("/feedback");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("accountability");
    await page.getByText("Complaint", { exact: true }).click();
    await page.locator("textarea[name=message]").fill("The borehole in our community has not worked for two weeks.");
    await page.locator("input[name=email]").fill("tester@example.org");
    await page.locator("input[name=consent]").check();
    await page.getByRole("button", { name: "Send feedback" }).click();
    await expect(page.getByRole("status")).toContainText("Your reference is");
  });

  test("feedback requires consent", async ({ request }) => {
    const res = await request.post("/api/feedback", { data: { feedbackType: "Question", message: "When is the next training?" } });
    expect(res.status()).toBe(400);
  });

  test("fact sheet shows key figures and downloads", async ({ page, request }) => {
    await page.goto("/fact-sheet");
    await expect(page.getByText("5,700", { exact: true })).toBeVisible();
    await expect(page.getByText("37,050", { exact: true })).toBeVisible();
    for (const href of [
      "/documents/wfp-resilience-project-fact-sheet.pdf",
      "/documents/wfp-resilience-project-progress-dashboard.pptx",
      "/documents/ihp-presentation-work-done-and-success-stories.pdf",
      "/documents/sif-zoa-gsla-presentation.pdf",
      "/documents/agric-livelihood-needs-assessment-2026.pdf",
    ]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
      expect((await request.head(href)).ok()).toBe(true);
    }
    await page.getByRole("button", { name: "Next slide" }).first().click();
    await expect(page.getByText(/^2 \/ \d+$/).first()).toBeVisible();
  });

  test("brochure is viewable and downloadable", async ({ page, request }) => {
    await page.goto("/brochure");
    await expect(page.getByRole("img", { name: /Resilience Hub/ })).toBeVisible();
    expect((await request.head("/documents/noma-tushen-arziki-farmer-service-center-brochure.pdf")).ok()).toBe(true);
  });

  test("news & newsletter page now lives on the blog", async ({ page }) => {
    await page.goto("/news-updates");
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.locator("#publications")).toBeAttached();
    await expect(page.locator("#subscribe")).toBeAttached();
  });

  test("radio page is the Radio Program", async ({ page }) => {
    await page.goto("/vop");
    await expect(page).toHaveURL(/\/radio$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Voices that");
  });
});
