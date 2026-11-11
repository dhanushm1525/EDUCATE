import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { createChapterSchema } from "../../shared/schema/chapter/createChapterSchema";
import { getChaptersByCourseSchema } from "../../shared/schema/chapter/getChaptersByCourseSchema";
import { getChapterByIdSchema } from "../../shared/schema/chapter/getChapterByIdSchema";
import { updateChapterSchema } from "../../shared/schema/chapter/updateChapterSchema";
import { deleteChapterSchema } from "../../shared/schema/chapter/deleteChapterSchema";
import type { RouteDependencies } from "./routeDependencies";

export const createChapterRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "chapters">) => {
const router = Router();

router.post(
    "/:courseId/chapters",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(createChapterSchema),
    dependencies.chapters.create.handle.bind(dependencies.chapters.create)
);

router.get(
    "/:courseId/chapters",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getChaptersByCourseSchema),
    dependencies.chapters.getByCourse.handle.bind(dependencies.chapters.getByCourse)
);

router.get(
    "/:courseId/chapters/:chapterId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(getChapterByIdSchema),
    dependencies.chapters.getById.handle.bind(dependencies.chapters.getById)
);

router.patch(
    "/:courseId/chapters/:chapterId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(updateChapterSchema),
    dependencies.chapters.update.handle.bind(dependencies.chapters.update)
);

router.delete(
    "/:courseId/chapters/:chapterId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    validate(deleteChapterSchema),
    dependencies.chapters.delete.handle.bind(dependencies.chapters.delete)
);



return router;
};
