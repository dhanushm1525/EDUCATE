import { AppError } from "../../../shared/errors/AppError";

import { Lesson } from "../../../domain/entities/Lesson";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IGetLessonsByChapterUseCase } from "../../interfaces/lesson/IGetLessonsByChapterUseCase";

export class GetLessonsByChapterUseCase
    implements IGetLessonsByChapterUseCase {

    constructor(
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        courseId: string,
        chapterId: string,
        teacherId: string
    ): Promise<Lesson[]> {

        const chapter =
            await this._chapterRepository.findById(chapterId);

        if (!chapter) {
            throw new AppError("Chapter not found", 404);
        }

        if (chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                400
            );
        }

        const course =
            await this._courseRepository.findById(courseId);

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to access this course",
                403
            );
        }

        return await this._lessonRepository.findByChapterId(
            chapterId
        );
    }
}