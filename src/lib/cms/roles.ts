import "server-only";

import type { RoleOption } from "@/components/cms/user-forms";
import { resolveRole } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";

/** Roles for pickers, with how many users hold each. */
export async function getRoleOptions(): Promise<RoleOption[]> {
  const [roles, users] = await Promise.all([readStore("roles"), readStore("users")]);
  return roles.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    count: users.filter((u) => u.role === r.id).length,
    canManageUsers: resolveRole(r.id, roles).permissions.includes("users"),
  }));
}
