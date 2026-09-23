import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge, buttonClass, Card, PageHeader } from "@/components/cms/ui";
import { requirePageUser, resolveRole } from "@/lib/cms/auth";
import { ALL_PERMISSIONS } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Roles & permissions" };

export default async function RolesPage() {
  await requirePageUser("users");
  const [roles, users] = await Promise.all([readStore("roles"), readStore("users")]);

  return (
    <>
      <PageHeader
        title="Roles & permissions"
        description="A role is a named set of permissions. Assign roles to team members on the Users page."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Users", href: "/admin/users" }, { label: "Roles" }]}
        actions={
          <Link href="/admin/users/roles/new" className={buttonClass.primary}>
            <Plus className="h-4 w-4" /> New role
          </Link>
        }
      />
      <Card bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-[11px] font-bold uppercase tracking-wider text-admin-muted">
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Permissions</th>
              <th className="px-5 py-3">Users</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => {
              const perms = resolveRole(r.id, roles).permissions.length;
              const count = users.filter((u) => u.role === r.id).length;
              return (
                <tr key={r.id} className="border-b border-admin-border last:border-0 hover:bg-admin-bg/60">
                  <td className="px-5 py-3">
                    <Link href={`/admin/users/roles/${r.id}`} className="font-semibold hover:text-admin-primary">
                      {r.name}
                    </Link>{" "}
                    {r.builtIn && <Badge tone="neutral">Built-in</Badge>}
                    <p className="text-xs text-admin-muted">{r.description}</p>
                  </td>
                  <td className="px-5 py-3 text-admin-muted">
                    {perms === ALL_PERMISSIONS.length ? "All" : `${perms} of ${ALL_PERMISSIONS.length}`}
                  </td>
                  <td className="px-5 py-3 text-admin-muted">{count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
