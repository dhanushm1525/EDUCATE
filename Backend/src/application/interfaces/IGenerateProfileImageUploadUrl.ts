import { GenerateProfileImageUploadUrlDTO } from "../dtos/user/GenerateProfileImageUploadUrlDTO";
import { GenerateProfileImageUploadUrlResponseDTO } from "../dtos/user/GenerateProfileImageUploadUrlResponseDTO";

export interface IGenerateProfileImageUrl{
    execute(dto:GenerateProfileImageUploadUrlDTO):Promise<GenerateProfileImageUploadUrlResponseDTO>
}