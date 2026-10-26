import { z } from "zod";
import { mongoIdSchema } from "../common/mongoIdSchema";

export const cleanupLessonMediaSchema = z.object({
    body: z.object({
        key: z.string().trim().min(1),
    }),
    params: z.object({
        courseId: mongoIdSchema,
        chapterId: mongoIdSchema,
        lessonId: mongoIdSchema,
    }),
    query: z.object({}),
});