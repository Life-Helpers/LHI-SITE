import { gunzipSync } from "node:zlib";

import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";

/**
 * HR portal end to end: first-time setup, every role's dashboard, and the ways people might
 * try to get at what they shouldn't (URLs, forged cookies, replayed server actions, granting
 * themselves access), plus role changes and deactivation taking effect on live sessions.
 *
 * Needs a fresh data store (no HR accounts yet), e.g. the dev server with an empty CMS_DATA_DIR.
 */

test.describe.configure({ mode: "serial" });
test.setTimeout(120_000);

const PASSWORD = "Portal-test-2026";
const run = Date.now().toString(36);
const mail = (who: string) => `${who}.${run}@lhi-e2e.test`;

let browserRef: Browser;
const contexts: BrowserContext[] = [];
async function freshPage(): Promise<Page> {
  const ctx = await browserRef.newContext();
  contexts.push(ctx);
  return ctx.newPage();
}

const people = {
  admin: { first: "Halima", last: "Admin", email: mail("admin") },
  officer: { first: "Hauwa", last: "Officer", email: mail("officer"), role: "HR Officer" },
  boss: { first: "Grace", last: "Director", email: mail("boss"), role: "Management" },
  manager: { first: "Musa", last: "Manager", email: mail("manager"), role: "Manager" },
  staff: { first: "Esther", last: "Staff", email: mail("staff"), role: "Employee" },
  outsider: { first: "Ola", last: "Outsider", email: mail("outsider"), role: "Employee" },
};
type Key = keyof typeof people;
const pages = {} as Record<Key, Page>;
const employeeIds = {} as Record<Key, string>;
const accountIds = {} as Record<Key, string>;

async function readLink(page: Page) {
  const link = page.getByLabel("One-time link");
  await expect(link).toBeVisible();
  return link.inputValue();
}

async function activate(page: Page, link: string) {
  await page.goto(link);
  await page.getByLabel("New password").fill(PASSWORD);
  await page.getByLabel("Repeat the password").fill(PASSWORD);
  await page.getByRole("button", { name: "Save password and sign in" }).click();
  await page.waitForURL((url) => !url.pathname.startsWith("/hrportal/activate"));
}

async function signIn(page: Page, email: string) {
  await page.goto("/hrportal");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
}

/** Capture the next server-action POST a page sends, to replay it from someone else's session. */
async function captureAction(page: Page, trigger: () => Promise<void>) {
  const requestPromise = page.waitForRequest((r) => r.method() === "POST" && Boolean(r.headers()["next-action"]));
  await trigger();
  const req = await requestPromise;
  return { url: req.url(), headers: await req.allHeaders(), body: req.postDataBuffer()! };
}

async function replay(page: Page, captured: Awaited<ReturnType<typeof captureAction>>, swap: [string, string][] = []) {
  let body = captured.body.toString("latin1");
  for (const [from, to] of swap) body = body.split(from).join(to);
  const headers = Object.fromEntries(
    Object.entries(captured.headers).filter(([k]) => ["next-action", "content-type", "next-router-state-tree", "accept"].includes(k)),
  );
  const res = await page.request.post(captured.url, { headers, data: Buffer.from(body, "latin1") });
  return res.text();
}

test.beforeAll(async ({ browser }) => {
  browserRef = browser;
});
test.afterAll(async () => {
  for (const c of contexts) await c.close();
});

test("the portal is protected and set up by a website administrator", async ({ page }) => {
  await page.goto("/hrportal");
  test.skip(!(await page.getByText("has no accounts yet").isVisible()), "HR portal already set up in this data store; run against a fresh one.");

  // Protected pages send signed-out visitors to the one sign-in URL.
  for (const path of ["/hrportal/me", "/hrportal/team", "/hrportal/hr", "/hrportal/hr/accounts", "/hrportal/reports"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/hrportal$/);
  }
  // Setup is closed to anyone not signed in to the website admin.
  await page.goto("/hrportal/setup");
  await expect(page.getByText("Website administrators only")).toBeVisible();

  // Website administrator signs in (first-run Admin / Admin) and creates the first HR Administrator.
  await page.goto("/admin/login");
  await page.getByLabel(/email/i).fill("Admin");
  await page.getByLabel(/password/i).fill("Admin");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/admin\/welcome/);
  await page.locator('input[name="name"]').fill("Web Admin");
  await page.locator('input[name="email"]').fill(mail("webadmin"));
  await page.locator('input[name="password"]').fill(PASSWORD);
  await page.locator('input[name="confirm"]').fill(PASSWORD);
  await page.getByRole("button", { name: /save and open/i }).click();
  await page.waitForURL(/\/admin$/);

  await page.goto("/hrportal/setup");
  await page.getByLabel("First name").fill(people.admin.first);
  await page.getByLabel("Last name").fill(people.admin.last);
  await page.getByLabel("Work email").fill(people.admin.email);
  await page.getByRole("button", { name: "Create HR Administrator" }).click();
  const link = await readLink(page);

  // Website backups never include HR records.
  const backup = await page.request.get("/api/admin/backup");
  expect(backup.ok()).toBe(true);
  expect(gunzipSync(await backup.body()).toString("latin1")).not.toContain("hrAccounts");

  pages.admin = await freshPage();
  await activate(pages.admin, link);
  await expect(pages.admin).toHaveURL(/\/hrportal\/hr$/);
  await expect(pages.admin.getByRole("heading", { name: "HR overview" })).toBeVisible();

  // Setup closes once an account exists.
  await page.goto("/hrportal/setup");
  await expect(page.getByText("Already set up")).toBeVisible();
});

test("an HR administrator creates employee records, reporting lines and accounts", async () => {
  const admin = pages.admin;
  test.skip(!admin, "setup did not run");
  const add = async (key: Key, managerKey?: Key) => {
    const p = people[key];
    await admin.goto("/hrportal/hr/employees");
    const form = admin.locator("form", { has: admin.getByRole("button", { name: "Add employee" }) });
    await form.getByLabel("First name").fill(p.first);
    await form.getByLabel("Last name").fill(p.last);
    await form.getByLabel("Work email").fill(p.email);
    await form.getByLabel("Job title").fill(`${p.first}'s job`);
    if (managerKey) await form.locator('select[name="managerId"]').selectOption({ label: `${people[managerKey].first} ${people[managerKey].last} — ${people[managerKey].first}'s job` });
    await form.getByRole("button", { name: "Add employee" }).click();
    await expect(form.getByRole("status")).toContainText("added");
    await admin.reload();
    const href = await admin.getByRole("link", { name: `${p.first} ${p.last}`, exact: true }).getAttribute("href");
    employeeIds[key] = href!.split("/").pop()!;
  };
  await add("officer");
  await add("boss");
  await add("manager", "boss");
  await add("staff", "manager");
  await add("outsider");

  // Reporting loops are refused: the director can't report to her own report.
  await admin.goto(`/hrportal/hr/employees/${employeeIds.boss}`);
  await admin.locator('select[name="managerId"]').selectOption({ label: `${people.manager.first} ${people.manager.last} — ${people.manager.first}'s job` });
  await admin.getByRole("button", { name: "Save record" }).click();
  await expect(admin.getByRole("main").getByRole("alert")).toContainText("reporting loop");

  for (const key of ["officer", "boss", "manager", "staff", "outsider"] as const) {
    const p = people[key];
    await admin.goto("/hrportal/hr/accounts");
    const form = admin.locator("form", { has: admin.getByRole("button", { name: /Create account/ }) });
    await form.locator('select[name="employeeId"]').selectOption({ label: `${p.first} ${p.last} — ${p.first}'s job` });
    await form.locator('select[name="roleId"]').selectOption({ label: p.role });
    await form.getByRole("button", { name: /Create account/ }).click();
    const link = await readLink(admin);
    pages[key] = await freshPage();
    await activate(pages[key], link);
  }
  await admin.goto("/hrportal/hr/accounts");
  for (const key of ["officer", "boss", "manager", "staff", "outsider"] as const) {
    const id = await admin.locator("details", { has: admin.locator("summary", { hasText: people[key].email }) }).getAttribute("id");
    accountIds[key] = id!.replace("account-", "");
  }
  const adminId = await admin.locator("details", { has: admin.locator("summary", { hasText: people.admin.email }) }).getAttribute("id");
  accountIds.admin = adminId!.replace("account-", "");
});

test("each role lands on its own dashboard and sees only its own navigation", async () => {
  test.skip(!pages.staff, "setup did not run");
  await pages.staff.goto("/hrportal");
  await expect(pages.staff).toHaveURL(/\/hrportal\/me$/);
  await pages.manager.goto("/hrportal");
  await expect(pages.manager).toHaveURL(/\/hrportal\/team$/);
  await pages.boss.goto("/hrportal");
  await expect(pages.boss).toHaveURL(/\/hrportal\/reports$/);
  await pages.officer.goto("/hrportal");
  await expect(pages.officer).toHaveURL(/\/hrportal\/hr$/);

  const nav = (p: Page) => p.getByRole("navigation", { name: "HR portal" });
  await expect(nav(pages.staff).getByRole("link")).toHaveText(["My record"]);
  await expect(nav(pages.manager).getByRole("link")).toHaveText(["My record", "My team"]);
  await expect(nav(pages.boss).getByRole("link")).toHaveText(["My record", "My team", "Reports"]);
  await expect(nav(pages.officer).getByRole("link", { name: "Accounts" })).toHaveCount(0);
  await expect(nav(pages.admin).getByRole("link", { name: "Accounts" })).toHaveCount(1);
});

test("people can't open pages or records outside their access by typing a URL", async () => {
  test.skip(!pages.staff, "setup did not run");
  const staff = pages.staff;
  for (const path of ["/hrportal/hr", "/hrportal/hr/accounts", "/hrportal/hr/employees", "/hrportal/hr/audit", "/hrportal/team", "/hrportal/reports"]) {
    await staff.goto(path);
    await expect(staff).toHaveURL(/\/hrportal\/me\?denied=1$/);
  }
  await staff.goto(`/hrportal/hr/employees/${employeeIds.outsider}`);
  await expect(staff).toHaveURL(/\/hrportal\/me\?denied=1$/);

  // A manager sees their own report, but not someone outside their line, whatever the id.
  const manager = pages.manager;
  await manager.goto(`/hrportal/team/${employeeIds.staff}`);
  await expect(manager.getByRole("heading", { name: `${people.staff.first} ${people.staff.last}` })).toBeVisible();
  const outside = await manager.goto(`/hrportal/team/${employeeIds.outsider}`);
  expect(outside?.status()).toBe(404);
  const boss = await manager.goto(`/hrportal/team/${employeeIds.boss}`);
  expect(boss?.status()).toBe(404);
  await manager.goto(`/hrportal/hr/employees/${employeeIds.outsider}`);
  await expect(manager).toHaveURL(/\/hrportal\/team\?denied=1$/);

  // HR officers run HR operations but can't manage accounts or roles.
  await pages.officer.goto("/hrportal/hr/accounts");
  await expect(pages.officer).toHaveURL(/\/hrportal\/hr\?denied=1$/);
  await pages.officer.goto("/hrportal/hr/roles");
  await expect(pages.officer).toHaveURL(/\/hrportal\/hr\?denied=1$/);

  // Management sees totals, not people's records.
  await pages.boss.goto("/hrportal/hr/employees");
  await expect(pages.boss).toHaveURL(/\/hrportal\/reports\?denied=1$/);
});

test("a forged or edited session cookie gets nowhere", async () => {
  test.skip(!pages.staff, "setup did not run");
  const page = await freshPage();
  const forged = Buffer.from(JSON.stringify({ aid: accountIds.admin, v: 1, exp: Math.floor(Date.now() / 1000) + 3600, n: "x" })).toString("base64url");
  const real = (await pages.staff.context().cookies()).find((c) => c.name === "lhi_hr_session")!;
  await page.context().addCookies([{ ...real, value: `${forged}.${real.value.split(".")[1]}` }]);
  await page.goto("/hrportal/hr/accounts");
  await expect(page).toHaveURL(/\/hrportal$/);
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
});

test("leave goes from employee to manager, and nobody can approve their own", async () => {
  test.skip(!pages.staff, "setup did not run");
  const staff = pages.staff;
  await staff.goto("/hrportal/me");
  const form = staff.locator("form", { has: staff.getByRole("button", { name: "Send request" }) });
  await form.getByLabel("From").fill("2026-12-07");
  await form.getByLabel("To").fill("2026-12-11");
  await form.getByRole("button", { name: "Send request" }).click();
  await expect(form.getByRole("status")).toContainText("5 working days");

  // The manager approves it, and we keep a copy of that request to replay later.
  const manager = pages.manager;
  await manager.goto("/hrportal/team");
  const decision = manager.locator("form", { has: manager.getByRole("button", { name: "Save" }) }).first();
  const firstLeaveId = await decision.locator('input[name="leaveId"]').inputValue();
  const captured = await captureAction(manager, () => decision.getByRole("button", { name: "Save" }).click());
  // Decided requests move from "awaiting your decision" to the team's leave history.
  await expect(manager.getByText("approved by Musa Manager")).toBeVisible();
  await staff.reload();
  await expect(staff.getByText("approved by Musa Manager")).toBeVisible();

  // A second request: the employee replays the manager's approval against it from their own session.
  await form.getByLabel("From").fill("2026-12-14");
  await form.getByLabel("To").fill("2026-12-15");
  await form.getByRole("button", { name: "Send request" }).click();
  await expect(form.getByRole("status")).toContainText("2 working days");
  await staff.reload();
  const ownLeaveId = await staff.locator('form input[name="leaveId"]').first().inputValue();
  const answer = await replay(staff, captured, [[firstLeaveId, ownLeaveId]]);
  expect(answer).toContain("You don't have permission to do that.");
  // An outsider manager-less employee replaying it gets the same.
  expect(await replay(pages.outsider, captured, [[firstLeaveId, ownLeaveId]])).toContain("You don't have permission to do that.");
  await staff.reload();
  await expect(staff.getByRole("cell", { name: "pending" })).toBeVisible();
  // Control: the same replay from the manager's own session does go through.
  expect(await replay(manager, captured, [[firstLeaveId, ownLeaveId]])).toContain("Leave approved for Esther Staff");
});

test("nobody can raise their own access, even by replaying an administrator's request", async () => {
  test.skip(!pages.staff, "setup did not run");
  const admin = pages.admin;
  await admin.goto("/hrportal/hr/accounts");
  const staffRow = admin.locator(`#account-${accountIds.staff}`);
  await staffRow.locator("summary").click();
  await staffRow.locator('select[name="roleId"]').selectOption({ label: "Manager" });
  const captured = await captureAction(admin, () => staffRow.getByRole("button", { name: "Change role" }).click());
  await expect(staffRow.getByRole("status")).toContainText("Role changed to Manager");

  // The HR officer (no account management) replays it to make themselves HR Administrator.
  const asOfficer = await replay(pages.officer, captured, [
    [accountIds.staff, accountIds.officer],
    ["manager", "hr_admin"],
  ]);
  expect(asOfficer).toContain("You don't have permission to do that.");
  // The administrator can't change their own account either.
  const asSelf = await replay(admin, captured, [[accountIds.staff, accountIds.admin], ["manager", "employee"]]);
  expect(asSelf).toContain("You can't change your own account");
  // Control: the administrator's replay against another account does reach the action.
  expect(await replay(admin, captured)).toContain("No change.");

  await pages.officer.reload();
  await expect(pages.officer.getByText(people.officer.first, { exact: false }).first()).toBeVisible();
  await expect(pages.officer.getByRole("navigation", { name: "HR portal" }).getByRole("link", { name: "Accounts" })).toHaveCount(0);
});

test("a role change ends the person's session and applies at their next sign-in", async () => {
  test.skip(!pages.staff, "setup did not run");
  const staff = pages.staff;
  await staff.goto("/hrportal/me");
  await expect(staff).toHaveURL(/\/hrportal$/);
  await signIn(staff, people.staff.email);
  await expect(staff).toHaveURL(/\/hrportal\/team$/);
});

test("a deactivated account loses access at once and can't sign in", async () => {
  test.skip(!pages.outsider, "setup did not run");
  const admin = pages.admin;
  await admin.goto("/hrportal/hr/accounts");
  const row = admin.locator(`#account-${accountIds.outsider}`);
  await row.locator("summary").click();
  admin.once("dialog", (d) => void d.accept());
  await row.getByRole("button", { name: "Deactivate account" }).click();
  await expect(row.getByRole("status")).toContainText("deactivated");

  const outsider = pages.outsider;
  await outsider.goto("/hrportal/me");
  await expect(outsider).toHaveURL(/\/hrportal$/);
  await signIn(outsider, people.outsider.email);
  await expect(outsider.getByRole("main").getByRole("alert")).toContainText("deactivated");

  // Every change above is in the audit trail.
  await admin.goto("/hrportal/hr/audit");
  for (const action of ["created account", "changed role", "deactivated account", "approved leave", "created first HR administrator"]) {
    await expect(admin.getByRole("cell", { name: action, exact: true }).first()).toBeVisible();
  }
});

test("the public website stays open to everyone", async ({ page }) => {
  for (const path of ["/", "/careers", "/about"]) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
  }
  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /hrportal");
});
