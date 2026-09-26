import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";

import {
    createLessonController, getLessonsByChapterController, getLessonByIdController
} from "../../infrastructure/DI/lessonDependencies";

import { createLessonSchema } from "../../shared/schema/lesson/createLessonSchema";

import { getLessonByIdSchema } from "../../shared/schema/lesson/getLessonByIdSchema";


import { getLessonsByChapterSchema } from "../../shared/schema/lesson/getLessonsByChapterSchema";

const router = Router();

router.post(
    "/:courseId/chapters/:chapterId/lessons",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createLessonSchema),
    createLessonController.handle.bind(createLessonController)
);


router.get(
    "/:courseId/chapters/:chapterId/lessons",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getLessonsByChapterSchema),
    getLessonsByChapterController.handle.bind(
        getLessonsByChapterController
    )
);

router.get(
    "/:courseId/chapters/:chapterId/lessons/:lessonId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getLessonByIdSchema),
    getLessonByIdController.handle.bind(
        getLessonByIdController
    )
);
export default router;