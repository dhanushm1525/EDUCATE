import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository"
import { IUpdateProfileImage } from "../../interfaces/user/IUpdateProfileImage";
import { UpdateProfileImageDTO } from "../../dtos/user/UpdateProfileImageDTO";
import { User } from "../../../domain/entities/User";
import { AppError } from "../../../shared/errors/AppError";
import { IProfileImagePolicy } from "../../interfaces/user/IProfileImagePolicy";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export class UpdateProfileImage implements IUpdateProfileImage {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _profileImagePolicy: IProfileImagePolicy
    ) { }

    async execute(dto: UpdateProfileImageDTO): Promise<User> {
        if (!dto.avatarKey || !dto.avatarKey.trim()) {
            throw new AppError("Avatar key is required", HttpStatusCode.BAD_REQUEST);
        }

        if (!this._profileImagePolicy.isOwnedByUser(
            dto.avatarKey,
            dto.userId
        )) {
            throw new AppError("Invalid avatar key", HttpStatusCode.BAD_REQUEST);
        }

        const user = await this._userRepository.findById(dto.userId);

        if (!user) {
            throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND, HttpStatusCode.NOT_FOUND);
        }

        user.updateAvatar(dto.avatarKey);

        return this._userRepository.update(user);
    }
}