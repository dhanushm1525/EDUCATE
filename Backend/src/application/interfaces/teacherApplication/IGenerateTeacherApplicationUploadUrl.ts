import { GenerateTeacherApplicationUploadUrlDTO } from "../../dtos/TeacherApplication/GenerateTeacherApplicationUploadUrlDTO";

import { GenerateTeacherApplicationUploadUrlResponseDTO } from "../../dtos/TeacherApplication/GenerateTeacherApplicationUploadUrlResponseDTO";

export interface IGenerateTeacherApplicationUploadUrl {
    execute(
        dto: GenerateTeacherApplicationUploadUrlDTO
    ): Promise<GenerateTeacherApplicationUploadUrlResponseDTO>;
}