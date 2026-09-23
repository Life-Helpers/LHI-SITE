import { test, expect } from "@playwright/test";

test("site search finds stories, projects and pages", async ({ page }) => {
  await page.goto("/search?q=savings");
  await expect(page.getByRole("status")).toContainText("results for");
  await expect(page.locator('a[href="/blog/gsla-small-steps-big-impact"]')).toBeVisible();
});

test("header search button opens the search page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Search the site" }).first().click();
  await expect(page).toHaveURL(/\/search$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Search the site");
});

test("My learning asks visitors to sign in first", async ({ page }) => {
  await page.goto("/get-involved/training/my-learning");
  await expect(page).toHaveURL(/\/get-involved\/training\/login\?next=/);
});

test("get involved shows volunteer openings", async ({ page }) => {
  await page.goto("/get-involved");
  await expect(page.getByText("Current volunteer openings")).toBeVisible();
});

test("public forms reject bursts from one connection", async ({ request }) => {
  let limited = false;
  for (let i = 0; i < 12 && !limited; i++) {
    const res = await request.post("/api/feedback", {
      data: { feedbackType: "Question", message: `Rate limit check number ${i}.`, consent: true, anonymous: true },
      headers: { "x-forwarded-for": "203.0.113.77" },
    });
    limited = res.status() === 429;
  }
  expect(limited).toBe(true);
});
