import { z } from "zod";
import { Types } from "mongoose";

export const getPublishedCourseByIdSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({
        courseId: z
            .string()
            .refine(
                (value) => Types.ObjectId.isValid(value),
                "Invalid course ID"
            ),
    }),

    query: z.object({}),
});