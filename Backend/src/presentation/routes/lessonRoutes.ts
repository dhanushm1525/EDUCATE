import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { createLessonSchema } from "../../shared/schema/lesson/createLessonSchema";

import { getLessonByIdSchema } from "../../shared/schema/lesson/getLessonByIdSchema";


import { getLessonsByChapterSchema } from "../../shared/schema/lesson/getLessonsByChapterSchema";

import { updateLessonSchema } from "../../shared/schema/lesson/updateLessonSchema";

import { deleteLessonSchema } from "../../shared/schema/lesson/deleteLessonSchema";

import { generateLessonMediaUploadUrlSchema } from "../../shared/schema/lesson/generateLessonMediaUploadUrlSchema";


import { cleanupLessonMediaSchema } from "../../shared/schema/lesson/cleanupLessonMediaSchema";
import type { RouteDependencies } from "./routeDependencies";

export const createLessonRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "lessons">) => {
const router = Router();

router.post(
    "/:courseId/chapters/:chapterId/lessons",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createLessonSchema),
    dependencies.lessons.create.handle.bind(dependencies.lessons.create)
);


router.get(
    "/:courseId/chapters/:chapterId/lessons",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getLessonsByChapterSchema),
    dependencies.lessons.getByChapter.handle.bind(dependencies.lessons.getByChapter)
);

router.get(
    "/:courseId/chapters/:chapterId/lessons/:lessonId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getLessonByIdSchema),
    dependencies.lessons.getById.handle.bind(dependencies.lessons.getById)
);

// Student and enrolled teacher: retrieve lesson content.
router.get(
    "/:courseId/chapters/:chapterId/lessons/:lessonId/student",
    dependencies.authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    dependencies.lessons.getStudentLesson.handle.bind(dependencies.lessons.getStudentLesson)
);


router.patch(
    "/:courseId/chapters/:chapterId/lessons/:lessonId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(updateLessonSchema),
    dependencies.lessons.update.handle.bind(dependencies.lessons.update)
);

router.delete(
    "/:courseId/chapters/:chapterId/lessons/:lessonId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(deleteLessonSchema),
    dependencies.lessons.delete.handle.bind(dependencies.lessons.delete)
);


router.post(
    "/:courseId/chapters/:chapterId/lessons/:lessonId/media/upload-url",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(generateLessonMediaUploadUrlSchema),
    dependencies.lessons.generateMediaUploadUrl.handle.bind(dependencies.lessons.generateMediaUploadUrl)
);

router.delete(
    "/:courseId/chapters/:chapterId/lessons/:lessonId/media",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(cleanupLessonMediaSchema),
    dependencies.lessons.cleanupMedia.handle.bind(dependencies.lessons.cleanupMedia)
);



return router;
};