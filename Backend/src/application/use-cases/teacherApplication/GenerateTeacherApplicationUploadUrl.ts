import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { IS3Client } from "../../interfaces/storage/IS3Client";

import { ITeacherApplicationDocumentPolicy } from "../../../domain/policies/TeacherApplicationDocumentPolicy";

import { GenerateTeacherApplicationUploadUrlDTO } from "../../dtos/TeacherApplication/GenerateTeacherApplicationUploadUrlDTO";

import { GenerateTeacherApplicationUploadUrlResponseDTO } from "../../dtos/TeacherApplication/GenerateTeacherApplicationUploadUrlResponseDTO";

import { IGenerateTeacherApplicationUploadUrl } from "../../interfaces/teacherApplication/IGenerateTeacherApplicationUploadUrl";

export class GenerateTeacherApplicationUploadUrl
    implements IGenerateTeacherApplicationUploadUrl {

    constructor(
        private readonly _s3Client: IS3Client,
        private readonly _documentPolicy: ITeacherApplicationDocumentPolicy,
        private readonly _bucketName: string
    ) {}

    async execute(
        dto: GenerateTeacherApplicationUploadUrlDTO
    ): Promise<GenerateTeacherApplicationUploadUrlResponseDTO> {

        if (!this._documentPolicy.supports(dto.contentType)) {
            throw new AppError(
                "Unsupported teacher application document type",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const key = this._documentPolicy.createKey(
            dto.userId,
            dto.fileType,
            dto.contentType
        );

        const uploadUrl = await this._s3Client.generateUploadUrl(
            this._bucketName,
            key,
            dto.contentType,
            300
        );

        return {
            uploadUrl,
            key
        };
    }
}