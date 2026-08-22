import { z } from "zod";


export const loginSchema = z.object({

    body: z.object({

        email: z
            .string()
            .trim()
            .email("Invalid email address"),

        password: z
            .string()
            .min(
                8,
                "Password must be at least 8 characters"
            )
    }),

    params: z.object({}),

    query: z.object({})
});