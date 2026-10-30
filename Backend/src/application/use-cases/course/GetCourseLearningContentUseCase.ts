import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { IStorageService } from "../../interfaces/storage/IStorageService";
import { IGetCourseLearningContentUseCase } from "../../interfaces/course/IGetCourseLearningContentUseCase";

import { CourseLearningContentDTO } from "../../dtos/courses/CourseLearningContentDTO";

export class GetCourseLearningContentUseCase
    implements IGetCourseLearningContentUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _storageService: IStorageService
    ) { }

    async execute(
        courseId: string
    ): Promise<CourseLearningContentDTO> {

        // 1. Verify that the course exists and is published.
        const course =
            await this._courseRepository.findPublishedById(courseId);

        if (!course) {
            throw new AppError(
                "Published course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 2. Retrieve chapters in their existing repository order.
        const chapters =
            await this._chapterRepository.findByCourseId(courseId);

        // 3. Retrieve lessons and generate thumbnail URLs.
        const chapterPreviews = await Promise.all(
            chapters.map(async (chapter) => {

                const lessons =
                    await this._lessonRepository.findByChapterId(
                        chapter.chapterId!
                    );

                const lessonPreviews = await Promise.all(
                    lessons.map(async (lesson) => {

                        let thumbnailUrl: string | undefined;

                        if (lesson.thumbnailKey) {
                            thumbnailUrl =
                                await this._storageService.generateDownloadUrl(
                                    lesson.thumbnailKey
                                );
                        }

                        return {
                            lessonId: lesson.lessonId,
                            title: lesson.title,
                            description: lesson.description,
                            order: lesson.order,
                            type: lesson.type,
                            duration: lesson.duration,
                            thumbnailUrl,
                        };
                    })
                );

                return {
                    chapterId: chapter.chapterId,
                    title: chapter.title,
                    description: chapter.description,
                    order: chapter.order,
                    outcomes: chapter.outcomes,
                    lessons: lessonPreviews,
                };
            })
        );

        return {
            chapters: chapterPreviews,
        };
    }
}