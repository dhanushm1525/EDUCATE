import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";

import type { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";
import type { IStorageService } from "../../interfaces/storage/IStorageService";

import type {
    GetMyProfileDTO,
} from "../../dtos/user/GetMyProfileDTO";
import { GetMyProfileResponseDTO } from "../../dtos/user/GetMyProfileResponseDTO"
import { IProfileImagePolicy } from "../../interfaces/user/IProfileImagePolicy";

export class GetMyProfile {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _storageService: IStorageService,
        private readonly _profileImagePolicy: IProfileImagePolicy
    ) { }

    async execute(
        request: GetMyProfileDTO
    ): Promise<GetMyProfileResponseDTO> {
        const user = await this._userRepository.findById(
            request.userId
        );

        if (!user) {
            throw new AppError(
                "User not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (!user.id) {
            throw new AppError(
                "User ID is missing",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        let avatar = user.avatar;

        // Convert only custom S3 object keys into download URLs.
        // Google profile image URLs should remain unchanged.
        if (avatar && this._profileImagePolicy.isManagedImage(avatar)) {
            avatar =
                await this._storageService.generateDownloadUrl(
                    avatar
                );
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            avatar,
            status: user.status,
            createdAt: user.createdAt,
        };
    }
}