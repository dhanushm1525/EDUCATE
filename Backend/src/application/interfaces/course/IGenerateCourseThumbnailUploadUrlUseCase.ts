import { GenerateCourseThumbnailUploadUrlDTO } from "../../dtos/courses/GenerateCourseThumbnailUploadUrlDTO";

import { GenerateCourseThumbnailUploadUrlResponseDTO } from "../../dtos/courses/GenerateCourseThumbnailUploadUrlResponseDTO";

export interface IGenerateCourseThumbnailUploadUrlUseCase {
    execute(
        courseId: string,
        teacherId: string,
        dto: GenerateCourseThumbnailUploadUrlDTO
    ): Promise<GenerateCourseThumbnailUploadUrlResponseDTO>;
}