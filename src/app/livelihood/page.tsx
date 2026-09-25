import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetail } from "@/components/program-detail";
import { getProgram } from "@/lib/cms/content";

/** Page text and photo come from Admin → Thematic Area Pages. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const program = await getProgram("livelihood");
  return program ? { title: program.name, description: program.summary, alternates: { canonical: "/livelihood" } } : {};
}

export default async function LivelihoodPage() {
  const program = await getProgram("livelihood");
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
