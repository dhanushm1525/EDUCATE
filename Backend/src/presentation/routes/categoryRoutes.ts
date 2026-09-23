import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { createCategorySchema } from "../../shared/schema/category/createCategorySchema";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";

import {
    createCategoryController
} from "../../infrastructure/DI/categoryDependencies";

const router = Router();

router.post(
    "/",
    authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    validate(createCategorySchema),
    createCategoryController.handle.bind(createCategoryController)
);

export default router;