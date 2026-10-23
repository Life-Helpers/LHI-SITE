import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "LHI HR Portal", template: "%s · LHI HR Portal" },
  robots: { index: false, follow: false },
};

/** Staff-only area. Every page checks the signed-in account on the server; this layout only styles. */
export default function HrPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root hr-root flex min-h-screen flex-1 flex-col bg-admin-bg font-[family-name:var(--font-inter)] text-admin-text">
      {children}
    </div>
  );
}
