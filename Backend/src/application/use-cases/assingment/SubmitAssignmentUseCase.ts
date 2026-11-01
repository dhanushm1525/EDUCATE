
import {
    AssignmentSubmission,
    SubmissionStatus,
} from "../../../domain/entities/AssignmentSubmission";

import { EnrollmentStatus } from "../../../domain/entities/Enrollment";

import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { SubmitAssignmentDTO } from "../../dtos/assingment/SubmitAssignmentDTO";
import { ISubmitAssignmentUseCase } from "../../interfaces/assingment/ISubmitAssignmentUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class SubmitAssignmentUseCase
    implements ISubmitAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository
    ) {}

    async execute(
        dto: SubmitAssignmentDTO
    ): Promise<AssignmentSubmission> {

        const { assignmentId, userId, answers } = dto;

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

        // 2. Validate answer payload.
        if (!Array.isArray(answers) || answers.length === 0) {
            throw new AppError(
                "At least one answer is required",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 3. Find assignment.
        const assignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!assignment || !assignment.assignmentId) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Find lesson.
        const lesson =
            await this._lessonRepository.findById(assignment.lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 5. Find chapter.
        const chapter =
            await this._chapterRepository.findById(lesson.chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 6. Find course.
        const course =
            await this._courseRepository.findById(chapter.courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 7. Verify active enrollment.
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
                "You must be actively enrolled to submit this assignment",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 8. Check assignment deadline.
        const now = new Date();

        if (
            assignment.dueDate &&
            now.getTime() > assignment.dueDate.getTime()
        ) {
            throw new AppError(
                "The assignment deadline has passed",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 9. Retrieve previous attempts.
        const previousSubmissions =
            await this._submissionRepository.findByAssignmentAndUser(
                assignmentId,
                userId
            );

        const attemptsUsed = previousSubmissions.length;

        // 10. Enforce attempt limit.
        if (
            assignment.attemptsAllowed !== undefined &&
            attemptsUsed >= assignment.attemptsAllowed
        ) {
            throw new AppError(
                "You have used all your allowed attempts",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 11. Validate question IDs and prevent duplicate answers.
        const questionIds = new Set(
            assignment.questions.map(question => question.questionId)
        );

        const submittedQuestionIds = new Set<string>();

        for (const answer of answers) {

            if (
                !answer.questionId ||
                typeof answer.selectedAnswer !== "string" ||
                !answer.selectedAnswer.trim()
            ) {
                throw new AppError(
                    "Invalid answer data",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (submittedQuestionIds.has(answer.questionId)) {
                throw new AppError(
                    "Duplicate question answers are not allowed",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (!questionIds.has(answer.questionId)) {
                throw new AppError(
                    "An invalid question was submitted",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            submittedQuestionIds.add(answer.questionId);
        }

        // 12. Require an answer for every question.
        if (submittedQuestionIds.size !== assignment.questions.length) {
            throw new AppError(
                "Please answer all assignment questions",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 13. Calculate marks on the backend.
        let score = 0;

        for (const question of assignment.questions) {

            const submittedAnswer = answers.find(
                answer => answer.questionId === question.questionId
            );

            if (!submittedAnswer) {
                continue;
            }

            const selectedOption = question.options.find(
                option => option === submittedAnswer.selectedAnswer.trim()
            );

            if (!selectedOption) {
                throw new AppError(
                    "An invalid option was selected",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (selectedOption === question.correctAnswer) {
                score += question.marks;
            }
        }

        // 14. Calculate attempt number.
        const attemptNumber = attemptsUsed + 1;

        // 15. Create submission.
        const submission: AssignmentSubmission = {
            assignmentId,
            userId,

            answers: answers.map(answer => ({
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer.trim(),
            })),

            attemptNumber,

            score,
            totalMarks: assignment.totalMarks,
            passingMarks: assignment.passingMarks,
            isPassed: score >= assignment.passingMarks,

            status: SubmissionStatus.SUBMITTED,

            submittedAt: now,
            createdAt: now,
            updatedAt: now,
        };

        return this._submissionRepository.create(submission);
    }
}
