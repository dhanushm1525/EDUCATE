import { z } from "zod";

export const getChaptersByCourseSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({
        courseId: z
            .string()
            .min(1, "Course ID is required"),
    }),

    query: z.object({}),
});