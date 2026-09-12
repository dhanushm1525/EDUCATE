import { IStorageService } from "../../interfaces/IStorageService";

import { IGenerateProfileImageUrl } from "../../interfaces/IGenerateProfileImageUploadUrl";

import { GenerateProfileImageUploadUrlDTO } from "../../dtos/user/GenerateProfileImageUploadUrlDTO";
import { GenerateProfileImageUploadUrlResponseDTO } from "../../dtos/user/GenerateProfileImageUploadUrlResponseDTO";
import { AppError } from "../../../shared/errors/AppError";
import { randomUUID } from "crypto";



export class GenerateProfileImageUploadUrl implements IGenerateProfileImageUrl {
    constructor(
        private readonly _storageService: IStorageService
    ) { }

    async execute(dto: GenerateProfileImageUploadUrlDTO): Promise<GenerateProfileImageUploadUrlResponseDTO> {
        const allowedImageTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ]

        if(!allowedImageTypes.includes(dto.contentType)){
            throw new AppError("invalid image Type",400 )
        }

        const key = `users/${dto.userId}/profile/${randomUUID()}`;

        const uploadUrl = await this._storageService.generateUploadUrl(key,dto.contentType)

        return {
            uploadUrl,key
        }
    }
}