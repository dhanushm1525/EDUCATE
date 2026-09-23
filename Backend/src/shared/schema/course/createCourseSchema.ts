import { z } from "zod";
import { CourseLevel } from "../../enums/CourseLevel";

export const createCourseSchema = z.object({
    body: z.object({
        categoryId: z
            .string()
            .min(1, "Category is required"),

        title: z
            .string()
            .min(3, "Title must be at least 3 characters")
            .max(150, "Title cannot exceed 150 characters"),

        subtitle: z
            .string()
            .min(3, "Subtitle must be at least 3 characters")
            .max(250, "Subtitle cannot exceed 250 characters"),

        description: z
            .string()
            .min(10, "Description must be at least 10 characters"),

        thumbnail: z
            .string()
            .optional(),

        trailer: z
            .string()
            .optional(),

        language: z
            .string()
            .min(2, "Language is required"),

        level: z
            .nativeEnum(CourseLevel),

        duration: z
            .number()
            .positive("Duration must be greater than 0"),

        price: z
            .number()
            .min(0, "Price cannot be negative"),

        discount: z
            .number()
            .min(0, "Discount cannot be negative")
            .max(100, "Discount cannot exceed 100"),

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

    params: z.object({}),

    query: z.object({})
});