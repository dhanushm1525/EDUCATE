import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";

import { Lesson } from "../../../domain/entities/Lesson";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { UpdateLessonDTO } from "../../dtos/lesson/UpdateLessonDTO";
import { IUpdateLessonUseCase } from "../../interfaces/lesson/IUpdateLessonUseCase";
import { ILessonMediaKeyPolicy } from "../../../domain/policies/LessonMediaKeyPolicy";

export class UpdateLessonUseCase
    implements IUpdateLessonUseCase {

    constructor(
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy,
        private readonly _lessonMediaKeyPolicy: ILessonMediaKeyPolicy
    ) { }

    async execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string,
        dto: UpdateLessonDTO
    ): Promise<Lesson> {

        const lesson =
            await this._lessonRepository.findById(lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (lesson.chapterId !== chapterId) {
            throw new AppError(
                "Lesson does not belong to this chapter",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const chapter =
            await this._chapterRepository.findById(chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const course =
            await this._courseRepository.findById(courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to modify this course",
                HttpStatusCode.FORBIDDEN
            );
        }

        if (!this._courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                HttpStatusCode.BAD_REQUEST
            );
        }

        if (dto.videoKey!==undefined) {
            const isOwned =
                this._lessonMediaKeyPolicy.isOwnedByLesson(
                    dto.videoKey,
                    courseId,
                    chapterId,
                    lessonId
                );

            if (!isOwned) {
                throw new AppError(
                    "Invalid lesson media key",
                    HttpStatusCode.BAD_REQUEST
                );
            }
        }

        const updatedLesson =
            await this._lessonRepository.update(
                lessonId,
                dto
            );

        if (!updatedLesson) {
            throw new AppError(
                "Failed to update lesson",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        return updatedLesson;
    }
}