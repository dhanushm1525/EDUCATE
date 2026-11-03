import { z } from "zod";

export const rejectTeacherApplicationSchema = z.object({
    body: z.object({
        rejectionReason: z
            .string()
            .trim()
            .min(5, "Rejection reason must contain at least 5 characters")
            .max(500, "Rejection reason cannot exceed 500 characters")
    }),

    params: z.object({
        applicationId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID")
    }),

    query: z.object({})
});