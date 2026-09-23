import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";

import { Badge, buttonClass, Card, formatDate, PageHeader } from "@/components/cms/ui";
import { requirePageUser, toPublicUser } from "@/lib/cms/auth";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requirePageUser("users");
  const roles = await readStore("roles");
  const users = (await readStore("users")).map((u) => toPublicUser(u, roles));
  return (
    <>
      <PageHeader
        title="Users"
        description="Team accounts that can sign in to the content manager. What each person can do is set by their role."
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Users" }]}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/users/roles" className={buttonClass.secondary}>
              <ShieldCheck className="h-4 w-4" /> Roles &amp; permissions
            </Link>
            <Link href="/admin/users/new" className={buttonClass.primary}>
              <Plus className="h-4 w-4" /> Add user
            </Link>
          </div>
        }
      />
      <Card bodyClassName="overflow-x-auto p-0">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-admin-border text-left text-[11px] font-bold uppercase tracking-wider text-admin-muted">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Last sign-in</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-admin-border last:border-0 hover:bg-admin-bg/60">
                <td className="px-5 py-3">
                  <Link href={u.id === me.id ? "/admin/profile" : `/admin/users/${u.id}`} className="font-semibold hover:text-admin-primary">
                    {u.name}
                  </Link>
                  {u.id === me.id && <span className="ml-2 text-xs text-admin-muted">(you)</span>}
                </td>
                <td className="px-5 py-3 text-admin-muted">{u.email}</td>
                <td className="px-5 py-3">
                  <Badge tone={u.role === "administrator" ? "primary" : "neutral"}>{u.roleName}</Badge>
                </td>
                <td className="px-5 py-3 text-admin-muted">{u.lastLoginAt ? formatDate(u.lastLoginAt, true) : "Never"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
