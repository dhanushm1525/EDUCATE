import { AppError } from "../../../shared/errors/AppError";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordResetRepository } from "../../../domain/repositories/IPasswordResetRepository";
import { IOtpGenerator } from "../../interfaces/IOtpGenerator";
import { ITokenHasher } from "../../interfaces/ITokenHasher";
import { IEmailService } from "../../interfaces/IEmailService";
import { IAuthConfig } from "../../interfaces/IAuthConfig";
import { ForgotPasswordDTO } from "../../dtos/auth/ForgotPasswordDTO";
import { ForgotPasswordResponseDTO } from "../../dtos/auth/ForgotPasswordResponseDTO";



export class ForgotPassword{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _passwordResetRepository:IPasswordResetRepository,
        private readonly _otpGenerator:IOtpGenerator,
        private readonly _tokenHasher:ITokenHasher,
        private readonly _emailService:IEmailService,
        private readonly _authConfig:IAuthConfig
    ){}

    async execute(
        request:ForgotPasswordDTO
    ):Promise<ForgotPasswordResponseDTO>{
        const email = request.email.trim().toLowerCase()

        const user = await this._userRepository.findByEmail(email)

        if(!user){
            throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND,404);
        }

        if(!user.id){
            throw new AppError("user id is missing",500,false)
        }

        await this._passwordResetRepository.deleteByUserId(user.id);

        const otp = this._otpGenerator.generate()
        const otpHash = this._tokenHasher.hash(otp)

        const expiresAt  = new Date(Date.now()+this._authConfig.passwordResetOtpExpiresInMs);

        await this._passwordResetRepository.create(user.id,otpHash,expiresAt)

         await this._emailService.send(
            user.email,
            "Reset your password",
            `
                <h2>Password Reset Request</h2>

                <p>
                    Your password reset OTP is:
                </p>

                <h1>${otp}</h1>

                <p>
                    This OTP will expire soon.
                </p>
            `
        );


        return {
            message:
                "Password reset OTP sent successfully"
        };
    }
}