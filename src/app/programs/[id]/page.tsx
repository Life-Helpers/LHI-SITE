import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ProgramDetail } from "@/components/program-detail";
import { isThematicAreaId } from "@/data/thematic-areas";
import { getProgram } from "@/lib/cms/content";

/** Thematic areas added in Admin → Thematic Area Pages (the built-in six have their own pages). */
export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const program = await getProgram(id);
  return program ? { title: program.name, description: program.summary, alternates: { canonical: `/programs/${id}` } } : {};
}

export default async function AddedProgramPage({ params }: Props) {
  const { id } = await params;
  if (isThematicAreaId(id)) redirect(`/${id}`);
  const program = await getProgram(id);
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
