import {
    IUserRepository
} from "../../../domain/repositories/IUserRepository";

import {
    IPasswordResetRepository
} from "../../../domain/repositories/IPasswordResetRepository";

import {
    IPasswordHasher
} from "../../interfaces/IPasswordHasher";

import {
    ITokenHasher
} from "../../interfaces/ITokenHasher";

import {
    IRefreshTokenRepository
} from "../../../domain/repositories/IRefreshTokenRepository";

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


export class ResetPassword {

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
                404
            );
        }


        if (!user.id) {
            throw new AppError(
                "User ID is missing",
                500,
                false
            );
        }


        
        const passwordReset =await this._passwordResetRepository.findByUserId(user.id);


        if (!passwordReset) {
            throw new AppError(
                "Invalid or expired password reset OTP",
                400
            );
        }


       
        if (passwordReset.expiresAt.getTime() <=Date.now()) {

            await this._passwordResetRepository.deleteByUserId(user.id);


            throw new AppError(
                AUTH_MESSAGES.PASSWORD_RESET_OTP_EXPIRED,
                400
            );
        }


        
        const submittedOtpHash = this._tokenHasher.hash(request.otp);


        
        const otpMatches =submittedOtpHash === passwordReset.otpHash;


        if (!otpMatches) {
            throw new AppError(
                AUTH_MESSAGES.INVALID_PASSWORD_RESET_OTP,
                400
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