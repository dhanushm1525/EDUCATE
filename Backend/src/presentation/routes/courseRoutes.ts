import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { createCourseSchema } from "../../shared/schema/course/createCourseSchema";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";
import { createCourseController,updateCourseController } from "../../infrastructure/DI/courseDependencies";

import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../../shared/enums/UserRole";

import { updateCourseSchema } from "../../shared/schema/course/updateCourseSchema";

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


export default router;