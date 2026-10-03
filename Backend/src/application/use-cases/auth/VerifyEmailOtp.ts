import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";

import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";
import { IEmailVerificationRepository } from "../../../domain/repositories/userRepositories/IEmailVerificationRepository";
import { ITokenHasher } from "../../interfaces/services/ITokenHasher";
import { VerifyEmailOtpDTO } from "../../dtos/auth/VerifyEmailOtpDTO";
import { VerifyEmailOtpResponseDTO } from "../../dtos/auth/VerifyEmailOtpResponseDTO";
import { IVerifyEmailOtp } from "../../interfaces/auth/IVerifyEmailOtp";





export class VerifyEmailOtp implements IVerifyEmailOtp {
    constructor(
        private readonly _userRepository:IUserRepository,
        private readonly _emailVerificationRepository:IEmailVerificationRepository,
        private readonly _tokenHasher:ITokenHasher
    ){}


    async execute(request:VerifyEmailOtpDTO):Promise<VerifyEmailOtpResponseDTO>{

        const {userId,otp} = request;

        const verificationRecord = await this._emailVerificationRepository.findByUserId(userId);


        if(!verificationRecord){
            throw new AppError("Invalid or expired OTP",HttpStatusCode.BAD_REQUEST);
        }

        if(verificationRecord.expiresAt.getTime()<=Date.now()){
            await this._emailVerificationRepository.deleteByUserId(userId);

            throw new AppError("Invalid or expired otp",HttpStatusCode.BAD_REQUEST);
        }



        const otpHash = await this._tokenHasher.hash(otp)

        if(otpHash!==verificationRecord.otpHash){
            throw new AppError("Invalid OTP",HttpStatusCode.BAD_REQUEST)
        }


        const user = await this._userRepository.findById(userId)


        if(!user){
            throw new AppError("User not found",HttpStatusCode.NOT_FOUND);
        }


        user.verifyEmail();

        await this._userRepository.update(user)


        await this._emailVerificationRepository.deleteByUserId(userId)


        return {
            message:"Email verified successfully"
        };
    }
}