import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { createCourseSchema } from "../../shared/schema/course/createCourseSchema";

import { authenticateUser, jwtService } from "../../infrastructure/DI/authDependencies";
import { createCourseController,updateCourseController } from "../../infrastructure/DI/courseDependencies";

import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../../shared/enums/UserRole";

import { updateCourseSchema } from "../../shared/schema/course/updateCourseSchema";
import { authMiddleware } from "../middlewares/authMiddleware";
import { submitCourseController } from "../../infrastructure/DI/courseDependencies";

const router = Router();

router.post(
    "/",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createCourseSchema),
    createCourseController.handle.bind(createCourseController)
);


router.patch(
    "/:courseId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(updateCourseSchema),
    updateCourseController.handle.bind(updateCourseController)
);

router.patch(
    "/:courseId/submit",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    submitCourseController.handle.bind(submitCourseController)
);


export default router;