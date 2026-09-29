import { z } from "zod";

import { mongoIdSchema } from "../common/mongoIdSchema";

export const generateLessonMediaUploadUrlSchema = z.object({

    body: z.object({
        fileName: z
            .string()
            .min(1)
            .max(255)
            .trim(),

        contentType: z
            .string()
            .min(1)
            .max(150)
            .trim(),
    }),

    params: z.object({
        courseId: mongoIdSchema,
        chapterId: mongoIdSchema,
        lessonId: mongoIdSchema,
    }),

    query: z.object({}),
});