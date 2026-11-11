
import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";

import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { createCourseSchema } from "../../shared/schema/course/createCourseSchema";
import { updateCourseSchema } from "../../shared/schema/course/updateCourseSchema";
import { getPublishedCoursesSchema } from "../../shared/schema/course/getPublishedCoursesSchema";
import { getPublishedCourseByIdSchema } from "../../shared/schema/course/getPublishedCourseByIdSchema";
import { generateCourseThumbnailUploadUrlSchema } from "../../shared/schema/course/generateCourseThumbnailUploadUrlSchema";
import type { RouteDependencies } from "./routeDependencies";

export const createCourseRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "courses">) => {
const router = Router();


// ============================================
// TEACHER: COURSE MANAGEMENT
// ============================================

// Teacher: retrieve an owned course, including unpublished courses.
router.get(
    "/:courseId/manage",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.courses.getTeacherById.handle.bind(dependencies.courses.getTeacherById)
);

// Teacher: retrieve own courses.
router.get(
    "/my-courses",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.courses.getMine.handle.bind(dependencies.courses.getMine)
);

// Teacher: create a course.
router.post(
    "/",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createCourseSchema),
    dependencies.courses.create.handle.bind(dependencies.courses.create)
);

// Teacher: generate a signed upload URL for a course thumbnail.
router.post(
    "/:courseId/thumbnail/upload-url",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(generateCourseThumbnailUploadUrlSchema),
    dependencies.courses.generateThumbnailUploadUrl.handle.bind(dependencies.courses.generateThumbnailUploadUrl)
);

// Teacher: update a course.
router.patch(
    "/:courseId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(updateCourseSchema),
    dependencies.courses.update.handle.bind(dependencies.courses.update)
);

// Teacher: submit a course for approval.
router.patch(
    "/:courseId/submit",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.courses.submit.handle.bind(dependencies.courses.submit)
);


// ============================================
// ADMIN: COURSE MANAGEMENT
// ============================================

// Admin: retrieve courses awaiting approval.
router.get(
    "/pending",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    dependencies.courses.getPending.handle.bind(dependencies.courses.getPending)
);

// Admin: approve a course awaiting review.
router.patch(
    "/:courseId/approve",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    dependencies.courses.approve.handle.bind(dependencies.courses.approve)
);

// Admin: reject a course awaiting review.
router.patch(
    "/:courseId/reject",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.ADMIN),
    dependencies.courses.reject.handle.bind(dependencies.courses.reject)
);


// ============================================
// PUBLIC: COURSE DISCOVERY
// ============================================

// Public: browse and filter published courses.
router.get(
    "/",
    validate(getPublishedCoursesSchema),
    dependencies.courses.getPublished.handle.bind(dependencies.courses.getPublished)
);

// Public: retrieve chapters, lessons and thumbnail previews.
router.get(
    "/:courseId/learning-content",
    validate(getPublishedCourseByIdSchema),
    dependencies.courses.getLearningContent.handle.bind(dependencies.courses.getLearningContent)
);

// Public: retrieve one published course.
router.get(
    "/:courseId",
    validate(getPublishedCourseByIdSchema),
    dependencies.courses.getPublishedById.handle.bind(dependencies.courses.getPublishedById)
);

return router;
};
