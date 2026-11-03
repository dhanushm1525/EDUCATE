import { z } from "zod";

export const generateTeacherApplicationUploadUrlSchema = z.object({
    body: z.object({
        fileType: z.enum(["document", "certificate"]),

        contentType: z
            .string()
            .min(1)
            .max(150)
            .trim(),
    }),

    params: z.object({}),

    query: z.object({}),
});