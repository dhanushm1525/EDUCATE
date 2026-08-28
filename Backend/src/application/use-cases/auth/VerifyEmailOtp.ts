import { AppError } from "../../../shared/errors/AppError";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailVerificationRepository } from "../../../domain/repositories/IEmailVerificationRepository";
import { ITokenHasher } from "../../interfaces/ITokenHasher";
import { VerifyEmailOtpDTO } from "../../dtos/auth/VerifyEmailOtpDTO";
import { VerifyEmailOtpResponseDTO } from "../../dtos/auth/VerifyEmailOtpResponseDTO";





export class VerifyEmailOtp{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly emailVerificationRepository:IEmailVerificationRepository,
        private readonly tokenHasher:ITokenHasher
    ){}


    async execute(request:VerifyEmailOtpDTO):Promise<VerifyEmailOtpResponseDTO>{

        const {userId,otp} = request;

        const verificationRecord = await this.emailVerificationRepository.findByUserId(userId);


        if(!verificationRecord){
            throw new AppError("Invalid or expired OTP",400);
        }

        if(verificationRecord.expiresAt.getTime()<=Date.now()){
            await this.emailVerificationRepository.deleteByUserId(userId);

            throw new AppError("Invalid or expired otp",400);
        }



        const otpHash = await this.tokenHasher.hash(otp)

        if(otpHash!==verificationRecord.otpHash){
            throw new AppError("Invalid OTP",400)
        }


        const user = await this.userRepository.findById(userId)


        if(!user){
            throw new AppError("User not found",404);
        }


        user.verifyEmail();

        await this.userRepository.update(user)


        await this.emailVerificationRepository.deleteByUserId(userId)


        return {
            message:"Email verified successfully"
        };
    }
}