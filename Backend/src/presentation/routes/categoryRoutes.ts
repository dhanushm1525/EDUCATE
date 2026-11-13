import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { createCategorySchema } from "../../shared/schema/category/createCategorySchema";

import type { RouteDependencies } from "./routeDependencies";

export const createCategoryRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "categories">) => {
    const router = Router();

    router.post(
        "/",
        dependencies.authenticateUser,
        roleMiddleware(UserRole.ADMIN),
        validate(createCategorySchema),
        dependencies.categories.create.handle.bind(dependencies.categories.create)
    );

    router.get(
        "/",
        dependencies.categories.getAll.handle.bind(dependencies.categories.getAll)
    );

    return router;
};