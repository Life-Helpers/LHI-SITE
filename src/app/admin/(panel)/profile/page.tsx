import { PageHeader } from "@/components/cms/ui";
import { TwoFactorCard } from "@/components/cms/two-factor-card";
import { ProfileForm } from "@/components/cms/user-forms";
import { requirePageUser } from "@/lib/cms/auth";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requirePageUser();
  return (
    <>
      <PageHeader title="Profile" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Profile" }]} />
      <div className="space-y-6">
        <ProfileForm user={user} />
        <TwoFactorCard enabled={user.twoFactor} />
      </div>
    </>
  );
}
