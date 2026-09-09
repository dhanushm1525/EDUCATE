import { AppError } from "../../../shared/errors/AppError";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailVerificationRepository } from "../../../domain/repositories/IEmailVerificationRepository";
import { ITokenHasher } from "../../interfaces/ITokenHasher";
import { VerifyEmailOtpDTO } from "../../dtos/auth/VerifyEmailOtpDTO";
import { VerifyEmailOtpResponseDTO } from "../../dtos/auth/VerifyEmailOtpResponseDTO";





export class VerifyEmailOtp{
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _emailVerificationRepository:IEmailVerificationRepository,
        private readonly _tokenHasher:ITokenHasher
    ){}


    async execute(request:VerifyEmailOtpDTO):Promise<VerifyEmailOtpResponseDTO>{

        const {userId,otp} = request;

        const verificationRecord = await this._emailVerificationRepository.findByUserId(userId);


        if(!verificationRecord){
            throw new AppError("Invalid or expired OTP",400);
        }

        if(verificationRecord.expiresAt.getTime()<=Date.now()){
            await this._emailVerificationRepository.deleteByUserId(userId);

            throw new AppError("Invalid or expired otp",400);
        }



        const otpHash = await this._tokenHasher.hash(otp)

        if(otpHash!==verificationRecord.otpHash){
            throw new AppError("Invalid OTP",400)
        }


        const user = await this._userRepository.findById(userId)


        if(!user){
            throw new AppError("User not found",404);
        }


        user.verifyEmail();

        await this._userRepository.update(user)


        await this._emailVerificationRepository.deleteByUserId(userId)


        return {
            message:"Email verified successfully"
        };
    }
}