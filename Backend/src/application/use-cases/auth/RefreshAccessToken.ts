import { AppError } from "../../../shared/errors/AppError";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";

import { IJwtService } from "../../interfaces/IJwtService";
import { ITokenHasher } from "../../interfaces/ITokenHasher";
import { IAuthConfig } from "../../interfaces/IAuthConfig";
import { RefreshAccessTokenDTO } from "../../dtos/auth/RefreshAccessTokenDTO";
import { RefreshAccessTokenResponseDTO } from "../../dtos/auth/RefreshAccessTokenResponseDTO";
import { UserStatus } from "../../../shared/enums/UserStatus";
import { IRefreshAccessToken } from "../../interfaces/IRefreshToken";


export class RefreshAccessToken implements IRefreshAccessToken {

    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _refreshTokenRepository: IRefreshTokenRepository,
        private readonly _jwtService: IJwtService,
        private readonly _tokenHasher: ITokenHasher,
        private readonly _authConfig: IAuthConfig
    ) { }

    async execute(request: RefreshAccessTokenDTO): Promise<RefreshAccessTokenResponseDTO> {
         console.log("Refresh process started");
        const { refreshToken } = request;
        console.log("Verifying refresh token");

        let payload;

        try {
            payload = this._jwtService.verifyRefreshToken(refreshToken)
        } catch {
            throw new AppError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN, 401)
        }

           console.log(
            "Token payload:",
            payload
        );

        const tokenHash = await this._tokenHasher.hash(refreshToken)

         console.log(
            "Looking for token in database"
        );


        const storedToken = await this._refreshTokenRepository.findByTokenHash(tokenHash)

           console.log(
            "Stored token:",
            storedToken
        );


        if (!storedToken) {
            throw new AppError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN, 401)
        }


        if (storedToken.revokedAt !== null) {
            await this._refreshTokenRepository.revokeAllByUserId(storedToken.userId)

            throw new AppError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN, 401)
        }


        if (storedToken.expiresAt.getTime() <= Date.now()) {

            throw new AppError(
                AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
                401
            );
        }

        if (storedToken.userId !== payload.userId) {

            throw new AppError(
                AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
                401
            );
        }


        const user =await this._userRepository.findById(storedToken.userId);


        if (!user) {

        throw new AppError(
            AUTH_MESSAGES.INVALID_REFRESH_TOKEN,
            401
        );
        }


        if (user.status === UserStatus.BLOCKED) {

        throw new AppError(AUTH_MESSAGES.ACCOUNT_BLOCKED,403);
        }


        await this._refreshTokenRepository.revokeById(storedToken.id);


        const newRefreshToken =this._jwtService.generateRefreshToken(user.id!);


        const newTokenHash =await this._tokenHasher.hash(newRefreshToken);


        const newExpiresAt =
        new Date(
            Date.now() +
            this._authConfig.refreshTokenExpiresInMs
        );


        await this._refreshTokenRepository.create(
        user.id!,
        newTokenHash,
        newExpiresAt
        );


        const newAccessToken =
        this._jwtService.generateAccessToken({
            userId: user.id!,
            role: user.role
        });


        return {
            accessToken:newAccessToken,
            refreshToken:newRefreshToken
        }


    }

}