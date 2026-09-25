import { Chapter } from "../../../domain/entities/Chapter";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { AppError } from "../../../shared/errors/AppError";

import { IGetChaptersByCourseUseCase } from "../../interfaces/chapter/IGetChaptersByCourseUseCase";

export class GetChaptersByCourseUseCase
    implements IGetChaptersByCourseUseCase {

    constructor(
        private readonly chapterRepository: IChapterRepository,
        private readonly courseRepository: ICourseRepository
    ) {}

    async execute(
        courseId: string,
        teacherId: string
    ): Promise<Chapter[]> {

        const course =
            await this.courseRepository.findById(courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                404
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to view this course",
                403
            );
        }

        return await this.chapterRepository.findByCourseId(
            courseId
        );
    }
}