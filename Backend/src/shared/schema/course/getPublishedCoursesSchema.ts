import { z } from "zod";
import { Types } from "mongoose";
import { CourseLevel } from "../../enums/CourseLevel";

export const getPublishedCoursesSchema = z.object({
    body: z.object({}).optional(),

    params: z.object({}),

    query: z.object({
        search: z.string().trim().max(100).optional(),

        categoryId: z.string()
            .refine(
                (value) => Types.ObjectId.isValid(value),
                "Invalid category ID"
            )
            .optional(),

        level: z.nativeEnum(CourseLevel).optional(),

        minPrice: z.string()
            .regex(/^\d+(\.\d+)?$/, "Invalid minimum price")
            .optional(),

        maxPrice: z.string()
            .regex(/^\d+(\.\d+)?$/, "Invalid maximum price")
            .optional(),
    }).refine(
        (query) =>
            query.minPrice === undefined ||
            query.maxPrice === undefined ||
            Number(query.minPrice) <= Number(query.maxPrice),
        {
            message: "Minimum price cannot exceed maximum price",
            path: ["minPrice"],
        }
    ),
});