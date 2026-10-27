import { expect, test } from "@playwright/test";

/** The HR portal moved to its own app (Life-Helpers/LHI-HR-Portal); the website no longer has it. */
test("the website has no HR portal", async ({ request }) => {
  for (const path of ["/hrportal", "/hrportal/setup", "/hrportal/payslips"]) {
    const res = await request.get(path, { maxRedirects: 0 });
    expect(res.status()).toBe(404);
  }
});
