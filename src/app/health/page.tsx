import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetail } from "@/components/program-detail";
import { getProgram } from "@/lib/cms/content";

/** Page text and photo come from Admin → Thematic Area Pages. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const program = await getProgram("health");
  return program ? { title: program.name, description: program.summary, alternates: { canonical: "/health" } } : {};
}

export default async function HealthPage() {
  const program = await getProgram("health");
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
