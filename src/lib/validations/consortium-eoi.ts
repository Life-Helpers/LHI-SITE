import { z } from "zod";

export const REQUEST_TYPES = [
  "Consortium partnership",
  "RFP / Expression of Interest",
  "Due-diligence document request",
] as const;

export const FUNDING_AGENCIES = [
  "USAID",
  "European Union",
  "United Nations agency",
  "FCDO (UK)",
  "GIZ / BMZ (Germany)",
  "Foundation",
  "INGO lead applicant",
  "Other",
] as const;

export const consortiumEoiSchema = z.object({
  requestType: z.enum(REQUEST_TYPES, { error: "Choose a request type" }),
  organization: z.string().trim().min(2, "Enter your organization").max(160, "Organization name is too long"),
  contactName: z.string().trim().min(1, "Enter a contact name").max(120, "Name is too long"),
  email: z.string().trim().min(1, "Enter an email address").email("Enter a valid email address"),
  phone: z.string().trim().max(40, "Phone number is too long").optional(),
  agency: z.enum(FUNDING_AGENCIES, { error: "Choose a funding agency" }),
  opportunityRef: z.string().trim().max(160, "Reference is too long").optional(),
  deadline: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, "Use the date picker")
    .optional(),
  states: z.array(z.string()).max(11).optional(),
  documents: z.array(z.string()).max(20).optional(),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(3000, "Message is too long"),
});

export type ConsortiumEoiValues = z.infer<typeof consortiumEoiSchema>;
