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
  await expect(pages.admin.getByRole("heading", { name: `Good day, ${people.admin.first}` })).toBeVisible();

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
    await admin.getByRole("button", { name: "Add Employee" }).click();
    const form = admin.getByRole("dialog").locator("form");
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
  await admin.goto(`/hrportal/hr/employees/${employeeIds.boss}?tab=edit`);
  await admin.locator('select[name="managerId"]').selectOption({ label: `${people.manager.first} ${people.manager.last} — ${people.manager.first}'s job` });
  await admin.getByRole("button", { name: "Save record" }).click();
  await expect(admin.getByRole("main").getByRole("alert")).toContainText("reporting loop");

  for (const key of ["officer", "boss", "manager", "staff", "outsider"] as const) {
    const p = people[key];
    await admin.goto("/hrportal/hr/accounts");
    await admin.getByRole("button", { name: "Create Account" }).click();
    const form = admin.getByRole("dialog").locator("form");
    await form.locator('select[name="employeeId"]').selectOption({ label: `${p.first} ${p.last} — ${p.first}'s job` });
    await form.locator('select[name="roleId"]').selectOption({ label: p.role });
    await form.getByRole("button", { name: /Create account/ }).click();
    const link = await readLink(admin);
    pages[key] = await freshPage();
    await activate(pages[key], link);
  }
  await admin.goto("/hrportal/hr/accounts");
  for (const key of ["officer", "boss", "manager", "staff", "outsider"] as const) {
    const id = await admin.locator('details[id^="account-"]', { has: admin.locator("summary", { hasText: people[key].email }) }).getAttribute("id");
    accountIds[key] = id!.replace("account-", "");
  }
  const adminId = await admin.locator('details[id^="account-"]', { has: admin.locator("summary", { hasText: people.admin.email }) }).getAttribute("id");
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
  await expect(nav(pages.boss).getByRole("link")).toHaveText(["Reports", "My record", "My team"]);
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
  await staff.getByRole("button", { name: "Request Leave" }).click();
  const form = staff.getByRole("dialog").locator("form");
  await form.getByLabel("From", { exact: true }).fill("2026-12-07");
  await form.getByLabel("To", { exact: true }).fill("2026-12-11");
  await form.getByRole("button", { name: "Send request" }).click();
  await expect(form.getByRole("status")).toContainText("5 working days");

  // The manager approves it, and we keep a copy of that request to replay later.
  const manager = pages.manager;
  await manager.goto("/hrportal/team");
  const approve = manager.getByRole("button", { name: `Approve ${people.staff.first} ${people.staff.last}'s leave` });
  const firstLeaveId = await manager.locator("form", { has: approve }).locator('input[name="leaveId"]').inputValue();
  const captured = await captureAction(manager, () => approve.click());
  // Decided requests leave the Pending tab.
  await expect(approve).toHaveCount(0);
  await staff.reload();
  await expect(staff.getByText("by Musa Manager")).toBeVisible();

  // A second request: the employee replays the manager's approval against it from their own session.
  await staff.getByRole("button", { name: "Request Leave" }).click();
  await form.getByLabel("From", { exact: true }).fill("2026-12-14");
  await form.getByLabel("To", { exact: true }).fill("2026-12-15");
  await form.getByRole("button", { name: "Send request" }).click();
  await expect(form.getByRole("status")).toContainText("2 working days");
  await staff.reload();
  const ownLeaveId = await staff.locator('form input[name="leaveId"]').first().inputValue();
  const answer = await replay(staff, captured, [[firstLeaveId, ownLeaveId]]);
  expect(answer).toContain("You don't have permission to do that.");
  // An outsider manager-less employee replaying it gets the same.
  expect(await replay(pages.outsider, captured, [[firstLeaveId, ownLeaveId]])).toContain("You don't have permission to do that.");
  await staff.reload();
  await expect(staff.getByRole("cell", { name: "pending", exact: true })).toBeVisible();
  // Control: the same replay from the manager's own session does go through.
  expect(await replay(manager, captured, [[firstLeaveId, ownLeaveId]])).toContain("Leave approved for Esther Staff");
});

test("HR records leave for others (never themselves) and only HR can export leave", async () => {
  test.skip(!pages.admin, "setup did not run");
  const admin = pages.admin;
  await admin.goto("/hrportal/hr/leave");
  await admin.getByRole("button", { name: "Add Leave Application" }).click();
  const form = admin.getByRole("dialog").locator("form");
  await expect(form.locator('select[name="employeeId"] option', { hasText: `${people.admin.first} ${people.admin.last}` })).toHaveCount(0);
  await form.locator('select[name="employeeId"]').selectOption({ label: `${people.manager.first} ${people.manager.last}` });
  await form.locator('select[name="type"]').selectOption("Study");
  await form.getByLabel("From", { exact: true }).fill("2026-11-16");
  await form.getByLabel("To", { exact: true }).fill("2026-11-17");
  await form.locator('select[name="status"]').selectOption("approved");
  await form.getByRole("button", { name: "Save leave application" }).click();
  await expect(form.getByRole("status")).toContainText("Study Leave recorded");

  const csv = await admin.request.get("/hrportal/hr/leave/export?tab=all");
  expect(csv.headers()["content-type"]).toContain("text/csv");
  expect(await csv.text()).toContain(`${people.staff.first} ${people.staff.last}`);
  for (const key of ["staff", "manager", "boss"] as const) {
    expect((await pages[key].request.get("/hrportal/hr/leave/export?tab=all")).status()).toBe(404);
  }
});

test("departments: heads receive their staff's leave requests, and staff choose their own department", async () => {
  test.skip(!pages.admin, "setup did not run");
  const admin = pages.admin;
  await admin.goto("/hrportal/hr/departments");
  await admin.getByRole("button", { name: "Add LHI's standard departments" }).click();
  await expect(admin.getByRole("main").getByRole("status").first()).toContainText("Added 11 departments");
  await admin.reload();
  const programmes = admin.locator("section", { has: admin.getByRole("heading", { name: "Programmes", exact: true }) });
  await programmes.getByText("Edit department").click();
  await programmes.locator('select[name="headEmployeeId"]').selectOption({ label: `${people.outsider.first} ${people.outsider.last} — ${people.outsider.first}'s job` });
  await programmes.getByRole("button", { name: "Save department" }).click();
  await expect(programmes.getByRole("status")).toContainText("Programmes saved");

  // The employee picks their department and sees who will receive their requests.
  const staff = pages.staff;
  await staff.goto("/hrportal/me");
  await staff.locator('select[name="departmentId"]').selectOption({ label: "Programmes" });
  await staff.getByRole("button", { name: "Save department" }).click();
  await expect(staff.getByRole("main").getByRole("status").first()).toContainText("You're now in Programmes");
  await staff.reload();
  await expect(staff.getByText("Head of Programmes")).toBeVisible();
  await expect(staff.locator("span", { hasText: /^Line manager$/ })).toBeVisible();
  await staff.getByRole("button", { name: "Request Leave" }).click();
  const form = staff.getByRole("dialog").locator("form");
  await form.getByLabel("From", { exact: true }).fill("2027-01-04");
  await form.getByLabel("To", { exact: true }).fill("2027-01-05");
  await form.getByRole("button", { name: "Send request" }).click();
  await expect(form.getByRole("status")).toContainText("2 working days");

  // The head (an ordinary Employee account) now has a team view with the request waiting.
  const head = pages.outsider;
  await head.goto("/hrportal");
  await expect(head).toHaveURL(/\/hrportal\/team$/);
  await expect(head.getByRole("navigation", { name: "HR portal" }).getByRole("link", { name: /My team/ })).toContainText("1");
  const approve = head.getByRole("button", { name: `Approve ${people.staff.first} ${people.staff.last}'s leave` });
  await approve.click();
  await expect(approve).toHaveCount(0);
  // ...but only for their own department.
  expect((await head.goto(`/hrportal/team/${employeeIds.boss}`))?.status()).toBe(404);
  expect((await head.goto(`/hrportal/team/${employeeIds.staff}`))?.status()).toBe(200);

  // Employee export is for HR only.
  const csv = await admin.request.get("/hrportal/hr/employees/export");
  expect(await csv.text()).toContain(people.staff.email);
  for (const key of ["staff", "outsider", "boss"] as const) {
    expect((await pages[key].request.get("/hrportal/hr/employees/export")).status()).toBe(404);
  }
});

test("HR imports employees from CSV and manages their status", async () => {
  test.skip(!pages.admin, "setup did not run");
  const admin = pages.admin;
  await admin.goto("/hrportal/hr/employees");
  await admin.getByRole("button", { name: "Import", exact: true }).click();
  const dialog = admin.getByRole("dialog", { name: "Import employees" });
  await dialog.locator('input[type="file"]').setInputFiles({
    name: "staff.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(`First name,Last name,Email,Designation,Department,Duty station,Status,Line manager email\nAmina,Bello,${mail("amina")},Nurse,Programmes,Sokoto,Probation,${people.manager.email}\nNo,Email,,,,,,\n,MissingFirst,,,,,,\nDup,Admin,${people.admin.email},,,,,\n`),
  });
  await dialog.getByRole("button", { name: "Import employees" }).click();
  await expect(dialog.getByRole("status")).toContainText("Imported 2 employees. Skipped 2");
  await admin.goto("/hrportal/hr/employees?tab=probation");
  await expect(admin.getByRole("link", { name: "Amina Bello", exact: true })).toBeVisible();
  await expect(admin.getByRole("row", { name: /Amina Bello/ }).getByText("Probation")).toBeVisible();
});

test("HR changes a password; the person must choose their own at next sign-in", async () => {
  test.skip(!pages.admin, "setup did not run");
  const admin = pages.admin;
  const who = `${people.manager.first} ${people.manager.last}`;
  await admin.goto("/hrportal/hr/employees");
  await admin.getByRole("row", { name: new RegExp(who) }).getByRole("button", { name: `Change password for ${who}` }).click();
  const dialog = admin.getByRole("dialog", { name: `Change password for ${who}` });
  await dialog.locator('input[name="password"]').fill("Temporary-pass-1");
  await dialog.locator('input[name="confirm"]').fill("Temporary-pass-1");
  await dialog.getByRole("button", { name: "Set password" }).click();
  await expect(dialog.getByRole("status")).toContainText("Password changed");

  const manager = pages.manager;
  await manager.goto("/hrportal/team");
  await expect(manager).toHaveURL(/\/hrportal$/);
  await manager.getByLabel("Email").fill(people.manager.email);
  await manager.getByLabel("Password").fill("Temporary-pass-1");
  await manager.getByRole("button", { name: "Sign in" }).click();
  await expect(manager).toHaveURL(/\/hrportal\/password\?required=1$/);
  // Nothing else opens until they choose their own password.
  await manager.goto("/hrportal/team");
  await expect(manager).toHaveURL(/\/hrportal\/password\?required=1$/);
  await manager.locator('input[name="current"]').fill("Temporary-pass-1");
  await manager.locator('input[name="password"]').fill(PASSWORD);
  await manager.locator('input[name="confirm"]').fill(PASSWORD);
  await manager.getByRole("button", { name: "Change password" }).click();
  await expect(manager).toHaveURL(/\/hrportal\/team$/);
});

test("bank details are visible to the person and HR only; the view page has tabs", async () => {
  test.skip(!pages.admin, "setup did not run");
  const staff = pages.staff;
  await staff.goto("/hrportal/me");
  await staff.getByText("Update bank details").click();
  await staff.locator('input[name="bankName"]').fill("First Bank");
  await staff.locator('input[name="bankAccountName"]').fill("Esther Staff");
  await staff.locator('input[name="bankAccountNumber"]').fill("0123457890");
  await staff.getByRole("button", { name: "Save bank details" }).click();
  await expect(staff.getByRole("main").getByRole("status").last()).toContainText("Banking details saved");

  // Her line manager sees her work details, never her bank account.
  const managerView = await pages.manager.goto(`/hrportal/team/${employeeIds.staff}`);
  expect(managerView?.status()).toBe(200);
  expect(await pages.manager.content()).not.toContain("0123457890");
  expect(await pages.manager.content()).not.toContain("First Bank");

  const admin = pages.admin;
  await admin.goto(`/hrportal/hr/employees/${employeeIds.staff}`);
  await expect(admin.getByRole("heading", { name: "Basic Information" })).toBeVisible();
  await admin.getByRole("link", { name: "Employment", exact: true }).click();
  await expect(admin.getByText("Leave approvers")).toBeVisible();
  await admin.getByRole("link", { name: "Banking", exact: true }).click();
  await expect(admin.getByText("••••••7890")).toBeVisible();
  expect(await admin.content()).not.toContain(">0123457890<");
});

test("HR deletes an employee record created by mistake", async () => {
  test.skip(!pages.admin, "setup did not run");
  const admin = pages.admin;
  await admin.goto("/hrportal/hr/employees");
  const row = admin.getByRole("row", { name: /No Email/ });
  admin.once("dialog", (d) => void d.accept());
  await row.getByRole("button", { name: "Delete No Email" }).click();
  await expect(admin.getByRole("row", { name: /No Email/ })).toHaveCount(0);
  // Nobody can delete their own record, and the delete is audited.
  await expect(admin.getByRole("row", { name: new RegExp(`${people.admin.first} ${people.admin.last}`) }).getByRole("button", { name: /^Delete/ })).toHaveCount(0);
  await admin.goto("/hrportal/hr/audit");
  await expect(admin.getByRole("cell", { name: "deleted employee", exact: true })).toBeVisible();
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

test("leave types, policies and balances: HR sets allowances and requests can't exceed them", async () => {
  test.skip(!pages.admin, "setup did not run");
  const admin = pages.admin;
  const managerName = `${people.manager.first} ${people.manager.last}`;

  await admin.goto("/hrportal/hr/leave/types");
  await admin.getByRole("button", { name: "Add Leave Type" }).click();
  let form = admin.getByRole("dialog").locator("form");
  await form.locator('input[name="name"]').fill("Hajj Leave");
  await form.locator('input[name="defaultDays"]').fill("3");
  await form.getByRole("button", { name: "Create leave type" }).click();
  await expect(form.getByRole("status")).toBeVisible();
  await admin.reload();
  await expect(admin.getByRole("cell", { name: "Hajj Leave" })).toBeVisible();

  await admin.goto("/hrportal/hr/leave/policies");
  await admin.getByRole("button", { name: "Add Leave Policy" }).click();
  form = admin.getByRole("dialog").locator("form");
  await form.locator('input[name="name"]').fill("E2E short allowance");
  await form.locator('input[name="days_Annual"]').fill("5");
  await form.getByRole("button", { name: "Create policy" }).click();
  await expect(form.getByRole("status")).toBeVisible();

  // The policy's 5 days apply at once, and a 6-day request is refused.
  await admin.goto(`/hrportal/hr/leave/balances?emp=${employeeIds.manager}&year=2026`);
  await expect(admin.getByRole("button", { name: /^Annual Leave: Allowance 5 / })).toBeVisible();
  await admin.goto("/hrportal/hr/leave");
  await admin.getByRole("button", { name: "Add Leave Application" }).click();
  form = admin.getByRole("dialog").locator("form");
  await form.locator('select[name="employeeId"]').selectOption({ label: managerName });
  await form.locator('select[name="type"]').selectOption("Annual");
  await form.getByLabel("From", { exact: true }).fill("2026-12-07");
  await form.getByLabel("To", { exact: true }).fill("2026-12-14");
  await form.getByRole("button", { name: "Save leave application" }).click();
  await expect(form.getByRole("alert")).toBeVisible();

  // An adjustment adds days and shows in the breakdown.
  await admin.goto(`/hrportal/hr/leave/balances?emp=${employeeIds.manager}&year=2026`);
  await admin.getByRole("button", { name: "Adjust" }).click();
  form = admin.getByRole("dialog").locator("form");
  await form.locator('select[name="typeId"]').selectOption("Annual");
  await form.locator('input[name="days"]').fill("2");
  await form.locator('input[name="reason"]').fill("Worked on a public holiday");
  await form.getByRole("button", { name: "Save adjustment" }).click();
  await expect(form.getByRole("status")).toBeVisible();
  await admin.reload();
  await expect(admin.getByRole("button", { name: /^Annual Leave: Allowance 5 \+ adjusted 2/ })).toBeVisible();

  // Staff and managers can't reach leave settings.
  for (const path of ["/hrportal/hr/leave/types", "/hrportal/hr/leave/policies", "/hrportal/hr/leave/balances"]) {
    await pages.staff.goto(path);
    await expect(pages.staff).toHaveURL(/denied=1$/);
  }

  await admin.goto("/hrportal/hr/leave/policies");
  admin.once("dialog", (d) => void d.accept());
  await admin.getByRole("button", { name: "Delete" }).click();
  await expect(admin.getByText("E2E short allowance")).toHaveCount(0);
});

test("HR loads sample records for testing and removes them in one go", async () => {
  test.skip(!pages.admin, "setup did not run");
  const admin = pages.admin;
  await admin.goto("/hrportal/hr");
  await admin.getByLabel(/Password for sample logins/).fill(PASSWORD);
  await admin.getByRole("button", { name: "Load sample data" }).click();
  await expect(admin.getByRole("main").getByRole("status")).toContainText("Loaded 5 sample employees");
  await admin.goto("/hrportal/hr/employees?q=SAMPLE");
  await expect(admin.getByText("SAMPLE-005")).toBeVisible();

  // A sample login works with its role's limits.
  const sample = await freshPage();
  await signIn(sample, "aisha.bello.sample@example.test");
  await expect(sample).toHaveURL(/\/hrportal\/team/);
  await sample.goto("/hrportal/hr/employees");
  await expect(sample).toHaveURL(/denied=1$/);

  await admin.goto("/hrportal/hr");
  admin.once("dialog", (d) => void d.accept());
  await admin.getByRole("button", { name: "Remove sample data" }).click();
  await expect(admin.getByRole("main").getByRole("status")).toContainText("Removed 5 sample employees");
  await admin.goto("/hrportal/hr/employees?q=SAMPLE");
  await expect(admin.getByText("SAMPLE-001")).toHaveCount(0);
  await sample.goto("/hrportal/me");
  await expect(sample).toHaveURL(/\/hrportal(\?.*)?$/);
});

test("the public website stays open to everyone", async ({ page }) => {
  for (const path of ["/", "/careers", "/about"]) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
  }
  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /hrportal");
});
