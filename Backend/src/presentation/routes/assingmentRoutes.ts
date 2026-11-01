
import { Router } from "express";

import {
    createAssignmentController,
    getAssignmentController,
    updateAssignmentController,
    deleteAssignmentController,
    getStudentAssignmentController,
    submitAssignmentController,
    getAssignmentResultsController,
} from "../../infrastructure/DI/assignmentDependencies";

import { jwtService } from "../../infrastructure/DI/authDependencies";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

import { UserRole } from "../../shared/enums/UserRole";


const router = Router();


// ========================================
// STUDENT ASSIGNMENT ROUTES
// ========================================

// Get Assignment for Student
router.get(
    "/student/lessons/:lessonId/assignment",
    authMiddleware(jwtService),
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    getStudentAssignmentController.handle.bind(
        getStudentAssignmentController
    )
);


// Submit Assignment
router.post(
    "/student/assignments/:assignmentId/submit",
    authMiddleware(jwtService),
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    submitAssignmentController.handle.bind(
        submitAssignmentController
    )
);

// Get Assignment Results
router.get(
    "/student/assignments/:assignmentId/results",
    authMiddleware(jwtService),
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    getAssignmentResultsController.handle.bind(
        getAssignmentResultsController
    )
);


// ========================================
// TEACHER ASSIGNMENT ROUTES
// ========================================

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
