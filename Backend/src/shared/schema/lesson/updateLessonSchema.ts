import { z } from "zod";
import { LessonType } from "../../../shared/enums/LessonType";

export const updateLessonSchema = z.object({

    body: z.object({
        title: z
            .string()
            .min(3)
            .max(150)
            .trim()
            .optional(),

        description: z
            .string()
            .max(1000)
            .trim()
            .optional(),

        order: z
            .number()
            .int()
            .positive()
            .optional(),

        type: z
            .enum([
                LessonType.VIDEO,
                LessonType.READING,
            ])
            .optional(),

        videoUrl: z
            .string()
            .url()
            .optional(),

        content: z
            .string()
            .optional(),

        attachments: z
            .array(z.string().min(1).trim())
            .optional(),

        duration: z
            .number()
            .nonnegative()
            .optional(),
    }),

    params: z.object({
        courseId: z.string().min(1),
        chapterId: z.string().min(1),
        lessonId: z.string().min(1),
    }),

    query: z.object({}),
});