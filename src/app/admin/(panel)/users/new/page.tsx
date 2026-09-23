import { PageHeader } from "@/components/cms/ui";
import { UserForm } from "@/components/cms/user-forms";
import { requirePageUser } from "@/lib/cms/auth";
import { getRoleOptions } from "@/lib/cms/roles";

export const metadata = { title: "Add user" };

export default async function NewUserPage() {
  await requirePageUser("users");
  return (
    <>
      <PageHeader
        title="Add user"
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Users", href: "/admin/users" }, { label: "Add" }]}
      />
      <UserForm roles={await getRoleOptions()} />
    </>
  );
}
