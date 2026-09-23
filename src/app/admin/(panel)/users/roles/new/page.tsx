import { RoleForm } from "@/components/cms/role-form";
import { PageHeader } from "@/components/cms/ui";
import { requirePageUser } from "@/lib/cms/auth";

export const metadata = { title: "New role" };

export default async function NewRolePage() {
  await requirePageUser("users");
  return (
    <>
      <PageHeader
        title="New role"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "Roles", href: "/admin/users/roles" },
          { label: "New" },
        ]}
      />
      <RoleForm />
    </>
  );
}
