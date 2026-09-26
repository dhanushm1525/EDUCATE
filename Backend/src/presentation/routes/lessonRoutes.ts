import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";

import {
    createLessonController,getLessonsByChapterController,
} from "../../infrastructure/DI/lessonDependencies";

import { createLessonSchema } from "../../shared/schema/lesson/createLessonSchema";


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
export default router;