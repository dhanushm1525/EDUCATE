import { IStorageService } from "../../interfaces/storage/IStorageService";

import { IGenerateProfileImageUrl } from "../../interfaces/user/IGenerateProfileImageUploadUrl";

import { GenerateProfileImageUploadUrlDTO } from "../../dtos/user/GenerateProfileImageUploadUrlDTO";
import { GenerateProfileImageUploadUrlResponseDTO } from "../../dtos/user/GenerateProfileImageUploadUrlResponseDTO";
import { AppError } from "../../../shared/errors/AppError";
import { IImageTypePolicy } from "../../interfaces/user/IImageTypePolicy";
import { IProfileImagePolicy } from "../../interfaces/user/IProfileImagePolicy";



export class GenerateProfileImageUploadUrl implements IGenerateProfileImageUrl {
    constructor(
        private readonly _storageService: IStorageService,
        private readonly _imageTypePolicy: IImageTypePolicy,
        private readonly _profileImagePolicy: IProfileImagePolicy
    ) { }

    async execute(dto: GenerateProfileImageUploadUrlDTO): Promise<GenerateProfileImageUploadUrlResponseDTO> {
        if (!this._imageTypePolicy.supports(dto.contentType)) {
            throw new AppError("invalid image Type",400 )
        }

        const key = this._profileImagePolicy.createKey(dto.userId);

        const uploadUrl = await this._storageService.generateUploadUrl(key,dto.contentType)

        return {
            uploadUrl,key
        }
    }
}