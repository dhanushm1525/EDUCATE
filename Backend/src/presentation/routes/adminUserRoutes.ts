import { Router } from "express";

import { roleMiddleware } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validationMiddleware";
import type { RouteDependencies } from "./routeDependencies";

import { UserRole } from "../../shared/enums/UserRole";

import { getUsersSchema } from "../../shared/schema/user/getUsersSchema";
import { updateUserStatusSchema } from "../../shared/schema/user/updateUserStatusSchema";

export const createAdminUserRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "users">) => {
const router = Router();

router.use(
    dependencies.authenticateUser,
    roleMiddleware(UserRole.ADMIN)
);

// GET /api/admin/users
router.get(
    "/",
    validate(getUsersSchema),
    dependencies.users.getUsers.handle.bind(dependencies.users.getUsers)
);

// PATCH /api/admin/users/:userId/status
router.patch(
    "/:userId/status",
    validate(updateUserStatusSchema),
    dependencies.users.updateUserStatus.handle.bind(dependencies.users.updateUserStatus)
);

return router;
};