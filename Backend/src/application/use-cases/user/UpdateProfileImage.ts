import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository"
import { IUpdateProfileImage } from "../../interfaces/IUpdateProfileImage";
import { UpdateProfileImageDTO } from "../../dtos/user/UpdateProfileImageDTO";
import { User } from "../../../domain/entities/User";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateProfileImage implements IUpdateProfileImage {
    constructor(
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(dto: UpdateProfileImageDTO): Promise<User> {
        if (!dto.avatarKey || !dto.avatarKey.trim()) {
            throw new AppError("Avatar key is required", 400);
        }

        const expectedPrefix = `users/${dto.userId}/profile/`;

        if (!dto.avatarKey.startsWith(expectedPrefix)) {
            throw new AppError("Invalid avatar key", 400);
        }

        const user = await this._userRepository.findById(dto.userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        user.updateAvatar(dto.avatarKey);

        return this._userRepository.update(user);
    }
}