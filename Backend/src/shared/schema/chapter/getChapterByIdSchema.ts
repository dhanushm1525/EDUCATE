import { z } from "zod";

export const getChapterByIdSchema = z.object({
    body: z.any().optional(),

    params: z.object({
        courseId: z
            .string()
            .min(1, "Course ID is required"),

        chapterId: z
            .string()
            .min(1, "Chapter ID is required"),
    }),

    query: z.object({}),
});