"use server";

import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logActivity } from "@/lib/cms/activity";
import { deletePrivateUpload } from "@/lib/cms/private-uploads";
import {
  AuthError,
  checkSetupToken,
  clearLoginFailures,
  createSession,
  destroySession,
  hashPassword,
  hasAnyUsers,
  loginLocked,
  recordLoginFailure,
  requireUser,
  resolveRole,
  validatePasswordStrength,
  verifyPassword,
} from "@/lib/cms/auth";
import {
  COLLECTIONS,
  ALL_PERMISSIONS,
  can,
  isCollectionName,
  slugify,
  type CmsSettings,
  type CmsUser,
  type PublicUser,
  type Role,
  type SubmissionStatus,
} from "@/lib/cms/schema";
import { readStore, UPLOADS_DIR, updateStore, writeSettings } from "@/lib/cms/store";
import type { FieldErrors } from "@/lib/cms/validate";
import { validateRecord } from "@/lib/cms/validate";

export interface ActionResult {
  ok: boolean;
  error?: string;
  errors?: FieldErrors;
  id?: string;
  /** Non-secret form values echoed back so a failed form submission keeps what was typed. */
  values?: Record<string, string>;
}

function refreshSite() {
  revalidatePath("/", "layout");
}

async function guard(fn: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, error: err.message };
    // Let Next.js redirects and notFound() propagate.
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("[admin action]", err);
    return { ok: false, error: "Something went wrong while saving. Please try again." };
  }
}

const normEmail = (v: FormDataEntryValue | null) => String(v ?? "").trim().toLowerCase();

/* ------------------------------------------------------------------ Auth */

export async function loginAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const email = normEmail(form.get("email"));
  const password = String(form.get("password") ?? "");
  const values = { email };
  if (!email || !password) return { ok: false, error: "Enter your email and password.", values };
  if (loginLocked(email)) return { ok: false, error: "Too many failed attempts. Try again in 15 minutes.", values };

  const user = (await readStore("users")).find((u) => u.email === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    recordLoginFailure(email);
    return { ok: false, error: "Incorrect email or password.", values };
  }
  clearLoginFailures(email);
  await updateStore("users", (items) => ({
    items: items.map((u) => (u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u)),
  }));
  await createSession(user.id);
  await logActivity(user, "logged in", "Admin");
  redirect("/admin");
}

export async function setupAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const name = String(form.get("name") ?? "").trim();
  const email = normEmail(form.get("email"));
  const password = String(form.get("password") ?? "");
  const fail = (error: string): ActionResult => ({ ok: false, error, values: { name, email } });

  if (await hasAnyUsers()) return fail("Setup has already been completed. Please log in.");
  if (!checkSetupToken(String(form.get("token") ?? ""))) {
    return fail("Invalid setup token. Set CMS_SETUP_TOKEN on the server and enter it here.");
  }
  if (!name) return fail("Enter your name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Enter a valid email address.");
  const weak = validatePasswordStrength(password);
  if (weak) return fail(weak);

  const user: CmsUser = {
    id: randomUUID(),
    name,
    email,
    role: "administrator",
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  const created = await updateStore("users", (items) =>
    items.length > 0 ? { items, result: false } : { items: [user], result: true },
  );
  if (!created) return { ok: false, error: "Setup has already been completed. Please log in." };
  await createSession(user.id);
  await logActivity(user, "completed setup and created account", name);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------ Collections */

export async function saveItemAction(
  collection: string,
  originalId: string | null,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  return guard(async () => {
    if (!isCollectionName(collection)) return { ok: false, error: "Unknown collection." };
    const def = COLLECTIONS[collection];
    const user = await requireUser(def.permission);
    if (def.fixed && !originalId) return { ok: false, error: `${def.label} cannot be added.` };

    const { record, errors } = validateRecord(def, values);
    if (Object.keys(errors).length) return { ok: false, errors, error: "Please fix the highlighted fields." };

    const isPost = collection === "posts";
    const items = (await readStore(collection)) as unknown as Record<string, unknown>[];
    const existing = originalId ? items.find((i) => i.id === originalId) : undefined;
    if (originalId && !existing) return { ok: false, error: "This item no longer exists." };

    if (isPost && !can(user, "posts.all") && existing && existing.authorId !== user.id) {
      return { ok: false, error: "Authors can only edit their own posts." };
    }

    // Posts keep a stable internal id; other collections use their slug field as id.
    const hasIdField = def.fields.some((f) => f.name === "id");
    const id = def.fixed ? originalId! : hasIdField ? String(record.id) : String(existing?.id ?? randomUUID());
    const uniqueKey = isPost ? "slug" : "id";
    const clash = items.find((i) => i[uniqueKey] === record[uniqueKey] && i.id !== originalId);
    if (clash && !def.fixed) {
      return { ok: false, errors: { [uniqueKey]: "Another item already uses this value." }, error: "Please fix the highlighted fields." };
    }

    const next: Record<string, unknown> = { ...existing, ...record, id };
    if (isPost) {
      next.authorId = existing?.authorId || user.id;
      next.author = String(record.author || existing?.author || user.name);
      next.updatedAt = new Date().toISOString();
    }

    await updateStore(collection, (current) => {
      const list = current as unknown as Record<string, unknown>[];
      const updated = existing ? list.map((i) => (i.id === originalId ? next : i)) : [next, ...list];
      return { items: updated as never };
    });

    await logActivity(user, existing ? `updated ${def.singular.toLowerCase()}` : `created ${def.singular.toLowerCase()}`, String(next[def.titleField] ?? id), `/admin/content/${collection}/${encodeURIComponent(id)}`);
    refreshSite();
    return { ok: true, id };
  });
}

export async function deleteItemAction(collection: string, id: string): Promise<ActionResult> {
  return guard(async () => {
    if (!isCollectionName(collection)) return { ok: false, error: "Unknown collection." };
    const def = COLLECTIONS[collection];
    const user = await requireUser(def.permission);
    if (def.fixed) return { ok: false, error: `${def.label} cannot be deleted.` };

    const items = (await readStore(collection)) as unknown as Record<string, unknown>[];
    const item = items.find((i) => i.id === id);
    if (!item) return { ok: false, error: "This item no longer exists." };
    if (collection === "posts" && !can(user, "posts.all") && item.authorId !== user.id) {
      return { ok: false, error: "Authors can only delete their own posts." };
    }

    await updateStore(collection, (current) => ({
      items: (current as unknown as Record<string, unknown>[]).filter((i) => i.id !== id) as never,
    }));
    await logActivity(user, `deleted ${def.singular.toLowerCase()}`, String(item[def.titleField] ?? id));
    refreshSite();
    return { ok: true };
  });
}

/* --------------------------------------------------------------- Settings */

export async function saveSettingsAction(settings: CmsSettings): Promise<ActionResult> {
  return guard(async () => {
    const user = await requireUser("settings");
    const num = (v: unknown, min: number) => {
      const n = Number(v);
      return Number.isFinite(n) && n >= min ? n : null;
    };
    const cost = num(settings.nidake.costUsd, 1);
    const years = num(settings.nidake.yearsOfDignity, 1);
    const days = num(settings.nidake.schoolDaysSaved, 1);
    if (cost === null || years === null || days === null) {
      return { ok: false, error: "NIDAKE figures must be positive numbers." };
    }
    const str = (v: unknown, max = 500) => String(v ?? "").trim().slice(0, max);
    const image = str(settings.homeFeature.image);
    const href = str(settings.homeFeature.linkHref);
    if (image && !(image.startsWith("/") || image.startsWith("https://"))) {
      return { ok: false, error: "Feature image must be an uploaded image or an https:// link." };
    }
    if (href && !(href.startsWith("/") || href.startsWith("https://"))) {
      return { ok: false, error: "Feature link must start with / or https://" };
    }
    await writeSettings({
      homeFeature: {
        enabled: Boolean(settings.homeFeature.enabled),
        eyebrow: str(settings.homeFeature.eyebrow, 80),
        title: str(settings.homeFeature.title, 200),
        excerpt: str(settings.homeFeature.excerpt, 1000),
        image,
        linkLabel: str(settings.homeFeature.linkLabel, 60),
        linkHref: href,
      },
      nidake: { costUsd: cost, yearsOfDignity: years, schoolDaysSaved: days },
      contact: { email: str(settings.contact.email, 200), phone: str(settings.contact.phone, 60) },
    });
    await logActivity(user, "updated settings", "Site settings", "/admin/settings");
    refreshSite();
    return { ok: true };
  });
}

/* ------------------------------------------------------------ Submissions */

export async function setSubmissionStatusAction(id: string, status: SubmissionStatus): Promise<ActionResult> {
  return guard(async () => {
    await requireUser("submissions");
    if (!["new", "read", "archived"].includes(status)) return { ok: false, error: "Invalid status." };
    await updateStore("submissions", (items) => ({
      items: items.map((s) => (s.id === id ? { ...s, status } : s)),
    }));
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

export async function deleteSubmissionAction(id: string): Promise<ActionResult> {
  return guard(async () => {
    const user = await requireUser("submissions.delete");
    const removed = await updateStore("submissions", (items) => ({
      items: items.filter((s) => s.id !== id),
      result: items.find((s) => s.id === id),
    }));
    await Promise.all((removed?.attachments ?? []).map((a) => deletePrivateUpload(a.stored).catch(() => undefined)));
    await logActivity(user, "deleted submission", id);
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

/* ------------------------------------------------------------------ Media */

export async function updateMediaAltAction(id: string, alt: string): Promise<ActionResult> {
  return guard(async () => {
    await requireUser("media");
    await updateStore("media", (items) => ({
      items: items.map((m) => (m.id === id ? { ...m, alt: alt.trim().slice(0, 300) } : m)),
    }));
    return { ok: true };
  });
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  return guard(async () => {
    const user = await requireUser("media.delete");
    const item = (await readStore("media")).find((m) => m.id === id);
    if (!item) return { ok: false, error: "File not found." };
    await updateStore("media", (items) => ({ items: items.filter((m) => m.id !== id) }));
    await unlink(path.join(UPLOADS_DIR, path.basename(item.filename))).catch(() => undefined);
    await logActivity(user, "deleted media", item.filename);
    return { ok: true };
  });
}

/* ------------------------------------------------------------------ Users */

export async function saveUserAction(
  originalId: string | null,
  input: { name: string; email: string; role: Role; password?: string },
): Promise<ActionResult> {
  return guard(async () => {
    const actor = await requireUser("users");
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const errors: FieldErrors = {};
    if (!name) errors.name = "Enter a name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email address.";
    const roles = await readStore("roles");
    if (!roles.some((r) => r.id === input.role) && input.role !== "administrator") errors.role = "Choose a role.";
    if (!originalId || input.password) {
      const weak = validatePasswordStrength(input.password ?? "");
      if (weak) errors.password = weak;
    }
    const users = await readStore("users");
    if (users.some((u) => u.email === email && u.id !== originalId)) errors.email = "A user with this email already exists.";
    if (originalId === actor.id && !resolveRole(input.role, roles).permissions.includes("users")) {
      errors.role = "You can't give yourself a role without access to Users & roles.";
    }
    if (Object.keys(errors).length) return { ok: false, errors, error: "Please fix the highlighted fields." };

    const passwordHash = input.password ? await hashPassword(input.password) : undefined;
    const id = originalId ?? randomUUID();
    await updateStore("users", (items) => {
      if (originalId) {
        return {
          items: items.map((u) =>
            u.id === originalId ? { ...u, name, email, role: input.role, ...(passwordHash ? { passwordHash } : {}) } : u,
          ),
        };
      }
      return {
        items: [...items, { id, name, email, role: input.role, passwordHash: passwordHash!, createdAt: new Date().toISOString() }],
      };
    });
    await logActivity(actor, originalId ? "updated user" : "created user", `${name} (${resolveRole(input.role, roles).name})`, "/admin/users");
    revalidatePath("/admin/users");
    return { ok: true, id };
  });
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  return guard(async () => {
    const actor = await requireUser("users");
    if (id === actor.id) return { ok: false, error: "You can't delete your own account." };
    const target = (await readStore("users")).find((u) => u.id === id);
    if (!target) return { ok: false, error: "User not found." };
    await updateStore("users", (items) => ({ items: items.filter((u) => u.id !== id) }));
    await logActivity(actor, "deleted user", target.name);
    revalidatePath("/admin/users");
    return { ok: true };
  });
}

export async function updateProfileAction(input: {
  name: string;
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  return guard(async (): Promise<ActionResult> => {
    const me: PublicUser = await requireUser();
    const user = (await readStore("users")).find((u) => u.id === me.id)!;
    const name = input.name.trim();
    if (!name) return { ok: false, errors: { name: "Enter your name." } };
    let passwordHash: string | undefined;
    if (input.newPassword) {
      if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
        return { ok: false, errors: { currentPassword: "Current password is incorrect." } };
      }
      const weak = validatePasswordStrength(input.newPassword);
      if (weak) return { ok: false, errors: { newPassword: weak } };
      passwordHash = await hashPassword(input.newPassword);
    }
    await updateStore("users", (items) => ({
      items: items.map((u) => (u.id === me.id ? { ...u, name, ...(passwordHash ? { passwordHash } : {}) } : u)),
    }));
    await logActivity(me, passwordHash ? "changed password" : "updated profile", name);
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}


/* --------------------------------------------------------------- Comments */

export async function setCommentStatusAction(id: string, status: "pending" | "approved"): Promise<ActionResult> {
  return guard(async () => {
    const user = await requireUser("comments");
    const comment = await updateStore("comments", (items) => ({
      items: items.map((c) => (c.id === id ? { ...c, status } : c)),
      result: items.find((c) => c.id === id),
    }));
    if (!comment) return { ok: false, error: "This comment no longer exists." };
    await logActivity(user, status === "approved" ? "approved comment on" : "unapproved comment on", comment.postTitle, `/blog/${comment.slug}`);
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

export async function deleteCommentAction(id: string): Promise<ActionResult> {
  return guard(async () => {
    const user = await requireUser("comments");
    const comment = await updateStore("comments", (items) => ({
      items: items.filter((c) => c.id !== id),
      result: items.find((c) => c.id === id),
    }));
    if (comment) await logActivity(user, "deleted comment on", comment.postTitle);
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

/* --------------------------------------------------------------- Learners */

/** Sets a random temporary password for a learner and returns it once, for the admin to pass on. */
export async function resetLearnerPasswordAction(id: string): Promise<ActionResult & { password?: string }> {
  try {
    const user = await requireUser("training.manage");
    const password = randomUUID().replace(/-/g, "").slice(0, 12);
    const hash = await hashPassword(password);
    const learner = await updateStore("learners", (items) => ({
      items: items.map((l) => (l.id === id ? { ...l, passwordHash: hash } : l)),
      result: items.find((l) => l.id === id),
    }));
    if (!learner) return { ok: false, error: "Learner not found." };
    await logActivity(user, "reset training password for", learner.email);
    return { ok: true, password };
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, error: err.message };
    throw err;
  }
}

export async function deleteLearnerAction(id: string): Promise<ActionResult> {
  return guard(async () => {
    const user = await requireUser("training.manage");
    const learner = await updateStore("learners", (items) => ({
      items: items.filter((l) => l.id !== id),
      result: items.find((l) => l.id === id),
    }));
    if (learner) await logActivity(user, "deleted learner account", learner.email);
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}

/* ------------------------------------------------------------------ Roles */

export async function saveRoleAction(
  originalId: string | null,
  input: { name: string; description: string; permissions: string[] },
): Promise<ActionResult> {
  return guard(async () => {
    const actor = await requireUser("users");
    const name = input.name.trim().slice(0, 60);
    const description = input.description.trim().slice(0, 200);
    const permissions = ALL_PERMISSIONS.filter((p) => input.permissions.includes(p));
    const errors: FieldErrors = {};
    if (!name) errors.name = "Give the role a name.";
    if (originalId === "administrator") return { ok: false, error: "The Administrator role always has full access and can't be changed." };
    const roles = await readStore("roles");
    const id = originalId ?? (slugify(name) || randomUUID().slice(0, 8));
    if (!originalId && roles.some((r) => r.id === id || r.name.toLowerCase() === name.toLowerCase())) {
      errors.name = "A role with this name already exists.";
    }
    if (originalId && !roles.some((r) => r.id === originalId)) return { ok: false, error: "This role no longer exists." };
    // Don't let an actor lock themselves out by removing Users & roles from their own role.
    if (originalId && originalId === actor.role && !permissions.includes("users")) {
      errors.permissions = "Your own role must keep the Users & roles permission.";
    }
    if (Object.keys(errors).length) return { ok: false, errors, error: "Please fix the highlighted fields." };

    await updateStore("roles", (items) => ({
      items: originalId
        ? items.map((r) => (r.id === originalId ? { ...r, name, description, permissions } : r))
        : [...items, { id, name, description, permissions }],
    }));
    await logActivity(actor, originalId ? "updated role" : "created role", name, "/admin/users/roles");
    revalidatePath("/admin", "layout");
    return { ok: true, id };
  });
}

export async function deleteRoleAction(id: string): Promise<ActionResult> {
  return guard(async () => {
    const actor = await requireUser("users");
    const role = (await readStore("roles")).find((r) => r.id === id);
    if (!role) return { ok: false, error: "Role not found." };
    if (role.builtIn) return { ok: false, error: "Built-in roles can't be deleted." };
    const inUse = (await readStore("users")).filter((u) => u.role === id).length;
    if (inUse) return { ok: false, error: `${inUse} user${inUse > 1 ? "s have" : " has"} this role. Assign them another role first.` };
    await updateStore("roles", (items) => ({ items: items.filter((r) => r.id !== id) }));
    await logActivity(actor, "deleted role", role.name);
    revalidatePath("/admin", "layout");
    return { ok: true };
  });
}
