import { z } from "zod";
import { UserRole } from "../../enums/UserRole";
import { UserStatus } from "../../enums/UserStatus";

export const getUsersSchema = z.object({
    query: z.object({
        role: z.nativeEnum(UserRole).optional(),
        status: z.nativeEnum(UserStatus).optional(),
        search: z.string().trim().max(100).optional(),
        page: z.coerce.number().int().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional()
    })
});