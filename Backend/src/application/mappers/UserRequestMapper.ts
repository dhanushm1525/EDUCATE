import { GetMyProfileDTO } from "../dtos/user/GetMyProfileDTO";
import { GenerateProfileImageUploadUrlDTO } from "../dtos/user/GenerateProfileImageUploadUrlDTO";
import { UpdateProfileImageDTO } from "../dtos/user/UpdateProfileImageDTO";

export class UserRequestMapper {

    static toGetMyProfileDTO(userId: string): GetMyProfileDTO {
        return { userId };
    }

    static toGenerateProfileImageUploadUrlDTO(
        userId: string,
        body: Omit<GenerateProfileImageUploadUrlDTO, "userId">
    ): GenerateProfileImageUploadUrlDTO {
        return {
            userId,
            fileName: body.fileName,
            contentType: body.contentType,
        };
    }

    static toUpdateProfileImageDTO(
        userId: string,
        body: Omit<UpdateProfileImageDTO, "userId">
    ): UpdateProfileImageDTO {
        return {
            userId,
            avatarKey: body.avatarKey,
        };
    }
}
