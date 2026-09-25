import { LEADERSHIP_TEAM, STATE_COORDINATORS } from "@/data/lhi-photos";

/**
 * Board, management and state coordinators as published by LHI (Organisational Profile,
 * Strategic Plan 2026–2030 and LHI's board listing). Seeds Admin → Team; the pages read the
 * CMS, so this is only the starting content.
 */
export type TeamGroup = "board" | "management" | "coordinator";

export interface TeamMember {
  id: string;
  name: string;
  group: TeamGroup;
  role: string;
  credentials: string;
  department: string;
  overview: string;
  email: string;
  photo: string;
  state: string;
  order: number;
  status: "published" | "draft";
}

const TRUSTEES = [
  { name: "Engr. Godfrey Mayoku", role: "Board Chairman", qualification: "", photo: "/images/lhi/board/godfrey-mayoku.jpg" },
  { name: "Mr Tayo Fatinikun", role: "National Executive Director", qualification: "FICA, FIMC, CMC", photo: "/images/lhi/board/tayo-fatinikun.jpg" },
  { name: "Pharm. Iyabo Adebisi", role: "Board Secretary", qualification: "", photo: "/images/lhi/board/iyabo-adebisi.jpg" },
  { name: "Barr. Joy Ihenacho", role: "Board Member", qualification: "", photo: "/images/lhi/board/joy-ihenacho.jpg" },
  { name: "Pharm. Sam Olaoye", role: "Board Member", qualification: "", photo: "/images/lhi/board/sam-olaoye.jpg" },
  { name: "Mrs Bukola Fatinikun", role: "Board Member", qualification: "", photo: "/images/lhi/board/bukola-fatinikun.jpg" },
];

/** Unit descriptions from the Strategic Plan 2026–2030. */
const UNIT_OVERVIEWS: Record<string, { department: string; overview: string; credentials?: string }> = {
  "Tayo Fatinikun": {
    department: "Executive Directorate",
    credentials: "FICA, FIMC, CMC",
    overview:
      "Provides overall leadership of LHI, working with the Board of Trustees and the National Management Team to deliver the vision of “a more fulfilled life for everyone”.",
  },
  "Hadiza Ibrahim Yaro": {
    department: "Safeguarding, Accountability & Gender (SAG)",
    overview:
      "Coordinates safeguarding, accountability to affected populations, feedback mechanisms and inclusive gender programming across all projects.",
  },
  "Kolawole Adeniyi Famokun": {
    department: "Programmes",
    overview: "Coordinates and provides leadership across all six thematic areas of LHI's work.",
  },
  "Taiye Lawal": {
    department: "Business Development, Partnership & Grant Management (BuDPaGM)",
    overview:
      "Leads resource mobilisation, partner relationships, research into fundable opportunities and overall grant management.",
  },
  "Precious Afuaman": {
    department: "Monitoring, Evaluation, Research & Learning (MERL)",
    overview:
      "Coordinates data management, operational and programmatic research and assessment, knowledge management and learning.",
  },
  "Dapo Ogunyemi": {
    department: "Compliance & Internal Audit (CIA)",
    overview: "Ensures policy and procedural compliance across the organisation and upholds internal financial integrity.",
  },
  "James Olasunkanmi David": {
    department: "Operations",
    overview: "Oversees administration, security, supply chain and general logistics.",
  },
  "Ijeoma Beatrice Ekpunobi": {
    department: "Finance",
    overview: "Coordinates and manages all financial transactions and documentation.",
  },
};

const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const base = { credentials: "", department: "", overview: "", email: "", photo: "", state: "", status: "published" as const };

export const TEAM_MEMBERS: TeamMember[] = [
  ...TRUSTEES.map((t, i) => ({ ...base, id: `board-${slug(t.name)}`, group: "board" as const, name: t.name, role: t.role, credentials: t.qualification, photo: t.photo, order: (i + 1) * 10 })),
  ...LEADERSHIP_TEAM.map((p, i) => ({
    ...base,
    id: `management-${slug(p.name)}`,
    group: "management" as const,
    name: p.name,
    role: p.role,
    email: p.email,
    photo: p.photo,
    department: UNIT_OVERVIEWS[p.name]?.department ?? "",
    overview: UNIT_OVERVIEWS[p.name]?.overview ?? "",
    credentials: UNIT_OVERVIEWS[p.name]?.credentials ?? "",
    order: (i + 1) * 10,
  })),
  ...STATE_COORDINATORS.map((c, i) => ({ ...base, id: `coordinator-${slug(c.name)}`, group: "coordinator" as const, name: c.name, role: "State Office Coordinator", state: c.state, email: c.email, order: (i + 1) * 10 })),
];
