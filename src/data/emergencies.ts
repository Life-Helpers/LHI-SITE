import type { Emergency } from "@/types/content";

/**
 * First-run emergencies for Admin → Emergencies, which backs /emergencies, /emergencies/[id]
 * and the site-wide alert banner. Empty: LHI's content brief describes emergency relief as an
 * ongoing capability but names no currently active crisis. Declare real ones in the admin.
 */
export const emergencies: Emergency[] = [];
