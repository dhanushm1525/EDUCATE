import { z } from "zod";


export const resetPasswordSchema = z.object({

    body: z.object({

        email: z
            .string()
            .trim()
            .email("Invalid email address"),


        otp: z
            .string()
            .trim()
            .length(
                6,
                "OTP must be 6 digits"
            )
            .regex(
                /^\d{6}$/,
                "OTP must contain only digits"
            ),


        newPassword: z
            .string()
            .min(
                8,
                "Password must be at least 8 characters"
            )

    }),

    params: z.object({}),

    query: z.object({})

});