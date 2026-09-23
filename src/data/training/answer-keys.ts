import "server-only";

/** Final-assessment answer keys (index of the correct option). Server-only so they never reach the browser. */
export const ANSWER_KEYS: Record<string, Record<string, number>> = {
  "comprehensive-safeguarding": {
    s1: 1, s2: 2, s3: 2, s4: 1, s5: 1, s6: 1, s7: 0, s8: 0, s9: 1, s10: 1, s11: 0, s12: 3, s13: 0, s14: 0, s15: 1,
  },
  "child-safeguarding-policy": {
    c1: 1, c2: 1, c3: 1, c4: 0, c5: 1, c6: 1, c7: 0, c8: 0, c9: 0, c10: 0,
  },
  "gbv-in-humanitarian-settings": {
    g1: 1, g2: 1, g3: 0, g4: 2, g5: 0, g6: 1, g7: 0, g8: 1, g9: 1, g10: 0, g11: 1, g12: 0, g13: 1, g14: 0, g15: 1,
  },
};
