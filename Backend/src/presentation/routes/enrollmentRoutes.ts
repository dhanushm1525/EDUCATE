
import { Router } from "express";

import {
    authenticateUser,
} from "../../infrastructure/DI/authDependencies";

import {
    enrollInCourseController,
} from "../../infrastructure/DI/enrollmentDependencies";

import { UserRole } from "../../shared/enums/UserRole";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
    getMyEnrolledCoursesController,
} from "../../infrastructure/DI/enrollmentDependencies";

const router = Router();

router.post(
    "/:courseId",
    authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    enrollInCourseController.handle.bind(enrollInCourseController)
);

router.get(
    "/my-courses",
    authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    getMyEnrolledCoursesController.handle.bind(
        getMyEnrolledCoursesController
    )
);

export default router;
