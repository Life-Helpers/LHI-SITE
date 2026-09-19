import type { EmergencyAlert } from "@/types/content";

/**
 * Global crisis banner feed. Add/remove/reorder entries here to activate or
 * clear alerts sitewide — the banner renders nothing when this is empty.
 * The first "critical" entry wins the banner's visual treatment.
 *
 * Empty by default: there is no real, currently-declared emergency to show.
 * Add a real entry here (and a matching one in src/data/emergencies.ts) when
 * an actual crisis response is active.
 */
export const activeAlerts: EmergencyAlert[] = [];
