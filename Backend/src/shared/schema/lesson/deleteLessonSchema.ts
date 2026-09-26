import { z } from "zod";
import { mongoIdSchema } from "../common/mongoIdSchema";

export const deleteLessonSchema = z.object({

    body: z.any().optional(),

    params: z.object({
        courseId: mongoIdSchema,
        chapterId: mongoIdSchema,
        lessonId: mongoIdSchema,
    }),

    query: z.object({}),
});