import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetail } from "@/components/program-detail";
import { getProgram } from "@/lib/cms/content";

/** Page text and photo come from Admin → Thematic Area Pages. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const program = await getProgram("food-security");
  return program ? { title: program.name, description: program.summary, alternates: { canonical: "/food-security" } } : {};
}

export default async function FoodSecurityPage() {
  const program = await getProgram("food-security");
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
