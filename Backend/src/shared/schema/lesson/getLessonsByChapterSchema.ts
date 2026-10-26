
import { z } from "zod";
import { mongoIdSchema } from "../common/mongoIdSchema";

export const getLessonsByChapterSchema = z.object({
    body: z.any().optional(),

    params: z.object({
        courseId: mongoIdSchema,
        chapterId: mongoIdSchema,
    }),

    query: z.object({}),
});
