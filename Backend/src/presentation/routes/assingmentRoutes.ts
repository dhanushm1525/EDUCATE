import { Router } from "express";

import {
    createAssignmentController,
    getAssignmentController,
    updateAssignmentController,
    deleteAssignmentController,
} from "../../infrastructure/DI/assignmentDependencies";

import { jwtService } from "../../infrastructure/DI/authDependencies";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";

const router = Router();


// Create Assignment
router.post(
    "/lessons/:lessonId/assignment",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    createAssignmentController.handle.bind(
        createAssignmentController
    )
);


// Get Assignment
router.get(
    "/lessons/:lessonId/assignment",
    authMiddleware(jwtService),
    getAssignmentController.handle.bind(
        getAssignmentController
    )
);


// Update Assignment
router.patch(
    "/assignments/:assignmentId",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    updateAssignmentController.handle.bind(
        updateAssignmentController
    )
);


// Delete Assignment
router.delete(
    "/assignments/:assignmentId",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    deleteAssignmentController.handle.bind(
        deleteAssignmentController
    )
);

export default router;