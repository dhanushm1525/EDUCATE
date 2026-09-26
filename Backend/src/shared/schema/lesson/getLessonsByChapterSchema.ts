import { z } from "zod";

export const getLessonsByChapterSchema = z.object({

    body: z.any().optional(),

    params: z.object({
        courseId: z.string().min(1),
        chapterId: z.string().min(1),
    }),

    query: z.object({}),
});