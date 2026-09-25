import { Router } from "express";

import { validate } from "../middlewares/validationMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";

import { createChapterController } from "../../infrastructure/DI/chapterDependencies";

import { createChapterSchema } from "../../shared/schema/chapter/createChapterSchema";

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



export default router;
