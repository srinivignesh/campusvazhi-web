import { z } from "zod";

/**
 * Indian mobile: 10 digits starting with 6/7/8/9.
 * Accepts optional +91 / 91 / 0 prefix and strips non-digits first.
 */
export function normalizeIndianPhone(input: string): string | null {
  const digits = (input || "").replace(/\D+/g, "");
  // strip leading 0, 91, or country-code-like prefixes down to 10 digits
  let d = digits;
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length !== 10) return null;
  if (!/^[6-9]/.test(d)) return null;
  return `+91${d}`;
}

export const currentStatusEnum = [
  "school_student", // Class 11–12
  "ug_student", // undergrad, looking at TANCET / PG / placements
  "pg_student", // postgrad
  "working_professional",
  "parent",
  "other",
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long"),
  phone: z.string().trim().min(1, "Phone is required"),
  college: z.string().trim().max(120).optional().default(""),
  current_status: z.enum(currentStatusEnum).optional(),
  interest: z
    .enum(["tancet", "admissions", "placements", "careers", "general"])
    .optional()
    .default("general"),
  // optional UTMs (client-injected)
  utm_source: z.string().max(80).optional(),
  utm_medium: z.string().max(80).optional(),
  utm_campaign: z.string().max(80).optional(),
  utm_content: z.string().max(80).optional(),
  utm_term: z.string().max(80).optional(),
  referrer: z.string().max(500).optional(),
  // honeypot — must be empty
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
