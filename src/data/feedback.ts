/** Options for the community feedback and response mechanism (/feedback). */
export const FEEDBACK_TYPES = ["Compliment", "Suggestion", "Complaint", "Question"] as const;
export const RESPONSE_CHANNELS = ["Email", "Phone call", "WhatsApp / SMS", "No response needed"] as const;
export const FEEDBACK_PROGRAMMES = [
  "Health & WASH",
  "Education",
  "Livelihood",
  "Food Security",
  "Social Inclusion",
  "Protection & GBV",
  "Emergency response",
  "Humanitarian Training (online courses)",
  "Voices of the People (VOP) radio",
  "Recruitment or procurement",
  "Website",
  "Other / general",
] as const;
