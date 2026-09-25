import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetail } from "@/components/program-detail";
import { programs } from "@/data/programs";

const program = programs.find((p) => p.id === "protection");

export const metadata: Metadata = program
  ? { title: program.name, description: program.summary, alternates: { canonical: "/protection" } }
  : {};

export default function ProtectionPage() {
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
