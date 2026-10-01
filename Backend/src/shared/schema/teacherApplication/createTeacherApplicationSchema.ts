import { z } from "zod";

export const createTeacherApplicationSchema = z.object({

    body: z.object({

        qualification: z
            .string()
            .trim()
            .min(2, "Qualification is required"),

        experience: z
            .number()
            .min(0, "Experience cannot be negative"),

        skills: z
            .array(z.string().trim())
            .min(1, "At least one skill is required"),

        bio: z
            .string()
            .trim()
            .min(20, "Bio must contain at least 20 characters"),

        documents: z
            .array(z.string())
            .optional(),

        certificates: z
            .array(z.string())
            .optional()
    }),

    params: z.object({}),

    query: z.object({})
});