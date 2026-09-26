import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";

import { createChapterSchema } from "../../shared/schema/chapter/createChapterSchema";

import { createChapterController, getChaptersByCourseController, getChapterByIdController,updateChapterController,deleteChapterController } from "../../infrastructure/DI/chapterDependencies";

import { getChaptersByCourseSchema } from "../../shared/schema/chapter/getChaptersByCourseSchema";

import { getChapterByIdSchema } from "../../shared/schema/chapter/getChapterByIdSchema";
import { updateChapterSchema } from "../../shared/schema/chapter/updateChapterSchema";
import { deleteChapterSchema } from "../../shared/schema/chapter/deleteChapterSchema";

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

router.patch(
    "/:courseId/chapters/:chapterId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(updateChapterSchema),
    updateChapterController.handle.bind(
        updateChapterController
    )
);

router.delete(
    "/:courseId/chapters/:chapterId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(deleteChapterSchema),
    deleteChapterController.handle.bind(
        deleteChapterController
    )
);



export default router;
