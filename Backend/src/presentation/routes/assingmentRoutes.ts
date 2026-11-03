
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
    getTeacherAssignmentsController,
} from "../../infrastructure/DI/assignmentDependencies";

import { authenticateUser } from "../../infrastructure/DI/authDependencies";


import { roleMiddleware } from "../middlewares/roleMiddleware";


import { UserRole } from "../../shared/enums/UserRole";

const router = Router();

// ========================================
// STUDENT ASSIGNMENT ROUTES
// ========================================

// Get Assignment for Student
router.get(
    "/assignments/student/lessons/:lessonId/assignment",
    authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    getStudentAssignmentController.handle.bind(
        getStudentAssignmentController
    )
);

// Submit Assignment
router.post(
    "/assignments/student/assignments/:assignmentId/submit",
    authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    submitAssignmentController.handle.bind(
        submitAssignmentController
    )
);

// Get Assignment Results
router.get(
    "/assignments/student/assignments/:assignmentId/results",
    authenticateUser,
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
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    createAssignmentController.handle.bind(
        createAssignmentController
    )
);

// Get Assignment
router.get(
    "/lessons/:lessonId/assignment",
    authenticateUser,
    getAssignmentController.handle.bind(
        getAssignmentController
    )
);

// Update Assignment
router.patch(
    "/assignments/:assignmentId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    updateAssignmentController.handle.bind(
        updateAssignmentController
    )
);

// Delete Assignment
router.delete(
    "/assignments/:assignmentId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    deleteAssignmentController.handle.bind(
        deleteAssignmentController
    )
);

// Get Teacher Assignment Submissions
router.get(
    "/teacher/assignments/:assignmentId/submissions",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    getTeacherAssignmentSubmissionsController.handle.bind(
        getTeacherAssignmentSubmissionsController
    )
);

// Get Individual Teacher Submission Details
router.get(
    "/teacher/assignments/:assignmentId/submissions/:submissionId",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    getTeacherSubmissionDetailController.handle.bind(
        getTeacherSubmissionDetailController
    )
);

// Grade Assignment Submission
router.patch(
    "/teacher/assignments/:assignmentId/submissions/:submissionId/grade",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    gradeAssignmentSubmissionController.handle.bind(
        gradeAssignmentSubmissionController
    )
);


router.get(
    "/teacher/assignments",
    authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    (req, res, next) =>
        getTeacherAssignmentsController.handle(req, res, next)
);


export default router;
