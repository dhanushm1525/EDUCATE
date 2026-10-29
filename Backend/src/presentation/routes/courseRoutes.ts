
import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import {
    authenticateUser,
    jwtService,
} from "../../infrastructure/DI/authDependencies";

import {
    createCourseController,
    updateCourseController,
    submitCourseController,
    getMyCoursesController,
    getPublishedCoursesController,
    getPublishedCourseByIdController,
    getPendingCoursesController,
    approveCourseController,
    rejectCourseController
} from "../../infrastructure/DI/courseDependencies";

import { createCourseSchema } from "../../shared/schema/course/createCourseSchema";
import { updateCourseSchema } from "../../shared/schema/course/updateCourseSchema";
import { getPublishedCoursesSchema } from "../../shared/schema/course/getPublishedCoursesSchema";
import { getPublishedCourseByIdSchema } from "../../shared/schema/course/getPublishedCourseByIdSchema";

const router = Router();

// Teacher: retrieve own courses.
router.get(
    "/my-courses",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    getMyCoursesController.handle.bind(getMyCoursesController)
);

// Public: browse and filter published courses.
router.get(
    "/",
    validate(getPublishedCoursesSchema),
    getPublishedCoursesController.handle.bind(
        getPublishedCoursesController
    )
);

// Admin: retrieve courses awaiting approval.
router.get(
    "/pending",
    authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    getPendingCoursesController.handle.bind(
        getPendingCoursesController
    )
);

// Admin: approve a course awaiting review.
router.patch(
    "/:courseId/approve",
    authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    approveCourseController.handle.bind(approveCourseController)
);

// Admin: reject a course awaiting review.
router.patch(
    "/:courseId/reject",
    authenticateUser, 
    roleMiddleware(UserRole.ADMIN),
    rejectCourseController.handle.bind(rejectCourseController)
);

// Public: retrieve one published course.
router.get(
    "/:courseId",
    validate(getPublishedCourseByIdSchema),
    getPublishedCourseByIdController.handle.bind(
        getPublishedCourseByIdController
    )
);

// Teacher: create a course.
router.post(
    "/",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createCourseSchema),
    createCourseController.handle.bind(createCourseController)
);

// Teacher: update a course.
router.patch(
    "/:courseId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(updateCourseSchema),
    updateCourseController.handle.bind(updateCourseController)
);

// Teacher: submit a course for approval.
router.patch(
    "/:courseId/submit",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    submitCourseController.handle.bind(submitCourseController)
);





export default router;
