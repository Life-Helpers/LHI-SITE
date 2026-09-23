import { notFound } from "next/navigation";

import { PageHeader } from "@/components/cms/ui";
import { UserForm } from "@/components/cms/user-forms";
import { requirePageUser, toPublicUser } from "@/lib/cms/auth";
import { getRoleOptions } from "@/lib/cms/roles";
import { readStore } from "@/lib/cms/store";

export const metadata = { title: "Edit user" };

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requirePageUser("users");
  const { id } = await params;
  const user = (await readStore("users")).find((u) => u.id === id);
  if (!user) notFound();
  return (
    <>
      <PageHeader
        title={`Edit ${user.name}`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Users", href: "/admin/users" }, { label: "Edit" }]}
      />
      <UserForm user={toPublicUser(user, await readStore("roles"))} isSelf={user.id === me.id} roles={await getRoleOptions()} />
    </>
  );
}
