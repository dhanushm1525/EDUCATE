import {
    IUserRepository
} from "../../../domain/repositories/IUserRepository";

import {
    IRefreshTokenRepository
} from "../../../domain/repositories/IRefreshTokenRepository";

import {
    IPasswordHasher
} from "../../interfaces/IPasswordHasher";

import {
    IJwtService
} from "../../interfaces/IJwtService";

import {
    ITokenHasher
} from "../../interfaces/ITokenHasher";

import {
    IAuthConfig
} from "../../interfaces/IAuthConfig";

import {
    LoginUserDTO
} from "../../dtos/auth/LoginUserDTO";

import {
    LoginUserResponseDTO
} from "../../dtos/auth/LoginUserResponseDTO";

import {
    AppError
} from "../../../shared/errors/AppError";

import {
    UserStatus
} from "../../../shared/enums/UserStatus";

import {
    AUTH_MESSAGES
} from "../../../shared/messages/authMessages";


export class LoginUser {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly jwtService: IJwtService,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly tokenHasher: ITokenHasher,
        private readonly authConfig: IAuthConfig
    ) {}


    async execute(
        request: LoginUserDTO
    ): Promise<{
        response: LoginUserResponseDTO;
        refreshToken: string;
    }> {

        const email =
            request.email
                .trim()
                .toLowerCase();


        const user =
            await this.userRepository.findByEmail(
                email
            );


        /*
         * Don't reveal whether an email exists.
         */
        if (!user) {
            throw new AppError(
                AUTH_MESSAGES.INVALID_CREDENTIALS,
                401
            );
        }


        if (
            user.status ===
            UserStatus.BLOCKED
        ) {
            throw new AppError(
                AUTH_MESSAGES.ACCOUNT_BLOCKED,
                403
            );
        }


        if (!user.isVerified) {
            throw new AppError(
                AUTH_MESSAGES.EMAIL_NOT_VERIFIED,
                403
            );
        }


        const passwordMatches =
            await this.passwordHasher.compare(
                request.password,
                user.password
            );


        if (!passwordMatches) {
            throw new AppError(
                AUTH_MESSAGES.INVALID_CREDENTIALS,
                401
            );
        }


        if (!user.id) {
            throw new AppError(
                "User ID is missing",
                500,
                false
            );
        }


        const accessToken =
            this.jwtService.generateAccessToken({
                userId: user.id,
                role: user.role
            });


        const refreshToken =
            this.jwtService.generateRefreshToken(
                user.id
            );


        const tokenHash =
            this.tokenHasher.hash(
                refreshToken
            );


        const expiresAt =
            new Date(
                Date.now() +
                this.authConfig
                    .refreshTokenExpiresInMs
            );


        await this.refreshTokenRepository.create(
            user.id,
            tokenHash,
            expiresAt
        );


        return {
            response: {
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                },

                accessToken
            },

            refreshToken
        };
    }
}