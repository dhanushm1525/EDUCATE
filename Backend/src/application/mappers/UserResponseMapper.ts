import { User } from "../../domain/entities/User";
import { GetCurrentUserResponseDTO } from "../dtos/auth/GetCurrentUserResponseDTO";
import { GoogleSignInResponseDTO } from "../dtos/auth/GoogleSignInResponseDTO";
import { LoginUserResponseDTO } from "../dtos/auth/LoginUserResponseDTO";
import { RegisterUserResponseDTO } from "../dtos/auth/RegisterUserResponseDTO";
import { GetMyProfileResponseDTO } from "../dtos/user/GetMyProfileResponseDTO";

export class UserResponseMapper {
    static toCurrentUserDTO(user: User): GetCurrentUserResponseDTO {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }

    static toProfileDTO(
        user: User,
        avatar: string | undefined
    ): GetMyProfileResponseDTO {
        if (!user.id) {
            throw new Error("Cannot map a user without a user ID");
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

    static toLoginUserDTO(
        user: User
    ): LoginUserResponseDTO["user"] {
        if (!user.id) {
            throw new Error("Cannot map a user without a user ID");
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }

    static toRegisterUserDTO(user: User): RegisterUserResponseDTO {
        if (!user.id) {
            throw new Error("Cannot map a user without a user ID");
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }

    static toGoogleSignInUserDTO(
        user: User
    ): GoogleSignInResponseDTO["user"] {
        if (!user.id) {
            throw new Error("Cannot map a user without a user ID");
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
        };
    }
}
