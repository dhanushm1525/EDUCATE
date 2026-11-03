import { Router } from "express";

import {
    authenticateUser
} from "../../infrastructure/DI/authDependencies";

import {
    getUsersController,
    updateUserStatusController
} from "../../infrastructure/DI/userDependencies";

import { roleMiddleware } from "../middlewares/roleMiddleware";
import { validate } from "../middlewares/validationMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { getUsersSchema } from "../../shared/schema/user/getUsersSchema";
import { updateUserStatusSchema } from "../../shared/schema/user/updateUserStatusSchema";

const router = Router();

router.use(
    authenticateUser,
    roleMiddleware(UserRole.ADMIN)
);

// GET /api/admin/users
router.get(
    "/",
    validate(getUsersSchema),
    getUsersController.handle.bind(getUsersController)
);

// PATCH /api/admin/users/:userId/status
router.patch(
    "/:userId/status",
    validate(updateUserStatusSchema),
    updateUserStatusController.handle.bind(
        updateUserStatusController
    )
);

export default router;