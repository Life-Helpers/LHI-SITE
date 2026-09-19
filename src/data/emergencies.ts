import type { Emergency } from "@/types/content";

/**
 * Emergency declarations backing /emergencies and /emergencies/[id].
 * Empty by default: LHI's real content brief describes emergency
 * humanitarian relief and disaster risk reduction as an ongoing operational
 * capability, but names no specific currently-active crisis. Add real
 * entries here (and a matching alert in src/config/alerts.ts for active
 * ones) as actual emergencies are declared.
 */
export const emergencies: Emergency[] = [];
