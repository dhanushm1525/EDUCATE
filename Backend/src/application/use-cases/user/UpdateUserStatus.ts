import { IUpdateUserStatus } from "../../interfaces/user/IUpdateUserStatus";

import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";

import { User } from "../../../domain/entities/User";

import { UserRole } from "../../../shared/enums/UserRole";

import { UserStatus } from "../../../shared/enums/UserStatus";

import { AppError } from "../../../shared/errors/AppError";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Types } from "mongoose";

export class UpdateUserStatus implements IUpdateUserStatus {

    constructor(
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(
        userId: string,
        status: UserStatus
    ): Promise<User> {

        if (!Types.ObjectId.isValid(userId)) {
            throw new AppError(
                "Invalid user ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        if (
            status !== UserStatus.ACTIVE &&
            status !== UserStatus.BLOCKED
        ) {
            throw new AppError(
                "Invalid user status",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw new AppError(
                "User not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (user.role === UserRole.ADMIN) {
            throw new AppError(
                "Admin accounts cannot be modified through user management",
                HttpStatusCode.FORBIDDEN
            );
        }

        user.changeStatus(status);

        return this._userRepository.update(user);
    }
}