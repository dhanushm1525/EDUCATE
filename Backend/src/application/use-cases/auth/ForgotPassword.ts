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
        private readonly userRepository:IUserRepository,
        private readonly passwordResetRepository:IPasswordResetRepository,
        private readonly otpGenerator:IOtpGenerator,
        private readonly tokenHasher:ITokenHasher,
        private readonly emailService:IEmailService,
        private readonly authConfig:IAuthConfig
    ){}

    async execute(
        request:ForgotPasswordDTO
    ):Promise<ForgotPasswordResponseDTO>{
        const email = request.email.trim().toLowerCase()

        const user = await this.userRepository.findByEmail(email)

        if(!user){
            throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND,404);
        }

        if(!user.id){
            throw new AppError("user id is missing",500,false)
        }

        await this.passwordResetRepository.deleteByUserId(user.id);

        const otp = this.otpGenerator.generate()
        const otpHash = this.tokenHasher.hash(otp)

        const expiresAt  = new Date(Date.now()+this.authConfig.passwordResetOtpExpiresInMs);

        await this.passwordResetRepository.create(user.id,otpHash,expiresAt)

         await this.emailService.send(
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