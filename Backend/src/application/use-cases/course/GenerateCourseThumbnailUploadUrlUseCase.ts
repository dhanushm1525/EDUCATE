import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { ICourseThumbnailKeyPolicy } from "../../../domain/policies/CourseThumbnailKeyPolicy";

import { ICourseThumbnailTypePolicy } from "../../../domain/policies/CourseThumbnailTypePolicy";

import { IS3Client } from "../../interfaces/storage/IS3Client";

import { GenerateCourseThumbnailUploadUrlDTO } from "../../dtos/courses/GenerateCourseThumbnailUploadUrlDTO";

import { GenerateCourseThumbnailUploadUrlResponseDTO } from "../../dtos/courses/GenerateCourseThumbnailUploadUrlResponseDTO";

import { IGenerateCourseThumbnailUploadUrlUseCase } from "../../interfaces/course/IGenerateCourseThumbnailUploadUrlUseCase";

export class GenerateCourseThumbnailUploadUrlUseCase
    implements IGenerateCourseThumbnailUploadUrlUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy,
        private readonly _s3Client: IS3Client,
        private readonly _keyPolicy: ICourseThumbnailKeyPolicy,
        private readonly _typePolicy: ICourseThumbnailTypePolicy,
        private readonly _bucketName: string
    ) { }

    async execute(
        courseId: string,
        teacherId: string,
        dto: GenerateCourseThumbnailUploadUrlDTO
    ): Promise<GenerateCourseThumbnailUploadUrlResponseDTO> {

        if (!this._typePolicy.supports(dto.contentType)) {
            throw new AppError(
                "Unsupported course thumbnail type",
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

        const key = this._keyPolicy.createKey(
            courseId,
            dto.contentType
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