import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "LHI Admin", template: "%s · LHI Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root flex min-h-screen flex-1 flex-col bg-admin-bg font-[family-name:var(--font-inter)] text-admin-text">
      {children}
    </div>
  );
}
