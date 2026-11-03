import { z } from "zod";
import { UserStatus } from "../../enums/UserStatus";

export const updateUserStatusSchema = z.object({
    params: z.object({
        userId: z.string().regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid user ID"
        )
    }),
    body: z.object({
        status: z.enum([
            UserStatus.ACTIVE,
            UserStatus.BLOCKED
        ])
    })
});