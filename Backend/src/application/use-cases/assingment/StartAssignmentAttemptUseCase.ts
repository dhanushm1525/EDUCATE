
import {
    AssignmentSubmission,
    SubmissionStatus
} from "../../../domain/entities/AssignmentSubmission";

import { EnrollmentStatus } from "../../../domain/entities/Enrollment";

import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { IStartAssignmentAttemptUseCase } from "../../interfaces/assingment/IStartAssignmentAttemptUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class StartAssignmentAttemptUseCase
    implements IStartAssignmentAttemptUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository
    ) {}

    async execute(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmission> {

        // 1. Validate IDs.
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (
            !objectIdPattern.test(assignmentId) ||
            !objectIdPattern.test(userId)
        ) {
            throw new AppError(
                "Invalid assignment ID or user ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 2. Find assignment.
        const assignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!assignment || !assignment.assignmentId) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 3. Find lesson, chapter and course.
        const lesson =
            await this._lessonRepository.findById(assignment.lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const chapter =
            await this._chapterRepository.findById(lesson.chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const course =
            await this._courseRepository.findById(chapter.courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Verify active enrollment.
        const enrollment =
            await this._enrollmentRepository.findByUserAndCourse(
                userId,
                chapter.courseId
            );

        if (
            !enrollment ||
            enrollment.status !== EnrollmentStatus.ACTIVE
        ) {
            throw new AppError(
                "You must be actively enrolled to start this assignment",
                HttpStatusCode.FORBIDDEN
            );
        }

        const now = new Date();

        // 5. Check for an existing active attempt.
        const activeAttempt =
            await this._submissionRepository.findActiveAttempt(
                assignmentId,
                userId
            );

        if (activeAttempt) {

            const attemptExpired =
                activeAttempt.expiresAt !== undefined &&
                now.getTime() >= activeAttempt.expiresAt.getTime();

            if (!attemptExpired) {
                // Resume the same attempt instead of creating another.
                return activeAttempt;
            }

            // Expire the old attempt before allowing a new one.
            if (!activeAttempt.submissionId) {
                throw new AppError(
                    "Unable to identify the expired attempt",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }

            await this._submissionRepository.update(
                activeAttempt.submissionId,
                {
                    ...activeAttempt,
                    status: SubmissionStatus.EXPIRED,
                    updatedAt: now
                }
            );
        }

        // 6. Check assignment deadline.
        if (
            assignment.dueDate &&
            now.getTime() >= assignment.dueDate.getTime()
        ) {
            throw new AppError(
                "The assignment deadline has passed",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 7. Retrieve previous attempts.
        const previousAttempts =
            await this._submissionRepository.findByAssignmentAndUser(
                assignmentId,
                userId
            );

        const attemptsUsed = previousAttempts.length;

        // 8. Enforce attempt limit.
        if (
            assignment.attemptsAllowed !== undefined &&
            attemptsUsed >= assignment.attemptsAllowed
        ) {
            throw new AppError(
                "You have used all your allowed attempts",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 9. Calculate the next attempt number.
        const attemptNumber =
            previousAttempts.reduce(
                (highest, attempt) =>
                    Math.max(highest, attempt.attemptNumber),
                0
            ) + 1;

        // 10. Calculate expiry using the server clock.
        let expiresAt: Date | undefined;

        if (assignment.timeLimit !== undefined) {
            expiresAt = new Date(
                now.getTime() + assignment.timeLimit * 60 * 1000
            );
        }

        // The assignment deadline takes precedence if it is earlier.
        if (
            assignment.dueDate &&
            (
                !expiresAt ||
                assignment.dueDate.getTime() < expiresAt.getTime()
            )
        ) {
            expiresAt = assignment.dueDate;
        }

        // 11. Create the in-progress attempt.
        const attempt: AssignmentSubmission = {
            assignmentId,
            userId,

            answers: [],

            attemptNumber,

            score: 0,
            totalMarks: assignment.totalMarks,
            passingMarks: assignment.passingMarks,
            isPassed: false,

            status: SubmissionStatus.IN_PROGRESS,

            startedAt: now,
            expiresAt,

            createdAt: now,
            updatedAt: now
        };

        return this._submissionRepository.create(attempt);
    }
}
