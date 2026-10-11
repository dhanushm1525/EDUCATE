import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IDeleteAssignmentUseCase } from "../../interfaces/assingment/IDeleteAssignmentUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class DeleteAssignmentUseCase
    implements IDeleteAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        assignmentId: string,
        teacherId: string
    ): Promise<void> {

        const assignment =
            await this._assignmentRepository.findById(
                assignmentId
            );

        if (!assignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const lesson =
            await this._lessonRepository.findById(
                assignment.lessonId
            );

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const chapter =
            await this._chapterRepository.findById(
                lesson.chapterId
            );

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const course =
            await this._courseRepository.findById(
                chapter.courseId
            );

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to delete this assignment",
                HttpStatusCode.FORBIDDEN
            );
        }

        const deleted =
            await this._assignmentRepository.delete(
                assignmentId
            );

        if (!deleted) {
            throw new AppError(
                "Failed to delete assignment",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}