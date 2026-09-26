import { AppError } from "../../../shared/errors/AppError";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { IDeleteLessonUseCase } from "../../interfaces/lesson/IDeleteLessonUseCase";

export class DeleteLessonUseCase
    implements IDeleteLessonUseCase {

    constructor(
        private readonly lessonRepository: ILessonRepository,
        private readonly chapterRepository: IChapterRepository,
        private readonly courseRepository: ICourseRepository,
        private readonly courseStatusPolicy: ICourseStatusPolicy
    ) {}

    async execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string
    ): Promise<void> {

        const lesson =
            await this.lessonRepository.findById(lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                404
            );
        }

        if (lesson.chapterId !== chapterId) {
            throw new AppError(
                "Lesson does not belong to this chapter",
                400
            );
        }

        const chapter =
            await this.chapterRepository.findById(chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                404
            );
        }

        if (chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                400
            );
        }

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
                "You are not authorized to modify this course",
                403
            );
        }

        if (!this.courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                400
            );
        }

        const deleted =
            await this.lessonRepository.delete(lessonId);

        if (!deleted) {
            throw new AppError(
                "Failed to delete lesson",
                500
            );
        }
    }
}