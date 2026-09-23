import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { createCourseSchema } from "../../shared/schema/course/createCourseSchema";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";
import { createCourseController } from "../../infrastructure/DI/courseDependencies";

import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../../shared/enums/UserRole";

const router = Router();

router.post(
    "/",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createCourseSchema),
    createCourseController.handle.bind(createCourseController)
);

export default router;