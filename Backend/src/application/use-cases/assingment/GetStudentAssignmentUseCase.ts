
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { EnrollmentStatus } from "../../../domain/entities/Enrollment";

import { StudentAssignmentDTO } from "../../dtos/assingment/StudentAssignmentDTO";
import { IGetStudentAssignmentUseCase } from "../../interfaces/assingment/IGetStudentAssignmentUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetStudentAssignmentUseCase
    implements IGetStudentAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository
    ) {}

    async execute(
        lessonId: string,
        userId: string
    ): Promise<StudentAssignmentDTO> {

        // 1. Validate IDs.
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (
            !objectIdPattern.test(lessonId) ||
            !objectIdPattern.test(userId)
        ) {
            throw new AppError(
                "Invalid lesson ID or user ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 2. Find the lesson.
        const lesson = await this._lessonRepository.findById(lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 3. Find the chapter.
        const chapter = await this._chapterRepository.findById(
            lesson.chapterId
        );

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Find the course.
        const course = await this._courseRepository.findById(
            chapter.courseId
        );

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 5. Verify active enrollment.
        const enrollment =
            await this._enrollmentRepository.findByUserAndCourse(
                userId,
                chapter.courseId
            );

        if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
            throw new AppError(
                "You must be actively enrolled in this course to access the assignment",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 6. Find the assignment.
        const assignment =
            await this._assignmentRepository.findByLessonId(lessonId);

        if (!assignment || !assignment.assignmentId) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 7. Retrieve previous attempts.
        const submissions =
            await this._submissionRepository.findByAssignmentAndUser(
                assignment.assignmentId,
                userId
            );

        const attemptsUsed = submissions.length;

        // 8. Calculate remaining attempts.
        const attemptsRemaining =
            assignment.attemptsAllowed === undefined
                ? null
                : Math.max(
                    assignment.attemptsAllowed - attemptsUsed,
                    0
                );

        // 9. Check deadline.
        const now = new Date();

        const isExpired =
            assignment.dueDate != null &&
            now.getTime() > assignment.dueDate.getTime();

        const canAttempt =
            !isExpired &&
            (
                attemptsRemaining === null ||
                attemptsRemaining > 0
            );

        // 10. Return safe student DTO.
        return {
            assignmentId: assignment.assignmentId,
            lessonId: assignment.lessonId,

            title: assignment.title,
            description: assignment.description,

            questions: assignment.questions.map(question => ({
                questionId: question.questionId,
                question: question.question,
                options: question.options,
                marks: question.marks,
            })),

            totalMarks: assignment.totalMarks,
            passingMarks: assignment.passingMarks,

            timeLimit: assignment.timeLimit,
            attemptsAllowed: assignment.attemptsAllowed,

            dueDate: assignment.dueDate ?? null,

            attemptsUsed,
            attemptsRemaining,

            isExpired,
            canAttempt,
        };
    }
}
