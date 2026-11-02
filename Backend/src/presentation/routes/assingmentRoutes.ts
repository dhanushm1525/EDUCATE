
import { Router } from "express";

import {
    createAssignmentController,
    getAssignmentController,
    updateAssignmentController,
    deleteAssignmentController,
    getStudentAssignmentController,
    submitAssignmentController,
    getAssignmentResultsController,
    getTeacherAssignmentSubmissionsController,
    getTeacherSubmissionDetailController,
    gradeAssignmentSubmissionController,
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


// Get Teacher Assignment Submissions
router.get(
    "/teacher/assignments/:assignmentId/submissions",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    getTeacherAssignmentSubmissionsController.handle.bind(
        getTeacherAssignmentSubmissionsController
    )
);

// Get Individual Teacher Submission Details
router.get(
    "/teacher/assignments/:assignmentId/submissions/:submissionId",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    getTeacherSubmissionDetailController.handle.bind(
        getTeacherSubmissionDetailController
    )
);

// Grade Assignment Submission
router.patch(
    "/teacher/assignments/:assignmentId/submissions/:submissionId/grade",
    authMiddleware(jwtService),
    roleMiddleware(UserRole.TEACHER),
    gradeAssignmentSubmissionController.handle.bind(
        gradeAssignmentSubmissionController
    )
);

export default router;
