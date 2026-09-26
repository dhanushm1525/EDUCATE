import { z } from "zod";
import { mongoIdSchema } from "../common/mongoIdSchema";

export const createChapterSchema = z.object({
    body: z.object({
        title: z
            .string()
            .min(3, "Chapter title must be at least 3 characters")
            .max(150, "Chapter title cannot exceed 150 characters")
            .trim(),

        description: z
            .string()
            .max(1000, "Description cannot exceed 1000 characters")
            .trim()
            .optional(),

        order: z
            .number()
            .int("Chapter order must be an integer")
            .positive("Chapter order must be greater than 0"),

        outcomes: z
            .array(
                z
                    .string()
                    .min(1, "Outcome cannot be empty")
                    .trim()
            )
            .optional(),
    }),

    params: z.object({
        courseId: mongoIdSchema,
    }),

    query: z.object({}),
});