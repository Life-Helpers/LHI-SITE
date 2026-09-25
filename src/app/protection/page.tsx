import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetail } from "@/components/program-detail";
import { getProgram } from "@/lib/cms/content";

/** Page text and photo come from Admin → Thematic Area Pages. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const program = await getProgram("protection");
  return program ? { title: program.name, description: program.summary, alternates: { canonical: "/protection" } } : {};
}

export default async function ProtectionPage() {
  const program = await getProgram("protection");
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
