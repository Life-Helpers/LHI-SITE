import { expect, test } from "@playwright/test";

test("operational map shows state details when a state is selected", async ({ page }) => {
  await page.goto("/interventions/projectandintervention");
  await page.locator('path[aria-label^="Borno"]').click();
  await expect(page.getByRole("heading", { name: "Borno State" })).toBeVisible();
  await expect(page.getByRole("link", { name: /ALIMA Emergency Medico-Nutrition/ })).toBeVisible();
});

test("project dossier links to a downloadable factsheet PDF", async ({ page, request }) => {
  await page.goto("/interventions/eu-unicef-rmnch-sokoto");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("RMNCH+NM Quality of Care");
  const res = await request.get("/interventions/eu-unicef-rmnch-sokoto/factsheet");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
});

test("NIDAKE calculator converts kits into school days saved", async ({ page }) => {
  await page.goto("/nidake");
  await page.getByLabel("Number of dignity kits to sponsor").fill("4");
  await expect(page.getByText("720", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sponsor 4 kits" })).toHaveAttribute(
    "href",
    "/donate?amount=60&designation=nidake&kits=4",
  );
});

test("partner portal accepts an expression of interest", async ({ page }) => {
  await page.goto("/partner-portal");
  await page.getByLabel("Organization").fill("Example INGO");
  await page.getByLabel("Contact person").fill("Amina Bello");
  await page.getByLabel("Work email").fill("amina@example.org");
  await page.getByLabel("Opportunity details").fill("Resilience consortium for the North-East call.");
  await page.getByRole("button", { name: /Submit to partnerships team/ }).click();
  await expect(page.getByText("Submission received")).toBeVisible();
});
