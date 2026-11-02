
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";

import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";

import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";

import { TeacherSubmissionDetailDTO } from "../../dtos/assingment/TeacherSubmissionDetailDTO";

import { IGetTeacherSubmissionDetailUseCase } from "../../interfaces/assingment/IGetTeacherSubmissionDetailUseCase";

import { TeacherSubmissionDetailMapper } from "../../mappers/TeacherSubmissionDetailMapper";

import { AppError } from "../../../shared/errors/AppError";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";


export class GetTeacherSubmissionDetailUseCase
    implements IGetTeacherSubmissionDetailUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(
        assignmentId: string,
        submissionId: string,
        teacherId: string
    ): Promise<TeacherSubmissionDetailDTO> {

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

        // 2. Find assignment.
        const assignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!assignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 3. Find submission.
        const submission =
            await this._submissionRepository.findById(submissionId);

        if (!submission) {
            throw new AppError(
                "Submission not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Ensure submission belongs to the requested assignment.
        if (submission.assignmentId !== assignmentId) {
            throw new AppError(
                "Submission does not belong to this assignment",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 5. Find lesson.
        const lesson =
            await this._lessonRepository.findById(assignment.lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 6. Find chapter.
        const chapter =
            await this._chapterRepository.findById(lesson.chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 7. Find course.
        const course =
            await this._courseRepository.findById(chapter.courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 8. Verify teacher ownership.
        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to view this submission",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 9. Retrieve student information.
        const student =
            await this._userRepository.findById(submission.userId);

        if (!student) {
            throw new AppError(
                "Student information not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 10. Map entities into teacher response DTO.
        return TeacherSubmissionDetailMapper.toDTO(
            submission,
            assignment,
            student
        );
    }
}
