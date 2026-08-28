import { z } from "zod";


export const verifyEmailOtpSchema = z.object({

    body: z.object({

        userId: z
            .string()
            .min(
                1,
                "User ID is required"
            ),

        otp: z
            .string()
            .trim()
            .length(
                6,
                "OTP must be exactly 6 digits"
            )
            .regex(
                /^\d{6}$/,
                "OTP must contain only numbers"
            )

    }),

    params: z.object({}),

    query: z.object({})

});