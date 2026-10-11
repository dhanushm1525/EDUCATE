import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IGetAssignmentByLessonUseCase } from "../../interfaces/assingment/IGetAssignmentByLessonUseCase";

import { Assignment } from "../../../domain/entities/Assingment";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetAssignmentByLessonUseCase
    implements IGetAssignmentByLessonUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) { }

    async execute(
        lessonId: string,
        teacherId: string
    ): Promise<Assignment | null> {

        const lesson =
            await this._lessonRepository.findById(
                lessonId
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
                "You are not authorized to access this assignment",
                HttpStatusCode.FORBIDDEN
            );
        }

        return await this._assignmentRepository.findByLessonId(
            lessonId
        );
    }
}