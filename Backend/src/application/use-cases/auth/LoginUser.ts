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
import { AuthProvider } from "../../../shared/enums/AuthProvider";
import { ILoginUser } from "../../interfaces/ILoginUser";


export class LoginUser implements ILoginUser{

    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _jwtService: IJwtService,
        private readonly _refreshTokenRepository: IRefreshTokenRepository,
        private readonly _tokenHasher: ITokenHasher,
        private readonly _authConfig: IAuthConfig
    ) { }


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
            await this._userRepository.findByEmail(
                email
            );



        if (!user) {
            throw new AppError(
                AUTH_MESSAGES.INVALID_CREDENTIALS,
                401
            );
        }

        if(user.authProvider === AuthProvider.GOOGLE){
            throw new AppError("Please sign in using Google",400)
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

        if (!user.password) {

            throw new AppError(
                AUTH_MESSAGES.INVALID_CREDENTIALS,
                401
            );

        }


        const passwordMatches =
            await this._passwordHasher.compare(
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
            this._jwtService.generateAccessToken({
                userId: user.id,
                role: user.role
            });


        const refreshToken =
            this._jwtService.generateRefreshToken(
                user.id
            );


        const tokenHash =
            await this._tokenHasher.hash(
                refreshToken
            );


        const expiresAt =
            new Date(
                Date.now() +
                this._authConfig
                    .refreshTokenExpiresInMs
            );


        await this._refreshTokenRepository.create(
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