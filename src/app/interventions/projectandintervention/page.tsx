import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Projects & Interventions" };

export default function ProjectsAndInterventionsPage() {
  return (
    <ComingSoon
      title="Projects & Interventions"
      note="A detailed log of individual projects and interventions is being compiled. For now, see our program areas."
      seeAlso={{ label: "See our programs", href: "/programs" }}
    />
  );
}
