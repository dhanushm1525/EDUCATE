import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Chapter } from "../../../domain/entities/Chapter";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { AppError } from "../../../shared/errors/AppError";

import { IGetChapterByIdUseCase } from "../../interfaces/chapter/IGetChapterByIdUseCase";

export class GetChapterByIdUseCase
    implements IGetChapterByIdUseCase {

    constructor(
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        chapterId: string,
        teacherId: string
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
                "You are not authorized to view this chapter",
                HttpStatusCode.FORBIDDEN
            );
        }

        return chapter;
    }
}