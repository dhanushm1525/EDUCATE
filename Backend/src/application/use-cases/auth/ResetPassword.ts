import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    IUserRepository
} from "../../../domain/repositories/userRepositories/IUserRepository";

import {
    IPasswordResetRepository
} from "../../../domain/repositories/userRepositories/IPasswordResetRepository";

import {
    IPasswordHasher
} from "../../interfaces/services/IPasswordHasher";

import {
    ITokenHasher
} from "../../interfaces/services/ITokenHasher";

import {
    IRefreshTokenRepository
} from "../../../domain/repositories/userRepositories/IRefreshTokenRepository";

import {
    AppError
} from "../../../shared/errors/AppError";

import {
    AUTH_MESSAGES
} from "../../../shared/messages/authMessages";

import {
    ResetPasswordDTO
} from "../../dtos/auth/ResetPasswordDTO";

import {
    ResetPasswordResponseDTO
} from "../../dtos/auth/ResetPasswordResponseDTO"

import { IResetPassword } from "../../interfaces/auth/IResetPassword";


export class ResetPassword implements IResetPassword {

    constructor(
        private readonly _userRepository:
            IUserRepository,

        private readonly _passwordResetRepository:
            IPasswordResetRepository,

        private readonly _passwordHasher:
            IPasswordHasher,

        private readonly _tokenHasher:
            ITokenHasher,

        private readonly _refreshTokenRepository:
            IRefreshTokenRepository
    ) {}


    async execute(
        request: ResetPasswordDTO
    ): Promise<ResetPasswordResponseDTO> {

        const email =
            request.email
                .trim()
                .toLowerCase();


        
        const user =await this._userRepository.findByEmail(email);


        if (!user) {
            throw new AppError(
                AUTH_MESSAGES.USER_NOT_FOUND,
                HttpStatusCode.NOT_FOUND
            );
        }


        if (!user.id) {
            throw new AppError(
                AUTH_MESSAGES.USER_ID_IS_MISSING,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                false
            );
        }


        
        const passwordReset =await this._passwordResetRepository.findByUserId(user.id);


        if (!passwordReset) {
            throw new AppError(
                AUTH_MESSAGES.INVALID_OR_EXPIRED_PASSWORD_RESET_OTP,
                HttpStatusCode.BAD_REQUEST
            );
        }


       
        if (passwordReset.expiresAt.getTime() <=Date.now()) {

            await this._passwordResetRepository.deleteByUserId(user.id);


            throw new AppError(
                AUTH_MESSAGES.PASSWORD_RESET_OTP_EXPIRED,
                HttpStatusCode.BAD_REQUEST
            );
        }


        
        const submittedOtpHash = this._tokenHasher.hash(request.otp);


        
        const otpMatches =submittedOtpHash === passwordReset.otpHash;


        if (!otpMatches) {
            throw new AppError(
                AUTH_MESSAGES.INVALID_PASSWORD_RESET_OTP,
                HttpStatusCode.BAD_REQUEST
            );
        }


       
        const hashedPassword =await this._passwordHasher.hash(request.newPassword);


        
        user.changePassword(hashedPassword);


        await this._userRepository
            .update(user);


        
        await this._passwordResetRepository
            .deleteByUserId(user.id);


        
        await this._refreshTokenRepository
            .revokeAllByUserId(user.id);


        return {
            message:
                AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
        };

    }

}