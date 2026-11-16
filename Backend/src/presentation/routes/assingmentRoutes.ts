
import { Router } from "express";

import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "../../shared/enums/UserRole";
import type { RouteDependencies } from "./routeDependencies";

export const createAssignmentRoutes = (dependencies: Pick<RouteDependencies, "authenticateUser" | "assignments">) => {
const router = Router();

// ========================================
// STUDENT ASSIGNMENT ROUTES
// ========================================

// Get Assignment for Student
router.get(
    "/assignments/student/lessons/:lessonId/assignment",
    dependencies.authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    dependencies.assignments.getStudent.handle.bind(dependencies.assignments.getStudent)
);

// Save Assignment Answers
router.patch(
    "/assignments/student/assignments/:assignmentId/answers",
    dependencies.authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    dependencies.assignments.saveAnswers.handle.bind(
        dependencies.assignments.saveAnswers
    )
);

// Submit Assignment
router.post(
    "/assignments/student/assignments/:assignmentId/submit",
    dependencies.authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    dependencies.assignments.submit.handle.bind(dependencies.assignments.submit)
);

// Get Assignment Results
router.get(
    "/assignments/student/assignments/:assignmentId/results",
    dependencies.authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    dependencies.assignments.getResults.handle.bind(dependencies.assignments.getResults)
);

// ========================================
// TEACHER ASSIGNMENT ROUTES
// ========================================

// Create Assignment
router.post(
    "/lessons/:lessonId/assignment",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.assignments.create.handle.bind(dependencies.assignments.create)
);

// Get Assignment
router.get(
    "/lessons/:lessonId/assignment",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.assignments.getByLesson.handle.bind(dependencies.assignments.getByLesson)
);

// Update Assignment
router.patch(
    "/assignments/:assignmentId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.assignments.update.handle.bind(dependencies.assignments.update)
);

// Delete Assignment
router.delete(
    "/assignments/:assignmentId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.assignments.delete.handle.bind(dependencies.assignments.delete)
);

// Get Teacher Assignment Submissions
router.get(
    "/teacher/assignments/:assignmentId/submissions",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.assignments.getTeacherSubmissions.handle.bind(dependencies.assignments.getTeacherSubmissions)
);

// Get Individual Teacher Submission Details
router.get(
    "/teacher/assignments/:assignmentId/submissions/:submissionId",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.assignments.getTeacherSubmissionDetail.handle.bind(dependencies.assignments.getTeacherSubmissionDetail)
);

// Grade Assignment Submission
router.patch(
    "/teacher/assignments/:assignmentId/submissions/:submissionId/grade",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    dependencies.assignments.gradeSubmission.handle.bind(dependencies.assignments.gradeSubmission)
);


router.get(
    "/teacher/assignments",
    dependencies.authenticateUser,
    roleMiddleware(UserRole.TEACHER),
    (req, res, next) =>
        dependencies.assignments.getTeacherAssignments.handle(req, res, next)
);


// Start Assignment Attempt
router.post(
    "/assignments/student/assignments/:assignmentId/start",
    dependencies.authenticateUser,
    roleMiddleware([UserRole.STUDENT, UserRole.TEACHER]),
    dependencies.assignments.startAttempt.handle.bind(
        dependencies.assignments.startAttempt
    )
);


return router;
};
