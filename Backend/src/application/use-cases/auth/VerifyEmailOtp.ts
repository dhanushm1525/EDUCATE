import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";

import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";
import { IEmailVerificationRepository } from "../../../domain/repositories/userRepositories/IEmailVerificationRepository";
import { ITokenHasher } from "../../interfaces/services/ITokenHasher";
import { VerifyEmailOtpDTO } from "../../dtos/auth/VerifyEmailOtpDTO";
import { VerifyEmailOtpResponseDTO } from "../../dtos/auth/VerifyEmailOtpResponseDTO";
import { IVerifyEmailOtp } from "../../interfaces/auth/IVerifyEmailOtp";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";





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
            throw new AppError(AUTH_MESSAGES.INVALID_OR_EXPIRED_OTP,HttpStatusCode.BAD_REQUEST);
        }

        if(verificationRecord.expiresAt.getTime()<=Date.now()){
            await this._emailVerificationRepository.deleteByUserId(userId);

            throw new AppError(AUTH_MESSAGES.INVALID_OR_EXPIRED_OTP,HttpStatusCode.BAD_REQUEST);
        }



        const otpHash = await this._tokenHasher.hash(otp)

        if(otpHash!==verificationRecord.otpHash){
            throw new AppError(AUTH_MESSAGES.INVALID_OTP,HttpStatusCode.BAD_REQUEST)
        }


        const user = await this._userRepository.findById(userId)


        if(!user){
            throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND,HttpStatusCode.NOT_FOUND);
        }


        user.verifyEmail();

        await this._userRepository.update(user)


        await this._emailVerificationRepository.deleteByUserId(userId)


        return {
            message: AUTH_MESSAGES.EMAIL_VERIFIED
        };
    }
}