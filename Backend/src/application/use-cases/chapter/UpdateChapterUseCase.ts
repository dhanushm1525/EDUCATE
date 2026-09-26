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
        private readonly chapterRepository: IChapterRepository,
        private readonly courseRepository: ICourseRepository,
        private readonly courseStatusPolicy: ICourseStatusPolicy
    ) {}

    async execute(
        chapterId: string,
        teacherId: string,
        dto: UpdateChapterDTO
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
                "You are not authorized to modify this chapter",
                403
            );
        }

        if (!this.courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                400
            );
        }

        const updatedChapter =
            await this.chapterRepository.update(
                chapterId,
                dto
            );

        if (!updatedChapter) {
            throw new AppError(
                "Chapter update failed",
                500
            );
        }

        return updatedChapter;
    }
}