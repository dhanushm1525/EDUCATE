import { z } from "zod";
import { CourseLevel } from "../../enums/CourseLevel";

export const updateCourseSchema = z.object({
    body: z.object({
        categoryId: z
            .string()
            .min(1, "Category is required")
            .optional(),

        title: z
            .string()
            .min(3, "Title must be at least 3 characters")
            .max(150, "Title cannot exceed 150 characters")
            .optional(),

        subtitle: z
            .string()
            .min(3, "Subtitle must be at least 3 characters")
            .max(250, "Subtitle cannot exceed 250 characters")
            .optional(),

        description: z
            .string()
            .min(10, "Description must be at least 10 characters")
            .optional(),

        thumbnail: z
            .string()
            .optional(),

        trailer: z
            .string()
            .optional(),

        language: z
            .string()
            .min(2, "Language is required")
            .optional(),

        level: z
            .nativeEnum(CourseLevel)
            .optional(),

        duration: z
            .number()
            .positive("Duration must be greater than 0")
            .optional(),

        price: z
            .number()
            .min(0, "Price cannot be negative")
            .optional(),

        discount: z
            .number()
            .min(0, "Discount cannot be negative")
            .max(100, "Discount cannot exceed 100")
            .optional(),

        tags: z
            .array(z.string())
            .optional(),

        objectives: z
            .array(z.string())
            .optional(),

        requirements: z
            .array(z.string())
            .optional()
    }),

    params: z.object({
        courseId: z
            .string()
            .min(1, "Course ID is required")
    }),

    query: z.object({})
});