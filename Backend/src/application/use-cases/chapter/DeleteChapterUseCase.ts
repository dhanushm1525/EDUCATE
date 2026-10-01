import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { IDeleteChapterUseCase } from "../../interfaces/chapter/IDeleteChapterUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class DeleteChapterUseCase
    implements IDeleteChapterUseCase {

    constructor(
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy
    ) {}

    async execute(
        chapterId: string,
        teacherId: string
    ): Promise<void> {

        const chapter =
            await this._chapterRepository.findById(
                chapterId
            );

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                404
            );
        }

        const course =
            await this._courseRepository.findById(
                chapter.courseId
            );

        if (!course) {
            throw new AppError(
                "Course not found",
                404
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to delete this chapter",
                403
            );
        }

        if (!this._courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                400
            );
        }

        const deleted =
            await this._chapterRepository.delete(
                chapterId
            );

        if (!deleted) {
            throw new AppError(
                "Chapter deletion failed",
                500
            );
        }
    }
}