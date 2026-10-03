import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Chapter } from "../../../domain/entities/Chapter";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { UpdateChapterDTO } from "../../dtos/chapter/UpdateChapterDTO";
import { IUpdateChapterUseCase } from "../../interfaces/chapter/IUpdateChapterUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class UpdateChapterUseCase
    implements IUpdateChapterUseCase {

    constructor(
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy
    ) {}

    async execute(
        chapterId: string,
        teacherId: string,
        dto: UpdateChapterDTO
    ): Promise<Chapter> {

        const chapter =
            await this._chapterRepository.findById(
                chapterId
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
                "You are not authorized to modify this chapter",
                HttpStatusCode.FORBIDDEN
            );
        }

        if (!this._courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const updatedChapter =
            await this._chapterRepository.update(
                chapterId,
                dto
            );

        if (!updatedChapter) {
            throw new AppError(
                "Chapter update failed",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        return updatedChapter;
    }
}