
import {
    AssignmentSubmission,
    SubmissionStatus
} from "../../../domain/entities/AssignmentSubmission";

import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";

import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";

import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { GradeAssignmentSubmissionDTO } from "../../dtos/assingment/GradeAssignmentSubmissionDTO";

import { IGradeAssignmentSubmissionUseCase } from "../../interfaces/assingment/IGradeAssignmentSubmissionUseCase";

import { AppError } from "../../../shared/errors/AppError";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";


export class GradeAssignmentSubmissionUseCase
    implements IGradeAssignmentSubmissionUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        dto: GradeAssignmentSubmissionDTO
    ): Promise<AssignmentSubmission> {

        const {
            assignmentId,
            submissionId,
            teacherId,
            score,
            teacherFeedback
        } = dto;

        // 1. Validate IDs.
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (
            !objectIdPattern.test(assignmentId) ||
            !objectIdPattern.test(submissionId) ||
            !objectIdPattern.test(teacherId)
        ) {
            throw new AppError(
                "Invalid assignment, submission or teacher ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 2. Validate score.
        if (
            typeof score !== "number" ||
            !Number.isFinite(score) ||
            score < 0
        ) {
            throw new AppError(
                "Score must be a valid non-negative number",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 3. Validate feedback.
        if (
            teacherFeedback !== undefined &&
            (
                typeof teacherFeedback !== "string" ||
                teacherFeedback.trim().length > 2000
            )
        ) {
            throw new AppError(
                "Feedback must not exceed 2000 characters",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 4. Find assignment.
        const assignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!assignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 5. Find submission.
        const submission =
            await this._submissionRepository.findById(submissionId);

        if (!submission) {
            throw new AppError(
                "Submission not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 6. Verify submission belongs to assignment.
        if (submission.assignmentId !== assignmentId) {
            throw new AppError(
                "Submission does not belong to this assignment",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 7. Prevent grading an already graded submission.
        if (submission.status === SubmissionStatus.GRADED) {
            throw new AppError(
                "This submission has already been graded",
                HttpStatusCode.CONFLICT
            );
        }

        // 8. Validate score against assignment marks.
        if (score > assignment.totalMarks) {
            throw new AppError(
                "Score cannot exceed the assignment's total marks",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 9. Find lesson.
        const lesson =
            await this._lessonRepository.findById(assignment.lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 10. Find chapter.
        const chapter =
            await this._chapterRepository.findById(lesson.chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 11. Find course.
        const course =
            await this._courseRepository.findById(chapter.courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 12. Verify teacher ownership.
        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to grade this submission",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 13. Update grading information.
        submission.score = score;
        submission.isPassed = score >= assignment.passingMarks;

        submission.teacherFeedback = teacherFeedback?.trim();

        submission.gradedBy = teacherId;
        submission.gradedAt = new Date();

        submission.status = SubmissionStatus.GRADED;

        // 14. Persist updated submission.
        const updatedSubmission =
            await this._submissionRepository.update(
                submissionId,
                submission
            );

        if (!updatedSubmission) {
            throw new AppError(
                "Failed to update assignment submission",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        return updatedSubmission;
    }
}
