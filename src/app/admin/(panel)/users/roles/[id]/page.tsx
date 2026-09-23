import { notFound } from "next/navigation";

import { RoleForm } from "@/components/cms/role-form";
import { PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";
import { ALL_PERMISSIONS } from "@/lib/cms/schema";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Edit role" };

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePageUser("users");
  const { id } = await params;
  const [roles, users] = await Promise.all([readStore("roles"), readStore("users")]);
  const role = roles.find((r) => r.id === id);
  if (!role) notFound();
  const shown = role.id === "administrator" ? { ...role, permissions: ALL_PERMISSIONS } : role;
  return (
    <>
      <PageHeader
        title={role.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "Roles", href: "/admin/users/roles" },
          { label: role.name },
        ]}
      />
      <RoleForm role={shown} userCount={users.filter((u) => u.role === role.id).length} />
    </>
  );
}
