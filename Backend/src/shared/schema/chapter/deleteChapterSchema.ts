import { z } from "zod";
import { mongoIdSchema } from "../common/mongoIdSchema";

export const deleteChapterSchema = z.object({
    body: z.any().optional(),

    params: z.object({
        courseId: mongoIdSchema,

        chapterId: z
            .string()
            .min(1, "Chapter ID is required"),
    }),

    query: z.object({}),
});