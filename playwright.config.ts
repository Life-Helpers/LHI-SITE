import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  // A single dev-server target gains nothing from parallel workers, and
  // concurrent hits to not-yet-compiled routes under Next's dev-mode
  // on-demand compilation caused flaky timeouts in this sandbox.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL,
    // Suppress the seasonal anniversary popup so it doesn't cover pages under test
    // (e2e/anniversary.spec.ts opts back in).
    storageState: {
      cookies: [],
      origins: [{ origin: baseURL, localStorage: [{ name: "lhi_anniversary_22", value: '{"subscribed":true}' }] }],
    },
    trace: "on-first-retry",
    // Only set for local sandboxes with a mismatched pre-installed browser
    // cache; CI and normal dev machines resolve the browser normally via
    // `npx playwright install`.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : undefined,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
