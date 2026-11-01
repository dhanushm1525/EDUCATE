import { z } from "zod";

import { mongoIdSchema } from "../common/mongoIdSchema";

export const generateCourseThumbnailUploadUrlSchema = z.object({

    body: z.object({
        contentType: z
            .string()
            .min(1)
            .max(150)
            .trim(),
    }),

    params: z.object({
        courseId: mongoIdSchema,
    }),

    query: z.object({}),
});