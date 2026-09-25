import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetail } from "@/components/program-detail";
import { getProgram } from "@/lib/cms/content";

/** Page text and photo come from Admin → Thematic Area Pages. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const program = await getProgram("education");
  return program ? { title: program.name, description: program.summary, alternates: { canonical: "/education" } } : {};
}

export default async function EducationPage() {
  const program = await getProgram("education");
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
