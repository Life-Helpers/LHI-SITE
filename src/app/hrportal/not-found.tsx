import Link from "next/link";

import { PortalAuthCard } from "@/components/hr/portal-shell";

/** A missing (or not-yours) HR portal page: stays inside the portal instead of the public site's 404. */
export default function HrNotFound() {
  return (
    <PortalAuthCard title="Page not found" subtitle="It may have moved, or it isn't one you can open.">
      <p className="text-sm text-admin-text">Check the address, or go back to your portal home page.</p>
      <Link href="/hrportal" className="mt-5 inline-flex rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
        Go to my portal
      </Link>
    </PortalAuthCard>
  );
}
