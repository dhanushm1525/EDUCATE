import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";
import { ILessonMediaKeyPolicy } from "../../../domain/policies/LessonMediaKeyPolicy";

import { IS3Client } from "../../interfaces/storage/IS3Client";
import { CleanupLessonMediaDTO } from "../../dtos/lesson/CleanupLessonMediaDTO";
import { ICleanupLessonMediaUseCase } from "../../interfaces/lesson/ICleanupLessonMediaUseCase";

export class CleanupLessonMediaUseCase
    implements ICleanupLessonMediaUseCase {

    constructor(
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy,
        private readonly _lessonMediaKeyPolicy: ILessonMediaKeyPolicy,
        private readonly _s3Client: IS3Client,
        private readonly _bucketName: string
    ) { }

    async execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string,
        dto: CleanupLessonMediaDTO
    ): Promise<void> {
        const lesson = await this._lessonRepository.findById(lessonId);

        if (!lesson) {
            throw new AppError("Lesson not found", HttpStatusCode.NOT_FOUND);
        }

        if (lesson.chapterId !== chapterId) {
            throw new AppError(
                "Lesson does not belong to this chapter",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const chapter = await this._chapterRepository.findById(chapterId);

        if (!chapter || chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const course = await this._courseRepository.findById(courseId);

        if (!course) {
            throw new AppError("Course not found", HttpStatusCode.NOT_FOUND);
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

        const key = dto.key.trim();

        if (
            !key ||
            !this._lessonMediaKeyPolicy.isOwnedByLesson(
                key,
                courseId,
                chapterId,
                lessonId
            )
        ) {
            throw new AppError(
                "Invalid lesson media key",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // Don't delete the currently saved video.
        if (lesson.videoKey === key) {
            throw new AppError(
                "Cannot clean up media currently attached to the lesson",
                HttpStatusCode.BAD_REQUEST
            );
        }

        await this._s3Client.deleteFile(this._bucketName, key);
    }
}