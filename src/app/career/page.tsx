import type { Metadata } from "next";
import { CareerPageView } from "@/components/career/career-page-view";

export const metadata: Metadata = {
  title: "Careers & Humanitarian Vacancies | Life Helpers Initiative",
  description:
    "Join our humanitarian team across 11 states in Nigeria. Explore current job vacancies in Health, Nutrition, Protection & PSEA, MEAL, Logistics, and apply online.",
  keywords: [
    "Life Helpers Initiative careers",
    "NGO jobs in Nigeria",
    "Borno humanitarian jobs",
    "Sokoto NGO jobs",
    "Health Officer vacancy Nigeria",
    "PSEA Protection jobs",
    "Life Helpers Initiative recruitment",
  ],
};

export default function CareerPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1">
      <CareerPageView />
    </main>
  );
}
