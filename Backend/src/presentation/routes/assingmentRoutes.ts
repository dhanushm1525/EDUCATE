import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { jwtService } from "../../infrastructure/DI/authDependencies";
import { createAssignmentController } from "../../infrastructure/DI/assignmentDependencies";

import { UserRole } from "../../shared/enums/UserRole";

const router = Router();

router.post(
    "/lessons/:lessonId/assignment",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    createAssignmentController.handle.bind(
        createAssignmentController
    )
);

export default router;