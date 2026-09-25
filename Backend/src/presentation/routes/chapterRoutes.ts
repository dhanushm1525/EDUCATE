import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";

import { createChapterSchema } from "../../shared/schema/chapter/createChapterSchema";

import { createChapterController, getChaptersByCourseController, getChapterByIdController, } from "../../infrastructure/DI/chapterDependencies";

import { getChaptersByCourseSchema } from "../../shared/schema/chapter/getChaptersByCourseSchema";

import { getChapterByIdSchema } from "../../shared/schema/chapter/getChapterByIdSchema";

const router = Router();

router.post(
    "/:courseId/chapters",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createChapterSchema),
    createChapterController.handle.bind(
        createChapterController
    )
);

router.get(
    "/:courseId/chapters",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getChaptersByCourseSchema),
    getChaptersByCourseController.handle.bind(
        getChaptersByCourseController
    )
);

router.get(
    "/:courseId/chapters/:chapterId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getChapterByIdSchema),
    getChapterByIdController.handle.bind(
        getChapterByIdController
    )
);



export default router;
