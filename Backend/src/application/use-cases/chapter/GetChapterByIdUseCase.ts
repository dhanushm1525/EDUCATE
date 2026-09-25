import { Chapter } from "../../../domain/entities/Chapter";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { AppError } from "../../../shared/errors/AppError";

import { IGetChapterByIdUseCase } from "../../interfaces/chapter/IGetChapterByIdUseCase";

export class GetChapterByIdUseCase
    implements IGetChapterByIdUseCase {

    constructor(
        private readonly chapterRepository: IChapterRepository,
        private readonly courseRepository: ICourseRepository
    ) {}

    async execute(
        chapterId: string,
        teacherId: string
    ): Promise<Chapter> {

        const chapter =
            await this.chapterRepository.findById(
                chapterId
            );

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                404
            );
        }

        const course =
            await this.courseRepository.findById(
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
                "You are not authorized to view this chapter",
                403
            );
        }

        return chapter;
    }
}