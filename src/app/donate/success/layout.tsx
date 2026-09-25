import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Confirmation of your gift to Life Helpers Initiative.",
  robots: { index: false, follow: false },
};

export default function DonateSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
