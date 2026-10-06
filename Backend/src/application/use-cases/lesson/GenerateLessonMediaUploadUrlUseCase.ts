import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";
import { ILessonMediaTypePolicy } from "../../../domain/policies/LessonMediaPolicy";
import { ILessonMediaKeyPolicy } from "../../../domain/policies/LessonMediaKeyPolicy";

import { IS3Client } from "../../interfaces/storage/IS3Client";

import { GenerateLessonMediaUploadUrlDTO } from "../../dtos/lesson/GenerateLessonMediaUploadUrlDTO";
import { GenerateLessonMediaUploadUrlResponseDTO } from "../../dtos/lesson/GenerateLessonMediaUploadUrlResponseDTO";

import { IGenerateLessonMediaUploadUrlUseCase } from "../../interfaces/lesson/IGenerateLessonMediaUploadUrlUseCase";

export class GenerateLessonMediaUploadUrlUseCase
    implements IGenerateLessonMediaUploadUrlUseCase {

    constructor(
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy,
        private readonly _s3Client: IS3Client,
        private readonly _mediaTypePolicy: ILessonMediaTypePolicy,
        private readonly _mediaKeyPolicy: ILessonMediaKeyPolicy,
        private readonly _bucketName: string
    ) {}

    async execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string,
        dto: GenerateLessonMediaUploadUrlDTO
    ): Promise<GenerateLessonMediaUploadUrlResponseDTO> {

        if (!this._mediaTypePolicy.supports(dto.contentType)) {
            throw new AppError(
                "Unsupported lesson media type",
                HttpStatusCode.BAD_REQUEST
            );
        }

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

        const key =
            this._mediaKeyPolicy.createKey(
                courseId,
                chapterId,
                lessonId,
                dto.fileName
            );

        const uploadUrl =
            await this._s3Client.generateUploadUrl(
                this._bucketName,
                key,
                dto.contentType,
                300
            );

        return {
            uploadUrl,
            key,
        };
    }
}