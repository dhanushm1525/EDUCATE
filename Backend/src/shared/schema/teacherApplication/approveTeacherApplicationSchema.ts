import { z } from "zod";

export const approveTeacherApplicationSchema = z.object({
    body: z.object({}),

    params: z.object({
        applicationId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID")
    }),

    query: z.object({})
});