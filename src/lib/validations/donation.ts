import { z } from "zod";

export const donationSchema = z.object({
  frequency: z.enum(["one_time", "monthly"]),
  amount: z
    .number({ error: "Enter an amount" })
    .min(5, "Minimum donation is $5")
    .max(50000, "For gifts over $50,000, please contact us directly"),
  donorName: z
    .string()
    .trim()
    .min(1, "Enter your full name")
    .max(120, "Name is too long"),
  donorEmail: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .email("Enter a valid email address"),
  message: z.string().trim().max(500, "Message is too long").optional(),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

export const amountStepFields = ["frequency", "amount"] as const;
export const donorStepFields = ["donorName", "donorEmail", "message"] as const;
