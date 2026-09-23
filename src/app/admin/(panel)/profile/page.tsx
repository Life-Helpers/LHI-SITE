import { PageHeader } from "@/components/cms/ui";
import { ProfileForm } from "@/components/cms/user-forms";
import { requirePageUser } from "@/lib/cms/auth";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requirePageUser("author");
  return (
    <>
      <PageHeader title="Profile" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Profile" }]} />
      <ProfileForm user={user} />
    </>
  );
}
